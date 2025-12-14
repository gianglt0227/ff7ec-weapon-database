// Character Filter Logic
// Manages the global character filter state and UI

const characterFilterState = new Set(); // Stores checked characters
let allCharacters = [];
let updateCountsTimeout = null; // Debounce timer for count updates

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

    // Check if we need to rebuild buttons (new characters found)
    const needsRebuild = allCharacters.length !== sortedChars.length ||
                        !allCharacters.every((v, i) => v === sortedChars[i]);

    if (needsRebuild) {
        allCharacters = sortedChars;
        rebuildCharacterButtons();
    }

    // Always update counts after a short delay (debounced to handle multiple table renders)
    clearTimeout(updateCountsTimeout);
    updateCountsTimeout = setTimeout(() => {
        updateCharacterCounts();
    }, 100);
}

function rebuildCharacterButtons() {
    const container = document.getElementById('characterFilterButtons');
    container.innerHTML = '';

    // If state is empty (first run), select all
    const isFirstRun = characterFilterState.size === 0;

    allCharacters.forEach(char => {
        if (isFirstRun) characterFilterState.add(char);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border select-none ${characterFilterState.has(char)
            ? 'bg-primary/10 border-primary text-primary-dark dark:text-primary ring-1 ring-primary/20'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
            }`;

        btn.innerHTML = `
            <span>${char}</span>
            <span class="ml-1.5 opacity-60 text-[10px]">(0)</span>
        `;
        btn.dataset.char = char;

        btn.onclick = () => toggleCharacterFilter(char, btn);
        container.appendChild(btn);
    });

    // Hide empty state and show buttons + actions
    document.getElementById('characterFilterEmpty').classList.add('hidden');
    document.getElementById('characterFilterButtons').classList.remove('hidden');
    document.getElementById('characterFilterActions').classList.remove('hidden');
}

function updateCharacterCounts() {
    // Track unique weapons per character using Sets
    const characterWeapons = {};
    allCharacters.forEach(char => {
        characterWeapons[char] = new Set();
    });

    // Collect unique weapon names per character from all visible tables
    const allTables = document.querySelectorAll('#Output table tbody tr');
    allTables.forEach(row => {
        const weaponNameCell = row.cells[0]; // Weapon name is in column index 0
        const charCell = row.cells[1]; // Character is in column index 1

        if (weaponNameCell && charCell) {
            const weaponName = weaponNameCell.textContent.trim();
            const charName = charCell.textContent.trim();

            if (weaponName && charName && characterWeapons.hasOwnProperty(charName)) {
                characterWeapons[charName].add(weaponName);
            }
        }
    });

    // Convert Sets to counts
    const characterCounts = {};
    allCharacters.forEach(char => {
        characterCounts[char] = characterWeapons[char].size;
    });

    // Update the count in each button
    const container = document.getElementById('characterFilterButtons');
    const buttons = container.children;
    for (let btn of buttons) {
        const char = btn.dataset.char;
        const count = characterCounts[char] || 0;
        // Update just the count span without rebuilding the entire button
        const countSpan = btn.querySelector('span:last-child');
        if (countSpan) {
            countSpan.textContent = `(${count})`;
        }
    }
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
