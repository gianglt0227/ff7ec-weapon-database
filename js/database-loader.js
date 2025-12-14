/**
 * Database Loader - CSV Parsing and Weapon Data Extraction
 *
 * Provides testable, reusable functions for loading and parsing weapon data from CSV.
 * Extracted from scripts.js readDatabase() function for better maintainability.
 */

/**
 * Column indices for weapon CSV structure
 * Maps property names to their column indices in the CSV
 */
const CSV_COLUMN_MAP = {
    name: 0,
    charName: 1,
    sigil: 2,
    atb: 3,
    type: 4,
    element: 5,
    range: 6,
    effect1Target: 7,
    effect1: 8,
    effect1Pot: 9,
    effect1MaxPot: 10,
    effect2Target: 11,
    effect2: 12,
    effect2Pot: 13,
    effect2MaxPot: 14,
    effect3Target: 15,
    effect3: 16,
    effect3Pot: 17,
    effect3MaxPot: 18,
    support1: 19,
    support2: 20,
    support3: 21,
    rAbility1: 22,
    rAbility2: 23,
    potOb10: 24,
    maxPotOb10: 25,
    effect1Dur: 26,
    effect2Dur: 27,
    effect3Dur: 28,
    condition1: 29,
    condition2: 30,
    condition3: 31,
    // Skip 15 columns (32-46 reserved/unused)
    effect1Range: 46,
    uses: 47,
    // id: 48 (skipped)
    gachaType: 49,
    effect2Range: 50
};

/**
 * Parse a single weapon row from CSV into standardized {name, value} format
 * @param {Array<string>} row - CSV row as array of strings
 * @param {number} rowIndex - Row number (for error reporting)
 * @returns {Array<Object>|null} Array of {name, value} objects or null if invalid
 */
function parseWeaponRow(row, rowIndex) {
    // Validation
    if (!Array.isArray(row) || row.length === 0) {
        console.error(`parseWeaponRow: Invalid row at index ${rowIndex}`);
        return null;
    }

    // Check minimum required columns
    if (row[0].length < 52) {
        console.warn(`parseWeaponRow: Row ${rowIndex} has insufficient columns (${row[0].length}), skipping`);
        return null;
    }

    try {
        const weapData = [];
        const r = row[0]; // CSVToArray wraps result in array

        // Basic properties (0-6)
        weapData.push({ name: 'name', value: r[CSV_COLUMN_MAP.name] });
        weapData.push({ name: 'charName', value: r[CSV_COLUMN_MAP.charName] });
        weapData.push({ name: 'sigil', value: r[CSV_COLUMN_MAP.sigil] });
        weapData.push({ name: 'atb', value: r[CSV_COLUMN_MAP.atb] });
        weapData.push({ name: 'type', value: r[CSV_COLUMN_MAP.type] });
        weapData.push({ name: 'element', value: r[CSV_COLUMN_MAP.element] });
        weapData.push({ name: 'range', value: r[CSV_COLUMN_MAP.range] });

        // Effect 1 (7-10)
        weapData.push({ name: 'effect1Target', value: r[CSV_COLUMN_MAP.effect1Target] });
        weapData.push({ name: 'effect1', value: r[CSV_COLUMN_MAP.effect1] });
        weapData.push({ name: 'effect1Pot', value: r[CSV_COLUMN_MAP.effect1Pot] });
        weapData.push({ name: 'effect1MaxPot', value: r[CSV_COLUMN_MAP.effect1MaxPot] });

        // Effect 2 (11-14)
        weapData.push({ name: 'effect2Target', value: r[CSV_COLUMN_MAP.effect2Target] });
        weapData.push({ name: 'effect2', value: r[CSV_COLUMN_MAP.effect2] });
        weapData.push({ name: 'effect2Pot', value: r[CSV_COLUMN_MAP.effect2Pot] });
        weapData.push({ name: 'effect2MaxPot', value: r[CSV_COLUMN_MAP.effect2MaxPot] });

        // Effect 3 (15-18)
        weapData.push({ name: 'effect3Target', value: r[CSV_COLUMN_MAP.effect3Target] });
        weapData.push({ name: 'effect3', value: r[CSV_COLUMN_MAP.effect3] });
        weapData.push({ name: 'effect3Pot', value: r[CSV_COLUMN_MAP.effect3Pot] });
        weapData.push({ name: 'effect3MaxPot', value: r[CSV_COLUMN_MAP.effect3MaxPot] });

        // Support slots (19-21)
        weapData.push({ name: 'support1', value: r[CSV_COLUMN_MAP.support1] });
        weapData.push({ name: 'support2', value: r[CSV_COLUMN_MAP.support2] });
        weapData.push({ name: 'support3', value: r[CSV_COLUMN_MAP.support3] });

        // R-Abilities (22-23)
        weapData.push({ name: 'rAbility1', value: r[CSV_COLUMN_MAP.rAbility1] });
        weapData.push({ name: 'rAbility2', value: r[CSV_COLUMN_MAP.rAbility2] });

        // Potencies (24-25)
        weapData.push({ name: 'potOb10', value: r[CSV_COLUMN_MAP.potOb10] });
        weapData.push({ name: 'maxPotOb10', value: r[CSV_COLUMN_MAP.maxPotOb10] });

        // Durations (26-28)
        weapData.push({ name: 'effect1Dur', value: r[CSV_COLUMN_MAP.effect1Dur] });
        weapData.push({ name: 'effect2Dur', value: r[CSV_COLUMN_MAP.effect2Dur] });
        weapData.push({ name: 'effect3Dur', value: r[CSV_COLUMN_MAP.effect3Dur] });

        // Conditions (29-31)
        weapData.push({ name: 'condition1', value: r[CSV_COLUMN_MAP.condition1] });
        weapData.push({ name: 'condition2', value: r[CSV_COLUMN_MAP.condition2] });
        weapData.push({ name: 'condition3', value: r[CSV_COLUMN_MAP.condition3] });

        // Effect ranges (47, 51)
        weapData.push({ name: 'effect1Range', value: r[CSV_COLUMN_MAP.effect1Range] });

        // Uses (48) - Special handling for zero ATB
        const usesValue = r[CSV_COLUMN_MAP.uses];
        if (usesValue == 0 || usesValue == '0') {
            weapData.push({ name: 'uses', value: ZERO_ATB_DISPLAY });
        } else {
            weapData.push({ name: 'uses', value: usesValue });
        }

        // Gacha type and effect2 range (50-51)
        weapData.push({ name: 'gachaType', value: r[CSV_COLUMN_MAP.gachaType] });
        weapData.push({ name: 'effect2Range', value: r[CSV_COLUMN_MAP.effect2Range] });

        return weapData;

    } catch (error) {
        console.error(`parseWeaponRow: Error parsing row ${rowIndex}:`, error);
        return null;
    }
}

/**
 * Parse CSV content into array of weapon objects
 * @param {string} csvContent - Raw CSV file content
 * @param {number} skipLines - Number of header lines to skip
 * @returns {Array<Array<Object>>} Array of weapons, each weapon is array of {name, value} objects
 */
function parseWeaponCSV(csvContent, skipLines = 1) {
    // Validation
    if (!csvContent || typeof csvContent !== 'string') {
        console.error('parseWeaponCSV: Invalid CSV content');
        return [];
    }

    const weapons = [];
    const lines = csvContent.split('\n');

    // Validate CSV structure
    if (lines.length <= skipLines) {
        console.error(`parseWeaponCSV: CSV has only ${lines.length} lines, expected more than ${skipLines}`);
        return [];
    }

    // Parse each line (skip header and empty last line)
    for (let lineIndex = skipLines; lineIndex < lines.length - 1; lineIndex++) {
        const line = lines[lineIndex];

        // Skip empty lines
        if (!line || line.trim() === '') {
            continue;
        }

        try {
            const row = CSVToArray(line, ',');
            const weaponData = parseWeaponRow(row, lineIndex);

            if (weaponData) {
                weapons.push(weaponData);
            }
        } catch (error) {
            console.error(`parseWeaponCSV: Error parsing line ${lineIndex}:`, error);
            // Continue parsing other lines
        }
    }

    console.log(`parseWeaponCSV: Successfully parsed ${weapons.length} weapons`);
    return weapons;
}

/**
 * Construct CSV file URL with cache busting
 * @param {string} fileName - CSV file name
 * @returns {string} Full URL with cache buster parameter
 */
function getCSVUrl(fileName) {
    const location = window.location.href;
    const directoryPath = location.substring(0, location.lastIndexOf("/") + 1);
    const cacheBuster = new Date().getTime();
    return `${directoryPath}${fileName}?t=${cacheBuster}`;
}
