// python -m http.server

/* Trash code - Need to clean up and add comments and stuff*/
/* When the user clicks on the button, toggle between hiding and showing the dropdown content */

const FILE_NAME = 'weaponData.csv'
const WEAP_NUM_SKIP_LINE = 1;
const ELEM_TABL_COL = 9;
const STATUS_TABL_COL = 9;
const MATERIA_TABL_COL = 8;
const UNIQUE_TABL_COL = 12;
const MAX_POT_INDEX = 6;   // Index into the maxPot for sorting

// Game mechanics constants
const HEAL_MIN_POTENCY_THRESHOLD = 25;  // Weapons below 25% healing potency are filtered
const REGEN_TICK_INTERVAL_SEC = 3;      // Regen ticks every 3 seconds
const REGEN_TICK_PERCENT = 15;          // Each regen tick heals 15%
const ZERO_ATB_DISPLAY = "No Limit";    // Display text for 0 ATB cost weapons

// Element name mappings (Lightning → Thunder in game data)
const ELEMENT_NAME_OVERRIDES = {
  'Lightning': { resist: 'Thunder', enchant: 'Thunder', materia: 'Light' }
};

let weaponDatabase = [];
let filterCounts = {}; // Store pre-calculated counts

function ecSearch() {
    document.getElementById("ecDropdown").classList.toggle("show");
    const divToPrint = document.getElementById('Output');
    divToPrint.innerHTML = ''
}

/* Create a table to display the result */
function tableCreate(user_row, user_col, list, header) {
    //body reference
    const body = document.getElementById('Output');

    // header
    const h1 = document.createElement("h1");
    const textNode = document.createTextNode(header);
    h1.className = "weaponHeader";
    h1.appendChild(textNode);
    body.appendChild(h1);

    console.log("Table Data:", list);

    // create <table> and a <tbody>
    const tbl = document.createElement("table");
    let tblClassName;

    // Different format for each table 
    if (user_col == ELEM_TABL_COL) {
        tblClassName = "elemTable";
    }
    else if (user_col == MATERIA_TABL_COL) {
        tblClassName = "materiaTable";
    }
    else if (user_col == STATUS_TABL_COL) {
        tblClassName = "statusTable";
    }
    else if (user_col == UNIQUE_TABL_COL) {
        tblClassName = "uniqueTable";
    }
    else {
        tblClassName = "effectTable";
    }
    tbl.className = tblClassName + " cell-border display compact hover order-column stripe";

    let tblId = tblClassName + Math.random().toString(36).substr(2, 9); // Generate a unique ID for each table
    tbl.id = tblId;
    const tblBody = document.createElement("tbody");
    console.log("Creating table: " + tblClassName);

    const headerRow = document.createElement("tr");
    // create <tr> and <td>
    for (let j = 0; j < user_row; j++) {
        const row = document.createElement("tr");

        for (let i = 0; i < user_col; i++) {
            let cell;
            if (j == 0) {
                cell = document.createElement("th");
                headerRow.appendChild(cell);
            }
            else {
                cell = document.createElement("td");
                row.appendChild(cell);
            }
            const cellText = document.createTextNode(list[j][i] || "");
            cell.appendChild(cellText);

        }
        if (j > 0) {
            tblBody.appendChild(row);
        }
    }

    // append the <tbody> inside the <table>
    const tblHead = document.createElement("thead");
    tblHead.appendChild(headerRow);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);

    // put <table> in the <body>
    body.appendChild(tbl);

    new DataTable('#' + tblId, {
        paging: false,
        scrollX: true
    });
    console.log("Created table: " + tblClassName);
}

/**
 * REMOVED: sortTable() function (72 lines)
 *
 * This function implemented a bubble sort algorithm for manually sorting table rows
 * by clicking column headers. It handled both numeric and text columns.
 *
 * Removal reason: DataTables.js library (loaded in index.html) provides superior
 * sorting functionality with better performance and UX. No calls to sortTable()
 * exist in the codebase.
 *
 * Removed on: 2024 refactoring
 * Commit: "refactor: remove unused sortTable() function (DataTables handles sorting)"
 */

function readDatabase(callback) {
    // If already loaded, execute callback immediately
    if (weaponDatabase[0] != null) {
        if (callback) callback();
        return;
    }

    // Show loading spinner
    showLoadingSpinner('Loading weapon database...');

    const location = window.location.href;
    const directoryPath = location.substring(0, location.lastIndexOf("/") + 1);
    // Add cache busting to ensure we get the latest CSV
    loadFile(directoryPath + FILE_NAME + "?t=" + new Date().getTime(), function(result, error) {
        if (error) {
            showLoadingError(error);
            console.error('Database load error:', error);
            return;
        }

        if (result != null) {
            // By lines
            const lines = result.split('\n');

            for (let line = WEAP_NUM_SKIP_LINE; line < lines.length - 1; line++) {

                const row = CSVToArray(lines[line], ',');
                const i = 0;
                let weapData = [];
                weapData.push({ name: 'name', value: row[i][0] });
                weapData.push({ name: 'charName', value: row[i][1] });
                weapData.push({ name: 'sigil', value: row[i][2] });
                weapData.push({ name: 'atb', value: row[i][3] });
                weapData.push({ name: 'type', value: row[i][4] });    // dmg type
                weapData.push({ name: 'element', value: row[i][5] });
                weapData.push({ name: 'range', value: row[i][6] });
                weapData.push({ name: 'effect1Target', value: row[i][7] });
                weapData.push({ name: 'effect1', value: row[i][8] });
                weapData.push({ name: 'effect1Pot', value: row[i][9] });
                weapData.push({ name: 'effect1MaxPot', value: row[i][10] });
                weapData.push({ name: 'effect2Target', value: row[i][11] });
                weapData.push({ name: 'effect2', value: row[i][12] });
                weapData.push({ name: 'effect2Pot', value: row[i][13] });
                weapData.push({ name: 'effect2MaxPot', value: row[i][14] });
                let m = 15;
                weapData.push({ name: 'effect3Target', value: row[i][m] }); m++;
                weapData.push({ name: 'effect3', value: row[i][m] }); m++;
                weapData.push({ name: 'effect3Pot', value: row[i][m] }); m++;
                weapData.push({ name: 'effect3MaxPot', value: row[i][m] }); m++;
                weapData.push({ name: 'support1', value: row[i][m] }); m++;
                weapData.push({ name: 'support2', value: row[i][m] }); m++;
                weapData.push({ name: 'support3', value: row[i][m] }); m++;
                weapData.push({ name: 'rAbility1', value: row[i][m] }); m++;
                weapData.push({ name: 'rAbility2', value: row[i][m] }); m++;
                weapData.push({ name: 'potOb10', value: row[i][m] }); m++;
                weapData.push({ name: 'maxPotOb10', value: row[i][m] }); m++;
                weapData.push({ name: 'effect1Dur', value: row[i][m] }); m++;
                weapData.push({ name: 'effect2Dur', value: row[i][m] }); m++;
                weapData.push({ name: 'effect3Dur', value: row[i][m] }); m++;
                weapData.push({ name: 'condition1', value: row[i][m] }); m++;
                weapData.push({ name: 'condition2', value: row[i][m] }); m++;
                weapData.push({ name: 'condition3', value: row[i][m] }); m += 15;
                weapData.push({ name: 'effect1Range', value: row[i][m] }); m++;

                if (row[i][m] == 0 || row[i][m] == '0') {
                    weapData.push({ name: 'uses', value: ZERO_ATB_DISPLAY });
                }
                else {
                    weapData.push({ name: 'uses', value: row[i][m] });
                }
                m++;
                m++; // id

                weapData.push({ name: 'gachaType', value: row[i][m] }); m++;
                weapData.push({ name: 'effect2Range', value: row[i][m] }); m++;


                weaponDatabase.push(weapData);
                // console.log(weapData);
            }
        }

        // Hide loading spinner and execute callback
        hideLoadingSpinner();
        calculateFilterCounts();
        if (callback) callback();
    });
}

/**
 * Calculate weapon counts for all filters
 * Called once after database loads
 */
function calculateFilterCounts() {
    filterCounts = {
        // Elements
        fire: countWeaponsWithProperty('element', 'Fire'),
        ice: countWeaponsWithProperty('element', 'Ice'),
        lightning: countWeaponsWithProperty('element', 'Lightning'),
        water: countWeaponsWithProperty('element', 'Water'),
        wind: countWeaponsWithProperty('element', 'Wind'),
        earth: countWeaponsWithProperty('element', 'Earth'),
        none: countWeaponsWithProperty('element', 'None'),
        heal: countWeaponsWithProperty('element', 'Heal'),

        // Stat debuffs/buffs
        matkDown: countWeaponsWithEffect('[Debuff] MATK'),
        patkDown: countWeaponsWithEffect('[Debuff] PATK'),
        pdefDown: countWeaponsWithEffect('[Debuff] PDEF'),
        mdefDown: countWeaponsWithEffect('[Debuff] MDEF'),
        patkUp: countWeaponsWithEffect('[Buff] PATK'),
        matkUp: countWeaponsWithEffect('[Buff] MATK'),
        pdefUp: countWeaponsWithEffect('[Buff] PDEF'),
        mdefUp: countWeaponsWithEffect('[Buff] MDEF'),

        // Special
        limited: countWeaponsWithProperty('gachaType', 'L'),
        circle: countWeaponsWithMateria('Circle'),
        triangle: countWeaponsWithMateria('Triangle'),
        xSigil: countWeaponsWithMateria('X Sigil'),
        diamond: countWeaponsWithProperty('sigil', 'Diamond'),
        exploitWeakness: countWeaponsWithEffect('[Buff] Weakness'),
        provoke: countWeaponsWithEffect('[Buff] Provoke'),
        unique: countUniqueEffects(),

        // Total
        all: weaponDatabase.length
    };

    updateFilterBadges();
}

/**
 * Count weapons with specific property value
 */
function countWeaponsWithProperty(propertyName, propertyValue) {
    let count = 0;
    for (let i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], propertyName, propertyValue)) {
            count++;
        }
    }
    return count;
}

/**
 * Count weapons with effect in effect1, effect2, or effect3
 */
function countWeaponsWithEffect(effectName) {
    let count = 0;
    for (let i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'effect1', effectName) ||
            findWeaponWithProperty(weaponDatabase[i], 'effect2', effectName) ||
            findWeaponWithProperty(weaponDatabase[i], 'effect3', effectName)) {
            count++;
        }
    }
    return count;
}

/**
 * Count weapons with materia in support1, support2, or support3
 */
function countWeaponsWithMateria(materiaType) {
    let count = 0;
    for (let i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'support1', materiaType) ||
            findWeaponWithProperty(weaponDatabase[i], 'support2', materiaType) ||
            findWeaponWithProperty(weaponDatabase[i], 'support3', materiaType)) {
            count++;
        }
    }
    return count;
}

/**
 * Count weapons with unique effects (Status Apply/Cleanse, Dispel, Haste, Command Gauge)
 */
function countUniqueEffects() {
    const uniqueWeapons = new Set();

    for (let i = 0; i < weaponDatabase.length; i++) {
        const weapon = weaponDatabase[i];
        const weaponNameObj = weapon.find(p => p.name === 'name');
        const weaponName = weaponNameObj ? weaponNameObj.value : null;

        // Check for Status Apply, Status Cleanse, or Dispel
        if (findWeaponWithProperty(weapon, 'effect1', '[Status Apply]') ||
            findWeaponWithProperty(weapon, 'effect2', '[Status Apply]') ||
            findWeaponWithProperty(weapon, 'effect3', '[Status Apply]') ||
            findWeaponWithProperty(weapon, 'effect1', '[Status Cleanse]') ||
            findWeaponWithProperty(weapon, 'effect2', '[Status Cleanse]') ||
            findWeaponWithProperty(weapon, 'effect3', '[Status Cleanse]')) {
            if (weaponName) uniqueWeapons.add(weaponName);
            continue;
        }

        // Check for Dispel (partial match)
        const effect1 = weapon.find(p => p.name === 'effect1')?.value || '';
        const effect2 = weapon.find(p => p.name === 'effect2')?.value || '';
        const effect3 = weapon.find(p => p.name === 'effect3')?.value || '';

        if (effect1.includes('[Dispel') || effect2.includes('[Dispel') || effect3.includes('[Dispel')) {
            if (weaponName) uniqueWeapons.add(weaponName);
            continue;
        }

        // Check for Haste or Command Gauge
        if (findWeaponWithProperty(weapon, 'effect1', 'Haste') ||
            findWeaponWithProperty(weapon, 'effect2', 'Haste') ||
            findWeaponWithProperty(weapon, 'effect3', 'Haste') ||
            findWeaponWithProperty(weapon, 'effect1', 'Increases Command Gauge') ||
            findWeaponWithProperty(weapon, 'effect2', 'Increases Command Gauge') ||
            findWeaponWithProperty(weapon, 'effect3', 'Increases Command Gauge')) {
            if (weaponName) uniqueWeapons.add(weaponName);
        }
    }

    return uniqueWeapons.size;
}

/**
 * Update count badges in dropdown menu
 */
function updateFilterBadges() {
    const badgeMap = {
        'filter-fire': filterCounts.fire,
        'filter-ice': filterCounts.ice,
        'filter-lightning': filterCounts.lightning,
        'filter-water': filterCounts.water,
        'filter-wind': filterCounts.wind,
        'filter-earth': filterCounts.earth,
        'filter-none': filterCounts.none,
        'filter-heal': filterCounts.heal,
        'filter-matk-down': filterCounts.matkDown,
        'filter-patk-down': filterCounts.patkDown,
        'filter-pdef-down': filterCounts.pdefDown,
        'filter-mdef-down': filterCounts.mdefDown,
        'filter-patk-up': filterCounts.patkUp,
        'filter-matk-up': filterCounts.matkUp,
        'filter-pdef-up': filterCounts.pdefUp,
        'filter-mdef-up': filterCounts.mdefUp,
        'filter-limited': filterCounts.limited,
        'filter-circle': filterCounts.circle,
        'filter-triangle': filterCounts.triangle,
        'filter-x-sigil': filterCounts.xSigil,
        'filter-diamond': filterCounts.diamond,
        'filter-exploit': filterCounts.exploitWeakness,
        'filter-provoke': filterCounts.provoke,
        'filter-unique': filterCounts.unique,
        'filter-all': filterCounts.all
    };

    Object.keys(badgeMap).forEach(id => {
        const badge = document.getElementById(id);
        if (badge) {
            badge.textContent = badgeMap[id];
        }
    });
}

/**
 * Find an element in an array by property name and value
 * @param {Array} arr - Array to search
 * @param {string} propName - Property name to match
 * @param {*} propValue - Property value to match
 * @returns {Object|undefined} Found element or undefined
 */
function findElement(arr, propName, propValue) {
    // Input validation
    if (!Array.isArray(arr)) {
        console.error('findElement: arr must be an array', arr);
        return undefined;
    }
    if (!propName) {
        console.error('findElement: propName is required');
        return undefined;
    }

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i][propName] == propValue) {
            return arr[i];
        }
    }
    return undefined;
}

/**
 * Get value from database item by property name
 * @param {Array} item - Database item (array of {name, value} objects)
 * @param {string} name - Property name to retrieve
 * @returns {*} Property value or empty string if not found
 */
function getValueFromDatabaseItem(item, name) {
    // Input validation
    if (!item) {
        console.error('getValueFromDatabaseItem: item is required');
        return '';
    }
    if (!name) {
        console.error('getValueFromDatabaseItem: name is required');
        return '';
    }

    const element = findElement(item, "name", name);

    if (!element) {
        console.warn(`getValueFromDatabaseItem: Property "${name}" not found in item`);
        return '';
    }

    return element["value"] !== undefined ? element["value"] : '';
}

/**
 * Check if weapon has property with given value (substring match)
 * @param {Array} arr - Weapon data array
 * @param {string} propName - Property name to check
 * @param {string} propValue - Value to search for (substring)
 * @returns {boolean} True if property contains value
 */
function findWeaponWithProperty(arr, propName, propValue) {
    // Input validation
    if (!Array.isArray(arr)) {
        console.error('findWeaponWithProperty: arr must be an array');
        return false;
    }
    // Allow empty string for propValue (indexOf('') returns 0, which is valid)
    if (!propName || propValue === null || propValue === undefined) {
        return false;
    }

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i].name == propName && arr[i].value) {
            try {
                if (arr[i].value.indexOf(propValue) >= 0) {
                    return true;
                }
            } catch (e) {
                // Skip non-string values
                continue;
            }
        }
    }

    return false;
}

function elementalCompare(a, b) {
    const aItem = parseFloat(a[MAX_POT_INDEX]);
    const bItem = parseFloat(b[MAX_POT_INDEX]);
    if (aItem < bItem) {
        return 1;
    }
    if (aItem > bItem) {
        return -1;
    }
    return 0;
}

/**
 * Generic filter wrapper - handles common pattern for all filters
 * @param {Function} printFunction - The print function to call
 * @param {...any} args - Arguments to pass to print function
 */
function executeFilter(printFunction, ...args) {
    closeDropdown();
    readDatabase(function() {
        document.getElementById('Output').innerHTML = '';
        printFunction(...args);
    });
}

/**
 * Filter weapons by element
 * @param {string} element - Element name (Fire, Ice, Lightning, etc.)
 */
function filterByElement(element) {
    printElemWeapon(element);
}

/**
 * FILTER FUNCTIONS - Moved to filter-registry.js
 *
 * All 27+ filter functions (filterFire, filterIce, filterHeal, etc.) have been
 * consolidated into a configuration-driven system in js/filter-registry.js.
 *
 * Benefits:
 * - Reduces code duplication (~150 lines eliminated)
 * - Easier to add new filters (just add config entry)
 * - Centralized filter logic and parameters
 * - Auto-generates global functions for onclick handlers
 *
 * See: js/filter-registry.js for filter configurations
 */

/**
 * Filter weapons by stat effect (debuff or buff)
 * Helper function used by filter-registry.js
 * @param {string} effectName - Effect name like '[Debuff] MATK'
 * @param {string} header - Display header for the table
 */
function filterStatEffect(effectName, header) {
    executeFilter(printWeaponEffect, effectName, header);
}

/**
 * Filter weapons by materia slot sigil
 * Helper function used by filter-registry.js
 * @param {string} materiaType - Materia type (Circle, Triangle, X Sigil)
 * @param {string} header - Display header for the table
 */
function filterMateriaSlot(materiaType, header) {
    executeFilter(printWeaponMateria, materiaType, header);
}

function filterAll() {
    // Display everything...
    const header = "List of All Weapons:";
    printAllWeapon("", header);


}

function printElemWeapon(elem) {
    // Close dropdown after selection
    closeDropdown();

    readDatabase(function() {
        // Clear output div to remove loading spinner
        document.getElementById('Output').innerHTML = '';

        let elemResist, elemEnchant, elemMateria;

        // Check if element has name overrides (e.g., Lightning → Thunder in game data)
        const elementOverride = ELEMENT_NAME_OVERRIDES[elem];
        if (elementOverride) {
            elemResist = "[Resist] " + elementOverride.resist;
            elemEnchant = "[Enchant] " + elementOverride.enchant;
            elemMateria = elementOverride.materia;
        }
        else {
            elemResist = "[Resist] " + elem;
            elemEnchant = "[Enchant] " + elem;
            elemMateria = elem;
        }

        let header = "Weapon with C-Abilities - " + elem;
        printWeaponElem(elem, header);

        if (elem != "None") {
            header = "Weapon with [Debuff] " + elem + " Resist Down:";
            printWeaponEffect(elemResist, header);

            header = "Weapon with [Buff] " + elem + " Damage Up:";
            printWeaponEffect(elemEnchant, header);

            header = "Weapon with " + elem + " Materia Slot:";
            printWeaponMateria(elemMateria, header);
        }
    });
}

function printLimitedWeapon(elem, header) {
    // Close dropdown after selection
    closeDropdown();

    readDatabase(function() {
        // Clear output div to remove loading spinner
        document.getElementById('Output').innerHTML = '';

        let elemental;
    elemental = [["Weapon Name", "Char", "AOE", "Type", "ATB", "Element", "Pot%", "Max%", "% per ATB", "Condition"]];

    for (let i = 0; i < weaponDatabase.length; i++) {
        const found = findWeaponWithProperty(weaponDatabase[i], 'gachaType', "L");
        if (found) {
            // Make a new row and push them into the list
            let row = [];

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "range"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));

            const atb = getValueFromDatabaseItem(weaponDatabase[i], "atb");
            row.push(atb);

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "element"));

            let pot, maxPot;

            pot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10"));
            row.push(pot);

            maxPot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "maxPotOb10"));
            row.push(maxPot);

            // % per ATB
            if (atb != 0) {
                row.push((maxPot / atb).toFixed(0));
            }
            else {
                row.push(maxPot);
            }

            if (elem != "Heal") {
                // Check if weapon should show condition column (using metadata registry)
                const weaponName = getValueFromDatabaseItem(weaponDatabase[i], "name");
                if (shouldShowCondition(weaponName, pot, maxPot)) {
                    row.push(getWeaponCondition(weaponDatabase[i]));
                }
                else {
                    row.push("");
                }
            }

            elemental.push(row);
        }

        elemental.sort(elementalCompare);
    }

        tableCreate(elemental.length, elemental[0].length, elemental, header);
    });
}

function printAllWeapon(elem, header) {
    // Close dropdown after selection
    closeDropdown();

    readDatabase(function() {
        // Clear output div to remove loading spinner
        document.getElementById('Output').innerHTML = '';

        let elemental;
    elemental = [["Weapon Name", "Char", "AOE", "Type", "ATB", "Element", "Pot%", "Max%", "% per ATB", "Type", "Condition"]];

    for (let i = 0; i < weaponDatabase.length; i++) {
        //        const found = findWeaponWithProperty(weaponDatabase[i], 'gachaType', "L");
        //        if (found) {
        // Make a new row and push them into the list
        let row = [];

        row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
        row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
        row.push(getValueFromDatabaseItem(weaponDatabase[i], "range"));
        row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));

        const atb = getValueFromDatabaseItem(weaponDatabase[i], "atb");
        row.push(atb);

        row.push(getValueFromDatabaseItem(weaponDatabase[i], "element"));

        let pot, maxPot;

        pot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10"));
        row.push(pot);

        maxPot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "maxPotOb10"));
        row.push(maxPot);

        // % per ATB
        if (atb != 0) {
            row.push((maxPot / atb).toFixed(0));
        }
        else {
            row.push(maxPot);
        }

        type = getValueFromDatabaseItem(weaponDatabase[i], "gachaType");
        if (type == "L") {
            row.push("Limited");
        }
        else if (type == "Y") {
            row.push("Event");
        }
        else {
            row.push("Featured");
        }

        if (elem != "Heal") {
            // @todo: Need to figure out a good way to deal with this stupid weapon
            if ((maxPot > pot) || (getValueFromDatabaseItem(weaponDatabase[i], "name") == "Bahamut Greatsword") ||
                (getValueFromDatabaseItem(weaponDatabase[i], "name") == "Sabin's Claws") ||
                (getValueFromDatabaseItem(weaponDatabase[i], "name") == "Blade of the Worthy") ||
                (getValueFromDatabaseItem(weaponDatabase[i], "name") == "Umbral Blade")) {
                // Check to see if DMG+ Condition is from Effect1 or Effect2 
                if (findWeaponWithProperty(weaponDatabase[i], 'effect1', "DMG")) {
                    row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition1"));
                }
                else {
                    row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition2"));
                }
            }
            else {
                row.push("");
            }
        }

        elemental.push(row);
        //        }

        //        elemental.sort(elementalCompare);
    }

        tableCreate(elemental.length, elemental[0].length, elemental, header);
    });
}


function printWeaponElem(elem, header) {
    // No readDatabase call here - called from parent functions that already loaded DB
    let elemental;
    if (elem != "Heal") {
        elemental = [["Weapon Name", "Char", "AOE", "Type", "ATB", "Uses", "Pot%", "Max%", "% per ATB", "Condition"]];
    }
    else {
        elemental = [["Weapon Name", "Char", "AOE", "Type", "ATB", "Uses", "Target", "Pot%", "Max%", "% per ATB"]];
    }

    for (let i = 0; i < weaponDatabase.length; i++) {
        const found = findWeaponWithProperty(weaponDatabase[i], 'element', elem);
        if (found) {
            if (elem == "Heal") {
                // Low % heal is not worth it - filter below threshold
                if (parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10")) < HEAL_MIN_POTENCY_THRESHOLD)
                    continue;
            }

            // Make a new row and push them into the list
            let row = [];

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "range"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));

            const atb = getValueFromDatabaseItem(weaponDatabase[i], "atb");
            row.push(atb);

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "uses"));

            if (elem == "Heal") {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Target"));
            }

            let pot, maxPot;

            pot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10"));
            row.push(pot);

            maxPot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "maxPotOb10"));
            row.push(maxPot);

            // % per ATB
            if (atb != 0) {
                row.push((maxPot / atb).toFixed(0));
            }
            else {
                row.push(maxPot);
            }

            if (elem != "Heal") {
                // Check if weapon should show condition column (using metadata registry)
                const weaponName = getValueFromDatabaseItem(weaponDatabase[i], "name");
                if (shouldShowCondition(weaponName, pot, maxPot)) {
                    row.push(getWeaponCondition(weaponDatabase[i]));
                }
                else {
                    row.push("");
                }
            }

            elemental.push(row);
        }

        elemental.sort(elementalCompare);
    }

    tableCreate(elemental.length, elemental[0].length, elemental, header);
}


function printWeaponSigil(sigil, header) {
    // No readDatabase call here - called from parent functions that already loaded DB
    let materia = [["Weapon Name", "Char", "AOE", "Type", "Elem", "ATB", "Uses", "Pot%", "Max%"]];

    for (let i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'sigil', sigil)) {
            let row = [];

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "range"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "element"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "atb"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "uses"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "potOb10"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "maxPotOb10"));

            materia.push(row);
        }
    }

    tableCreate(materia.length, materia[0].length, materia, header);
}
function printWeaponMateria(elemMateria, header) {
    // No readDatabase call here - called from parent functions that already loaded DB
    let materia = [["Weapon Name", "Char", "AOE", "Type", "Elem", "ATB", "Uses", "Pot%", "Max%"]];

    for (let i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'support1', elemMateria) ||
            findWeaponWithProperty(weaponDatabase[i], 'support2', elemMateria) ||
            findWeaponWithProperty(weaponDatabase[i], 'support3', elemMateria)) {

            let row = [];
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "range"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "element"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "atb"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "uses"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "potOb10"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "maxPotOb10"));

            materia.push(row);
        }
    }

    tableCreate(materia.length, materia[0].length, materia, header);
}

function printRegenWeapon(header) {
    // No readDatabase call here - called from parent functions that already loaded DB
    let effect = [["Name", "Char", "Type", "ATB", "Uses", "AOE", "Target", "Duration (s)", "Pot%", "Max%", "% per ATB"]];
    const text = "Regen";

    for (let i = 0; i < weaponDatabase.length; i++) {
        if (findWeaponWithProperty(weaponDatabase[i], 'element', "Heal")) {
            if ((found = findWeaponWithProperty(weaponDatabase[i], 'effect1', text)) || findWeaponWithProperty(weaponDatabase[i], 'effect2', text)) {
                // Make a new row and push them into the list
                let row = [];

                row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));

                const atb = getValueFromDatabaseItem(weaponDatabase[i], "atb");
                row.push(atb);

                row.push(getValueFromDatabaseItem(weaponDatabase[i], "uses"));

                let dur, pot, maxPot;

                if (found) {
                    row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Range"));
                }
                else {
                    row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Range"));
                }
                if (found) {
                    row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Target"));

                    dur = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "effect1Dur"));
                    row.push(dur);
                }
                else {
                    row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Target"));

                    dur = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "effect2Dur"));
                    row.push(dur);
                }

                pot = parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10"));
                row.push(pot);
                maxPot = pot;

                if (dur != 0) {
                    // Regen is REGEN_TICK_PERCENT% per tick every REGEN_TICK_INTERVAL_SEC + initial tick for total
                    maxPot = Math.floor(dur / REGEN_TICK_INTERVAL_SEC) * REGEN_TICK_PERCENT + pot;
                }
                row.push(maxPot);

                if (atb != 0) {
                    row.push((maxPot / atb).toFixed(0));
                }
                else {
                    row.push(maxPot);
                }

                effect.push(row);
            }
        }
    }

    tableCreate(effect.length, effect[0].length, effect, header);
}

function printWeaponEffect(text, header) {
    // No readDatabase call here - called from parent functions that already loaded DB
    let effect = [["Name", "Char", "Type", "Elem", "ATB", "Uses", "AOE", "Target", "Pot", "Max Pot", "Duration (s)", "Condition"]];
    for (let i = 0; i < weaponDatabase.length; i++) {
        if ((found = findWeaponWithProperty(weaponDatabase[i], 'effect1', text)) || (found2 = findWeaponWithProperty(weaponDatabase[i], 'effect2', text))
            || findWeaponWithProperty(weaponDatabase[i], 'effect3', text)) {
            // Make a new row and push them into the list
            let row = [];

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "element"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "atb"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "uses"));

            if (found) {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Range"));
            }
            else if (found2) {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Range"));
            }
            else {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Range"));
            }
            if (found) {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Target"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Pot"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1MaxPot"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Dur"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition1"));
            }
            else if (found2) {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Target"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Pot"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2MaxPot"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Dur"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition2"));
            }
            else {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect3Target"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect3Pot"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect3MaxPot"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect3Dur"));
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition3"));
            }

            effect.push(row);
        }
    }

    tableCreate(effect.length, effect[0].length, effect, header);
}

function printWeaponUniqueEffect(text, header) {
    // No readDatabase call here - called from parent functions that already loaded DB
    let effect = [["Name", "Char", "AOE", "Type", "Elem", "ATB", "Uses", "Target1", "Effect1", "Condition1", "Target2", "Effect2", "Condition2"]];

    for (let i = 0; i < weaponDatabase.length; i++) {
        if ((found = findWeaponWithProperty(weaponDatabase[i], 'effect1', text)) ||
            findWeaponWithProperty(weaponDatabase[i], 'effect2', text)) {
            let row = [];

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "name"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "charName"));
            if (found) {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Range"));
            }
            else {
                row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Range"));
            }

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "type"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "element"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "atb"));
            row.push(getValueFromDatabaseItem(weaponDatabase[i], "uses"));

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect1Target"));
            const str1 = getValueFromDatabaseItem(weaponDatabase[i], "effect1");
            const indexOfFirst1 = str1.indexOf(text);
            if (indexOfFirst1 >= 0) {
                const newstr1 = str1.substring(indexOfFirst1 + text.length + 1);
                row.push(newstr1);
            }
            else {
                row.push(str1);
            }

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition1"));

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "effect2Target"));

            const str2 = getValueFromDatabaseItem(weaponDatabase[i], "effect2");
            const indexOfFirst2 = str2.indexOf(text);
            if (indexOfFirst2 >= 0) {
                const newstr2 = str2.substring(indexOfFirst2 + text.length + 1);
                row.push(newstr2);
            }
            else {
                row.push(str2);
            }

            row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition2"));


            effect.push(row);
        }
    }

    tableCreate(effect.length, effect[0].length, effect, header);
}

// Load file from local server (async version)
function loadFile(filePath, callback) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, true); // Changed to async (true)
    xmlhttp.onload = function() {
        if (xmlhttp.status == 200) {
            callback(xmlhttp.responseText, null);
        } else {
            callback(null, 'Failed to load file: HTTP ' + xmlhttp.status);
        }
    };
    xmlhttp.onerror = function() {
        callback(null, 'Network error occurred');
    };
    xmlhttp.send();
}


// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    //    console.log(strData);
    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        let strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

// Load database on page load to populate filter count badges
window.addEventListener('DOMContentLoaded', function() {
    showLoadingSpinner('Loading weapon database...');
    readDatabase(function() {
        // Database loaded and calculateFilterCounts() already called
        // Clear the loading spinner since we're not rendering tables yet
        document.getElementById('Output').innerHTML = '';
    });
});
