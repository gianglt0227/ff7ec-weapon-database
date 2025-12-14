/**
 * Loading State Management
 * Handles display of loading spinners during async operations
 */

/**
 * Shows a loading spinner in the output container
 * @param {string} message - Optional loading message to display
 */
function showLoadingSpinner(message = 'Loading weapon data...') {
    const outputDiv = document.getElementById('Output');
    if (!outputDiv) return;

    outputDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 px-4">
            <div class="relative">
                <!-- Spinning circle -->
                <div class="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary rounded-full animate-spin"></div>
                <!-- Center icon -->
                <div class="absolute inset-0 flex items-center justify-center">
                    <span class="material-symbols-outlined text-primary text-2xl">swords</span>
                </div>
            </div>
            <p class="mt-6 text-lg font-medium text-gray-700 dark:text-gray-200">${message}</p>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">This may take a moment...</p>
        </div>
    `;
}

/**
 * Hides the loading spinner (content will be replaced by table rendering)
 */
function hideLoadingSpinner() {
    // No action needed - table rendering will replace the spinner content
    // This function exists for semantic completeness and future enhancements
}

/**
 * Shows an error message if loading fails
 * @param {string} message - Error message to display
 */
function showLoadingError(message = 'Failed to load weapon data') {
    const outputDiv = document.getElementById('Output');
    if (!outputDiv) return;

    outputDiv.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16 px-4">
            <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-red-500 text-3xl">error</span>
            </div>
            <p class="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">${message}</p>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Please try again or refresh the page.</p>
            <button onclick="location.reload()"
                    class="mt-6 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
                Reload Page
            </button>
        </div>
    `;
}
