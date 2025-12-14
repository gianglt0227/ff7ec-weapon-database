// Character Filter Logic
// Manages the global character filter state and UI

const characterFilterState = new Set(); // Stores checked characters
let allCharacters = [];

function populateCharacterFilter(dataList) {
    // Extract unique characters from the provided dataList (table data)
    const charSet = new Set();

    // 1. Extract from Current Table
    // Skip header row (index 0)
    for (let i = 1; i < dataList.length; i++) {
        const charName = dataList[i][1];
        if (charName) charSet.add(charName.trim());
    }

    // 2. Extract from Full Database (if available)
    if (typeof weaponDatabase !== 'undefined' && weaponDatabase.length > 0) {
        weaponDatabase.forEach(item => {
            // item is an array of {name, value} objects
            const charObj = item.find(p => p.name === "charName");
            if (charObj && charObj.value) {
                charSet.add(charObj.value.trim());
            }
        });
    }

    const sortedChars = Array.from(charSet).sort();

    // Only rebuild if we found new characters or it's empty
    if (allCharacters.length === sortedChars.length && allCharacters.every((v, i) => v === sortedChars[i])) {
        return; // No change
    }

    allCharacters = sortedChars;
    const container = document.getElementById('characterFilterButtons');
    container.innerHTML = '';

    // If state is empty (first run), select all
    const isFirstRun = characterFilterState.size === 0;

    allCharacters.forEach(char => {
        if (isFirstRun) characterFilterState.add(char);

        const btn = document.createElement('button');
        btn.type = 'button';
        // Base classes
        btn.className = `px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none ${characterFilterState.has(char)
            ? 'bg-primary/10 border-primary text-primary-dark dark:text-primary ring-1 ring-primary/20'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`;
        btn.textContent = char;
        btn.dataset.char = char;

        btn.onclick = () => toggleCharacterFilter(char, btn);
        container.appendChild(btn);
    });

    // Show container
    document.getElementById('characterFilterContainer').classList.remove('hidden');
}

function toggleCharacterFilter(char, btn) {
    if (characterFilterState.has(char)) {
        characterFilterState.delete(char);
        // Update UI to unchecked
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600';
    } else {
        characterFilterState.add(char);
        // Update UI to checked
        btn.className = 'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none bg-primary/10 border-primary text-primary-dark dark:text-primary ring-1 ring-primary/20';
    }
    applyCharacterFilter();
}

function selectAllCharacters() {
    allCharacters.forEach(char => characterFilterState.add(char));
    updateFilterButtonsUI();
    applyCharacterFilter();
}

function deselectAllCharacters() {
    characterFilterState.clear();
    updateFilterButtonsUI();
    applyCharacterFilter();
}

function updateFilterButtonsUI() {
    const btns = document.getElementById('characterFilterButtons').children;
    for (let btn of btns) {
        const char = btn.dataset.char;
        if (characterFilterState.has(char)) {
            btn.className = 'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none bg-primary/10 border-primary text-primary-dark dark:text-primary ring-1 ring-primary/20';
        } else {
            btn.className = 'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600';
        }
    }
}

function applyCharacterFilter() {
    // Find all tables in output
    const tables = document.querySelectorAll('#Output table');
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowChar = row.dataset.character;
            if (!rowChar) return; // Header or weird row

            if (characterFilterState.has(rowChar)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}
