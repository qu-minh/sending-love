import pages from './pages';

// Simple service layer to allow future REST integration
// Swap implementation to fetch from API later without touching components
export async function getPages() {
    // In the future: return fetch('/api/pages').then(r => r.json())
    return pages;
}
