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
    // Track unique weapons per character using Sets (faster than arrays for deduplication)
    const characterWeapons = {};
    for (const char of allCharacters) {
        characterWeapons[char] = new Set();
    }

    // Single-pass collection of unique weapons per character
    // Optimized: querySelector once, cache cell indices
    const allRows = document.querySelectorAll('#Output table tbody tr');
    for (const row of allRows) {
        const cells = row.cells;
        if (cells.length < 2) continue; // Skip malformed rows

        const weaponName = cells[0].textContent.trim();
        const charName = cells[1].textContent.trim();

        // Fast path: skip empty or invalid entries
        if (!weaponName || !charName) continue;

        // Add weapon to character's set (O(1) operation)
        const charSet = characterWeapons[charName];
        if (charSet) {
            charSet.add(weaponName);
        }
    }

    // Batch DOM updates using DocumentFragment to minimize reflows
    const container = document.getElementById('characterFilterButtons');
    const buttons = Array.from(container.children);

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
        for (const btn of buttons) {
            const char = btn.dataset.char;
            const count = characterWeapons[char]?.size || 0;

            // Only update if count changed (avoid unnecessary DOM writes)
            const countSpan = btn.querySelector('span:last-child');
            if (countSpan) {
                const newText = `(${count})`;
                if (countSpan.textContent !== newText) {
                    countSpan.textContent = newText;
                }
            }
        }
    });
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
