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

    // Count weapons per character
    const characterCounts = {};
    sortedChars.forEach(char => {
        characterCounts[char] = 0;
    });

    // Count from weaponDatabase if available (most accurate)
    if (typeof weaponDatabase !== 'undefined' && weaponDatabase.length > 0) {
        weaponDatabase.forEach(item => {
            const charObj = item.find(p => p.name === "charName");
            if (charObj && charObj.value) {
                const charName = charObj.value.trim();
                if (characterCounts.hasOwnProperty(charName)) {
                    characterCounts[charName]++;
                }
            }
        });
    } else {
        // Fallback: count from current table data
        for (let i = 1; i < dataList.length; i++) {
            const charName = dataList[i][1];
            if (charName && characterCounts.hasOwnProperty(charName.trim())) {
                characterCounts[charName.trim()]++;
            }
        }
    }

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

        // Add character name and count badge
        const count = characterCounts[char] || 0;
        btn.innerHTML = `
            <span>${char}</span>
            <span class="ml-1.5 opacity-60 text-[10px]">(${count})</span>
        `;
        btn.dataset.char = char;

        btn.onclick = () => toggleCharacterFilter(char, btn);
        container.appendChild(btn);
    });

    // Hide empty state and show buttons + actions
    document.getElementById('characterFilterEmpty').classList.add('hidden');
    document.getElementById('characterFilterButtons').classList.remove('hidden');
    document.getElementById('characterFilterActions').classList.remove('hidden');

    // Initialize filter indicator
    updateFilterIndicator();
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
    updateFilterIndicator();
}

function selectAllCharacters() {
    allCharacters.forEach(char => characterFilterState.add(char));
    updateFilterButtonsUI();
    applyCharacterFilter();
    updateFilterIndicator();
}

function deselectAllCharacters() {
    characterFilterState.clear();
    updateFilterButtonsUI();
    applyCharacterFilter();
    updateFilterIndicator();
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

function updateFilterIndicator() {
    const indicator = document.getElementById('characterFilterIndicator');
    const excludedList = document.getElementById('characterExcludedList');

    // Calculate excluded characters (those NOT in characterFilterState)
    const excluded = allCharacters.filter(char => !characterFilterState.has(char));

    if (excluded.length === 0 || excluded.length === allCharacters.length) {
        // Hide indicator if all or none are excluded
        indicator.classList.add('hidden');
    } else {
        // Show indicator with excluded characters as chips
        indicator.classList.remove('hidden');
        excludedList.innerHTML = excluded.map(char =>
            `<span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                ${char}
            </span>`
        ).join('');
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
