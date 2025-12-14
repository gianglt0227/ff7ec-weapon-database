/**
 * Display the last update date of weaponData.csv
 * To update: git log -1 --format="%ad" --date=format:'%Y/%m/%d' -- weaponData.csv
 */
function displayLastUpdateDate() {
    const lastUpdateElement = document.getElementById('lastUpdateDate');
    const lastCommitDate = '2025/11/30';
    lastUpdateElement.textContent = lastCommitDate;
}

// Display last update date on page load
document.addEventListener('DOMContentLoaded', displayLastUpdateDate);
