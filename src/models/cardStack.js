export const SWIPE_THRESHOLD_RATIO = 0.22;
export const REVEAL_DENOM_RATIO = 0.25;

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function getReveal(deltaX, width, denom = REVEAL_DENOM_RATIO) {
    if (!width || width <= 0) return 0;
    const ratio = Math.abs(deltaX) / (width * denom);
    return clamp(ratio, 0, 1);
}

export function shouldSwipe(deltaX, width, ratio = SWIPE_THRESHOLD_RATIO) {
    if (!width || width <= 0) return false;
    return Math.abs(deltaX) > width * ratio;
}

export function reorderTopToBack(cards) {
    if (!Array.isArray(cards) || cards.length <= 1) return cards;
    const [first, ...rest] = cards;
    return [...rest, first];
}
