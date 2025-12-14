const searchButton = document.getElementById('searchButton');
const searchDropdown = document.getElementById('ecDropdown');

document.addEventListener('click', (e) => {
    if (!searchButton.contains(e.target) && !searchDropdown.contains(e.target)) {
        if (searchDropdown.classList.contains('show')) {
            searchDropdown.classList.remove('show');
        }
        searchButton.querySelector('.ml-auto').textContent = 'expand_more';
    } else if (searchDropdown.classList.contains('show')) {
        searchButton.querySelector('.ml-auto').textContent = 'expand_less';
    }
});
