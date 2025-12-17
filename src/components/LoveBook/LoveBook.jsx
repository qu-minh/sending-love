import { useEffect, useRef, useState } from 'react';
import { getReveal, shouldSwipe, SWIPE_THRESHOLD_RATIO } from '../../models/cardStack';
import { getPages } from '../../models/pageService';
import './LoveBook.css';

const LoveBook = () => {
    // Card reader mode: swipe top card to continue reading; swiped card goes to back
    const bookRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [delta, setDelta] = useState({ x: 0, y: 0 });
    const [leavingDir, setLeavingDir] = useState(0); // -1 left, 1 right, 0 none
    const leavingDirRef = useRef(0);
    const animatingRef = useRef(false);

    // Cards ordering (loaded via model/service)
    const [cards, setCards] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const data = await getPages();
            if (mounted) setCards(data);
        })();
        return () => { mounted = false; };
    }, []);

    const handleCardStart = (e) => {
        const point = e.touches ? e.touches[0] : e;
        if (leavingDirRef.current !== 0 || animatingRef.current) return;
        setIsDragging(true);
        setStartPos({ x: point.clientX, y: point.clientY });
        setDelta({ x: 0, y: 0 });
        setLeavingDir(0);
        leavingDirRef.current = 0;
    };

    const handleCardMove = (e) => {
        if (!isDragging || leavingDir !== 0) return;
        const point = e.touches ? e.touches[0] : e;
        const dx = point.clientX - startPos.x;
        const dy = point.clientY - startPos.y;
        setDelta({ x: dx, y: dy });
    };

    const handleCardEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const width = bookRef.current?.offsetWidth || 800;
        const threshold = width * SWIPE_THRESHOLD_RATIO;
        if (shouldSwipe(delta.x, width)) {
            const dir = delta.x > 0 ? 1 : -1;
            setLeavingDir(dir);
            leavingDirRef.current = dir;
            animatingRef.current = true;
        } else {
            setDelta({ x: 0, y: 0 });
            setLeavingDir(0);
            leavingDirRef.current = 0;
        }
    };

    const handleTopCardTransitionEnd = (e) => {
        // Only react to the top card's transform finishing once
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== 'transform') return;
        if (!animatingRef.current) return;
        if (leavingDirRef.current === 0) return;
        // Move top card to end and reset
        setCards((prev) => {
            if (prev.length <= 1) return prev;
            const [first, ...rest] = prev;
            return [...rest, first];
        });
        setDelta({ x: 0, y: 0 });
        setLeavingDir(0);
        leavingDirRef.current = 0;
        animatingRef.current = false;
    };

    return (
        <div className="love-book-container">
            <div
                className="cards-wrapper"
                ref={bookRef}
                onMouseDown={handleCardStart}
                onMouseMove={handleCardMove}
                onMouseUp={handleCardEnd}
                onMouseLeave={handleCardEnd}
                onTouchStart={handleCardStart}
                onTouchMove={handleCardMove}
                onTouchEnd={handleCardEnd}
            >
                <div className="cards-area">
                    {cards.slice(0, 4).map((card, index) => {
                        const isTop = index === 0;
                        const depth = Math.min(index, 3);
                        const baseTranslateY = depth * 12;
                        const baseScale = 1 - depth * 0.035;

                        const width = bookRef.current?.offsetWidth || 800;
                        const reveal = getReveal(delta.x, width);

                        const rotate = isTop ? Math.max(-15, Math.min(15, delta.x * 0.05)) : 0;
                        const translateX = isTop
                            ? (leavingDir !== 0 ? leavingDir * width * 1.2 : delta.x)
                            : (index === 1 ? Math.max(-30, Math.min(30, -delta.x * 0.06)) : 0);

                        let translateY = isTop ? delta.y : baseTranslateY;
                        let scale = isTop ? 1 : baseScale;

                        if (!isTop && index === 1) {
                            // Reveal the next card while dragging the top card
                            translateY = baseTranslateY - 20 * reveal;
                            scale = baseScale + 0.03 * reveal;
                        }

                        if (!isTop && index === 1 && leavingDir !== 0) {
                            // As top card leaves, promote the second card smoothly
                            translateY = 0;
                            scale = 1;
                        }

                        const transition = isTop
                            ? (leavingDir !== 0 ? 'transform 0.35s ease' : (isDragging ? 'none' : 'transform 0.25s ease'))
                            : 'transform 0.25s ease';
                        const zIndex = 1000 - index;
                        const pointerEvents = isTop ? 'auto' : 'none';
                        const style = {
                            transform: `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                            transition,
                            zIndex,
                            pointerEvents,
                        };
                        const hasText = Boolean((card.title && card.title.trim()) || (card.content && card.content.trim()));
                        const bgUrl = card.imageAsset
                            ? new URL(`../../assets/${card.imageAsset}`, import.meta.url).href
                            : (card.image || null);
                        return (
                            <div
                                key={card.id}
                                className={`card ${bgUrl ? 'has-image' : ''} ${bgUrl && !hasText ? 'image-only' : ''} ${isTop && leavingDir !== 0 ? 'leaving' : ''} ${!bgUrl && card.bgGradient ? 'bg-gradient-to-br ' + card.bgGradient : ''}`}
                                style={style}
                                onTransitionEnd={isTop ? handleTopCardTransitionEnd : undefined}
                            >
                                {bgUrl && (
                                    <>
                                        <div
                                            className="card-bg"
                                            style={{
                                                backgroundImage: `url(${bgUrl})`,
                                                filter:
                                                    hasText
                                                        ? `blur(${typeof card.imageBlur === "number" ? card.imageBlur : 6}px)`
                                                        : "none",
                                                transform: hasText ? "scale(1.06)" : "none",
                                            }}
                                        />
                                        <div
                                            className="card-bg-overlay"
                                            style={{
                                                background:
                                                    hasText
                                                        ? `rgba(0,0,0, ${typeof card.imageOverlayOpacity === "number" ? card.imageOverlayOpacity : 0.35})`
                                                        : "transparent",
                                            }}
                                        />
                                    </>
                                )}
                                {hasText && (
                                    <div className="card-content">
                                        <div className="page-number">Trang {card.id + 1}</div>
                                        <div className="emoji-large">{card.emoji}</div>
                                        <h2 className="page-title">{card.title}</h2>
                                        <div className="page-text">{card.content}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LoveBook;
