/**
 * Theme Manager
 * Handles dark mode persistence and system preference detection
 */

/**
 * Initialize theme on page load
 * Respects user's saved preference or system preference
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

/**
 * Toggle theme between light and dark
 * Saves preference to localStorage
 */
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Update button icon visibility
    updateThemeButtonIcons(isDark);
}

/**
 * Update theme button icons based on current theme
 * @param {boolean} isDark - Whether dark mode is active
 */
function updateThemeButtonIcons(isDark) {
    const darkModeIcon = document.querySelector('[data-theme-icon="dark"]');
    const lightModeIcon = document.querySelector('[data-theme-icon="light"]');

    if (darkModeIcon && lightModeIcon) {
        if (isDark) {
            // In dark mode, show light mode icon (to switch to light)
            darkModeIcon.classList.add('hidden');
            lightModeIcon.classList.remove('hidden');
        } else {
            // In light mode, show dark mode icon (to switch to dark)
            darkModeIcon.classList.remove('hidden');
            lightModeIcon.classList.add('hidden');
        }
    }
}

// Initialize theme on page load
initializeTheme();

// Update icons after theme is initialized
window.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    updateThemeButtonIcons(isDark);
});
