const searchButton = document.getElementById('searchButton');
const searchDropdown = document.getElementById('ecDropdown');

/**
 * Closes the search dropdown and updates button icon
 */
function closeDropdown() {
    searchDropdown.classList.remove('show');
    searchButton.querySelector('.ml-auto').textContent = 'expand_more';
}

document.addEventListener('click', (e) => {
    if (!searchButton.contains(e.target) && !searchDropdown.contains(e.target)) {
        if (searchDropdown.classList.contains('show')) {
            closeDropdown();
        }
    } else if (searchDropdown.classList.contains('show')) {
        searchButton.querySelector('.ml-auto').textContent = 'expand_less';
    }
});
