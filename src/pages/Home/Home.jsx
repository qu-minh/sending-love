import { useEffect, useState } from 'react';
import Button from '../../components/Button/Button';

const Home = () => {
    const [currentMessage, setCurrentMessage] = useState(0);
    const [hearts, setHearts] = useState([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [sparkles, setSparkles] = useState([]);
    const [interactiveHearts, setInteractiveHearts] = useState([]);
    const [particles, setParticles] = useState([]);
    const [stars, setStars] = useState([]);
    const [draggedHeart, setDraggedHeart] = useState(null);
    const [heartTrails, setHeartTrails] = useState([]);

    const loveMessages = [
        {
            title: "Em là ánh sáng của anh",
            content: "Mỗi ngày thức dậy và nhìn thấy em, anh cảm thấy may mắn biết bao. Em là lý do để anh cố gắng hơn mỗi ngày.",
            emoji: "☀️"
        },
        {
            title: "Cảm ơn em đã ở bên anh",
            content: "Cảm ơn em đã tin tưởng, đồng hành và yêu thương anh. Em là món quà quý giá nhất mà cuộc đời trao cho anh.",
            emoji: "🎁"
        },
        {
            title: "Anh yêu em vô cùng",
            content: "Tình yêu của anh dành cho em không có giới hạn. Em mãi mãi là người phụ nữ duy nhất trong trái tim anh.",
            emoji: "❤️"
        },
        {
            title: "Mãi mãi bên nhau",
            content: "Dù có chuyện gì xảy ra, anh sẽ luôn ở bên em. Chúng ta sẽ cùng nhau vượt qua mọi khó khăn và xây dựng tương lai tươi đẹp.",
            emoji: "🤝"
        }
    ];

    const memories = [
        { year: "2020", event: "Ngày đầu tiên gặp nhau", icon: "✨" },
        { year: "2021", event: "Lần đầu nắm tay nhau", icon: "🤝" },
        { year: "2022", event: "Ngày anh cầu hôn em", icon: "💍" },
        { year: "2023", event: "Ngày cưới của chúng ta", icon: "💒" },
        { year: "2024", event: "Kỷ niệm 1 năm ngày cưới", icon: "🎉" },
        { year: "2025", event: "Mãi yêu và hạnh phúc", icon: "💖" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % loveMessages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Create heart trail
            if (Math.random() > 0.95) {
                const trail = {
                    id: Date.now() + Math.random(),
                    x: e.clientX,
                    y: e.clientY,
                    tx: (Math.random() - 0.5) * 100,
                    ty: (Math.random() - 0.5) * 100,
                };
                setHeartTrails(prev => [...prev, trail]);
                setTimeout(() => {
                    setHeartTrails(prev => prev.filter(t => t.id !== trail.id));
                }, 1500);
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Initialize particles and stars
    useEffect(() => {
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            tx: (Math.random() - 0.5) * 200,
            ty: (Math.random() - 0.5) * 200,
            delay: Math.random() * 8,
            duration: 8 + Math.random() * 4,
        }));
        setParticles(newParticles);

        const newStars = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
        }));
        setStars(newStars);
    }, []);

    const createSparkle = (e) => {
        const rect = e.target.getBoundingClientRect();
        const newSparkle = {
            id: Date.now() + Math.random(),
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setSparkles((prev) => [...prev, newSparkle]);
        setTimeout(() => {
            setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
        }, 1000);
    };

    const createHeart = () => {
        const newHeart = {
            id: Date.now(),
            left: Math.random() * 100,
        };
        setHearts((prev) => [...prev, newHeart]);
        setTimeout(() => {
            setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 3000);
    };

    const createInteractiveHeart = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const newHeart = {
            id: Date.now() + Math.random(),
            x: e.clientX - rect.left - 40,
            y: e.clientY - rect.top - 40,
            rotation: Math.random() * 360,
        };
        setInteractiveHearts((prev) => [...prev.slice(-9), newHeart]);
    };

    const handleHeartDragStart = (e, heart) => {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedHeart(heart);
    };

    const handleHeartDrag = (e, heartId) => {
        if (e.clientX === 0 && e.clientY === 0) return;
        setInteractiveHearts(prev => prev.map(h =>
            h.id === heartId
                ? { ...h, x: e.clientX - 40, y: e.clientY - 40 }
                : h
        ));
    };

    const handleHeartDragEnd = () => {
        setDraggedHeart(null);
    };

    const removeInteractiveHeart = (heartId) => {
        setInteractiveHearts(prev => prev.filter(h => h.id !== heartId));
    };

    return (
        <div className="relative overflow-hidden">
            {/* Animated Background */}
            <div className="animated-bg">
                {/* Gradient Mesh */}
                <div className="gradient-mesh"></div>

                {/* Particles */}
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            '--tx': `${particle.tx}px`,
                            '--ty': `${particle.ty}px`,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`,
                        }}
                    />
                ))}

                {/* Stars */}
                {stars.map((star) => (
                    <div
                        key={star.id}
                        className="star"
                        style={{
                            left: `${star.left}%`,
                            top: `${star.top}%`,
                            animationDelay: `${star.delay}s`,
                            animationDuration: `${star.duration}s`,
                        }}
                    />
                ))}
            </div>

            {/* Heart Trails */}
            {heartTrails.map((trail) => (
                <div
                    key={trail.id}
                    className="heart-trail fixed text-2xl z-20"
                    style={{
                        left: trail.x,
                        top: trail.y,
                        '--trail-x': `${trail.tx}px`,
                        '--trail-y': `${trail.ty}px`,
                    }}
                >
                    💗
                </div>
            ))}

            {/* Floating Hearts Animation */}
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="fixed text-4xl animate-float pointer-events-none z-10"
                    style={{
                        left: `${heart.left}%`,
                        bottom: '0',
                        animation: 'float 3s ease-in-out forwards',
                    }}
                >
                    💖
                </div>
            ))}

            {/* Interactive 3D Hearts */}
            {interactiveHearts.map((heart) => (
                <div
                    key={heart.id}
                    className="heart-3d fixed z-30"
                    draggable
                    onDragStart={(e) => handleHeartDragStart(e, heart)}
                    onDrag={(e) => handleHeartDrag(e, heart.id)}
                    onDragEnd={handleHeartDragEnd}
                    onDoubleClick={() => removeInteractiveHeart(heart.id)}
                    style={{
                        left: heart.x,
                        top: heart.y,
                        transform: `rotate(${heart.rotation}deg)`,
                    }}
                >
                    <div className="text-6xl select-none">❤️</div>
                </div>
            ))}

            {/* Parallax Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div
                    className="absolute w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-20 animate-float-up-down"
                    style={{
                        left: `${20 + mousePosition.x * 0.02}px`,
                        top: `${10 + mousePosition.y * 0.02}px`,
                    }}
                />
                <div
                    className="absolute w-96 h-96 bg-rose-300 rounded-full blur-3xl opacity-20 animate-float-up-down"
                    style={{
                        right: `${20 - mousePosition.x * 0.02}px`,
                        bottom: `${10 - mousePosition.y * 0.02}px`,
                        animationDelay: '1s',
                    }}
                />
            </div>

            {/* Hero Section */}
            <section
                id="home"
                className="relative min-h-screen flex items-center justify-center py-12 sm:py-20 cursor-pointer"
                onClick={createInteractiveHeart}
            >
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <div className="mb-8 sm:mb-12">
                        <div className="relative inline-block mb-6">
                            <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-gradient animate-gradient mb-4 sm:mb-6 drop-shadow-2xl">
                                Gửi Em Yêu Dấu
                            </h1>
                            <div className="absolute -top-8 -right-8 text-4xl animate-float-up-down">
                                ✨
                            </div>
                            <div className="absolute -bottom-8 -left-8 text-4xl animate-float-up-down" style={{ animationDelay: '1s' }}>
                                💫
                            </div>
                        </div>
                        <div className="relative inline-block">
                            <div className="text-6xl sm:text-8xl lg:text-9xl mb-4 sm:mb-6 animate-float-up-down cursor-pointer transform hover:scale-125 transition-transform duration-300"
                                onClick={createHeart}
                            >
                                💕
                            </div>
                        </div>
                        <p className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-red-600 bg-clip-text text-transparent animate-gradient">
                            Người phụ nữ tuyệt vời nhất trên đời
                        </p>
                    </div>
                    <div className="relative inline-block">
                        <Button
                            onClick={createHeart}
                            variant="primary"
                            className="text-base sm:text-xl px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 animate-gradient animate-pulse-glow shadow-2xl transform hover:scale-110 transition-all duration-300 font-bold"
                        >
                            💖 Gửi trái tim cho em 💖
                        </Button>
                    </div>
                </div>
            </section>

            {/* Love Messages Section */}
            <section id="messages" className="relative py-12 sm:py-20">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 opacity-90"></div>
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-center mb-8 sm:mb-16">
                        <span className="text-gradient animate-gradient">💌 Những Lời Anh Muốn Nói</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 perspective-container">
                        {loveMessages.map((message, index) => (
                            <div
                                key={index}
                                className={`card-3d glass-morphism bg-gradient-to-br from-pink-100/80 via-rose-100/80 to-red-100/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl border-2 border-white/30 ${currentMessage === index ? 'ring-4 ring-pink-500 scale-105' : ''
                                    } cursor-pointer relative overflow-hidden group`}
                                onMouseMove={createSparkle}
                            >
                                {/* Sparkle Effects */}
                                {sparkles.filter(s => Math.random() > 0.5).map((sparkle) => (
                                    <div
                                        key={sparkle.id}
                                        className="absolute w-2 h-2 bg-pink-400 rounded-full animate-[sparkle_1s_ease-out]"
                                        style={{
                                            left: `${sparkle.x}px`,
                                            top: `${sparkle.y}px`,
                                        }}
                                    />
                                ))}
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative z-10">
                                    <div className="text-5xl sm:text-6xl mb-6 text-center animate-float-up-down transform group-hover:scale-125 transition-transform duration-300">
                                        {message.emoji}
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-4 sm:mb-6 text-center">
                                        {message.title}
                                    </h3>
                                    <p className="text-base sm:text-lg lg:text-xl text-gray-800 leading-relaxed text-center font-medium">
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Memories Timeline */}
            <section id="memories" className="py-12 sm:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 mb-8 sm:mb-16">
                        📅 Hành Trình Của Chúng Ta
                    </h2>
                    <div className="space-y-6 sm:space-y-8">
                        {memories.map((memory, index) => (
                            <div
                                key={index}
                                className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-8 ${index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                                    }`}
                            >
                                <div className="w-full sm:w-1/3 text-center sm:text-left">
                                    <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                                        {memory.year}
                                    </span>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg">
                                        {memory.icon}
                                    </div>
                                </div>
                                <div className="w-full sm:w-1/3 text-center sm:text-left">
                                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
                                        <p className="text-base sm:text-lg font-medium text-gray-800">
                                            {memory.event}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Message */}
            <section className="relative py-16 sm:py-32 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 animate-gradient overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float-up-down"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-float-up-down" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-rose-300 rounded-full blur-2xl animate-float-up-down" style={{ animationDelay: '2s' }}></div>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <div className="mb-8 sm:mb-12">
                        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8 drop-shadow-2xl animate-float-up-down">
                            Anh Yêu Em Vô Cùng! 💖
                        </h2>
                        <div className="inline-block glass-morphism rounded-3xl p-6 sm:p-10 border-2 border-white/30 backdrop-blur-xl shadow-2xl">
                            <p className="text-xl sm:text-3xl lg:text-4xl text-white font-bold leading-relaxed">
                                Cảm ơn em đã luôn ở bên anh. <br className="hidden sm:block" />
                                Em là tất cả những gì anh cần.
                            </p>
                            <div className="mt-6 sm:mt-8 flex justify-center gap-4 text-4xl sm:text-6xl animate-float-up-down">
                                <span>❤️</span>
                                <span style={{ animationDelay: '0.5s' }} className="animate-float-up-down">💕</span>
                                <span style={{ animationDelay: '1s' }} className="animate-float-up-down">💖</span>
                            </div>
                            <p className="text-2xl sm:text-4xl text-white/95 font-black mt-6 sm:mt-8">
                                Mãi mãi yêu em! ∞
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
