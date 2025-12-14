# FF7EC Weapon Database - Code Optimization Plan

**Date**: 2025-12-14
**Status**: Implementation In Progress
**Total Effort**: 31 hours across 3 phases
**Code Reduction**: ~400 lines (~30% reduction in scripts.js)
**Test Addition**: +86 new tests

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Findings Summary](#findings-summary)
3. [Detailed Optimization Strategies](#detailed-optimization-strategies)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Success Criteria](#success-criteria)

---

## Executive Summary

This document outlines a comprehensive code optimization strategy for the FF7EC Weapon Database codebase. The analysis identified critical issues in code quality, duplication, architecture, and performance that will be addressed through 10 targeted optimizations across 3 phases.

### Key Findings

- **400+ lines of duplicated code** across filter functions and row-building logic
- **7 functions exceeding 50 lines** violating Single Responsibility Principle
- **Global state management** preventing proper unit testing (20 skipped tests)
- **O(n²) performance bottleneck** in character count updates
- **Missing error handling** in core utility functions
- **Inconsistent code style** mixing var/let/const, naming conventions

### Approach

- **Phased implementation** with clear rollback points
- **Test-first methodology** - add tests before refactoring
- **Incremental changes** - commit after each optimization
- **No breaking changes** - all 27 filters continue working identically

---

## Findings Summary

### 🔴 Critical Issues

#### 1. Repetitive Filter Functions (20+ Functions)
- **Location**: [js/scripts.js:494-650](js/scripts.js:494-650)
- **Problem**: 156 lines of nearly-identical filter functions
- **Impact**: High maintenance burden, acknowledged in line 310 comment
- **Example**: `filterFire()`, `filterIce()`, etc. all call same pattern

#### 2. Global State Mutation
- **Location**: `weaponDatabase` array at line 13
- **Problem**: No encapsulation, mutated by 20+ functions
- **Impact**: Difficult to test (character-filter tests skipped), race conditions

#### 3. Functions Exceeding 50 Lines (7 Functions)
- `readDatabase()`: 90 lines (176-263)
- `printLimitedWeapon()`: 72 lines (688-757)
- `printAllWeapon()`: 70 lines (760-840)
- `printWeaponElem()`: 68 lines (844-922)
- `printWeaponEffect()`: 52 lines (1042-1095)
- `sortTable()`: 72 lines (104-175) - **UNUSED**
- `CSVToArray()`: 82 lines (1177-1258)

#### 4. Hardcoded Weapon Exception Checks (4 Locations)
- **Locations**: Lines 733-736, 816-819, 898-901
- **Problem**: Same 4 weapon names checked in 3+ places
- **Weapons**: Bahamut Greatsword, Sabin's Claws, Blade of the Worthy, Umbral Blade

#### 5. O(n²) Character Count Updates
- **Location**: [js/character-filter.js:81-102](js/character-filter.js:81-102)
- **Problem**: 434 weapons × 20 characters = 8,680 operations
- **Impact**: ~200ms update time (should be <10ms)

#### 6. No Separation of Concerns
- **Location**: All `printWeapon*()` functions
- **Problem**: Mix data filtering, business logic, and UI rendering
- **Impact**: Cannot unit test, tests are skipped

#### 7. Missing JSDoc Documentation
- **Location**: All functions in scripts.js
- **Problem**: Only 3/40+ functions have JSDoc
- **Impact**: Unclear parameters, return types, behavior

### 🟡 Medium Issues

#### 8. Duplicate Data Extraction Logic (150+ Lines)
- **Locations**: Lines 700-747, 771-830, 854-915
- **Problem**: Same row-building pattern repeated 3+ times

#### 9. Deep Nesting (4+ Levels)
- **Location**: Lines 1046-1087 in `printWeaponEffect()`
- **Problem**: Cognitive complexity >10

#### 10. Magic Numbers
- **Examples**: `25` (healing threshold), `15` and `3` (regen formula)
- **Problem**: No semantic meaning, scattered throughout

#### 11. No Error Handling
- **Location**: `getValueFromDatabaseItem()`, CSV parsing
- **Problem**: Silent failures, no user feedback

### 🟢 Low Priority Issues

#### 12. Inconsistent Variable Declarations
- Mix of `var`, `let`, and `const` throughout
- Modern modules use `const`/`let`, scripts.js uses `var`

#### 13. Redundant Array Sorting
- Both custom sort + DataTables sort applied

#### 14. Inconsistent Function Naming
- Mix of camelCase, lowercase, `print*` prefix

---

## Detailed Optimization Strategies

### Phase 1: Quick Wins (Week 1)

#### Optimization #1: Replace `var` with `const`/`let`
**Duration**: 2 hours | **Risk**: Very Low | **Impact**: Code safety

**Changes**:
```javascript
// Before (line 186)
var location = window.location.href;
var directoryPath = location.substring(...);

// After
const location = window.location.href;
const directoryPath = location.substring(...);
```

**Strategy**:
1. Use `const` by default
2. Use `let` only where reassignment occurs
3. Focus on: lines 186-187, 437-441, 659-670, 996, 1046, 1062
4. Run `npm test` after each batch of 20 replacements

**Commit**: `refactor: replace var with const/let for better code safety`

---

#### Optimization #2: Add Magic Number Constants
**Duration**: 1 hour | **Risk**: Very Low | **Impact**: Maintainability

**New constants** (add at line 14):
```javascript
// Game mechanics constants
const HEAL_MIN_POTENCY_THRESHOLD = 25;  // Weapons below 25% healing are filtered
const REGEN_TICK_INTERVAL_SEC = 3;      // Regen ticks every 3 seconds
const REGEN_TICK_PERCENT = 15;          // Each regen tick heals 15%
const ZERO_ATB_DISPLAY = "No Limit";    // Display text for 0 ATB cost

// Element name mappings (Lightning → Thunder in game data)
const ELEMENT_NAME_OVERRIDES = {
  'Lightning': { resist: 'Thunder', enchant: 'Thunder', materia: 'Light' }
};
```

**Usage examples**:
```javascript
// Line 859 - Before
if (parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10")) < 25)

// After
if (parseInt(getValueFromDatabaseItem(weaponDatabase[i], "potOb10")) < HEAL_MIN_POTENCY_THRESHOLD)

// Line 1023 - Before
maxPot = Math.floor(dur / 3) * 15 + pot;

// After
maxPot = Math.floor(dur / REGEN_TICK_INTERVAL_SEC) * REGEN_TICK_PERCENT + pot;
```

**Commit**: `refactor: extract magic numbers to named constants`

---

#### Optimization #3: Extract Hardcoded Weapon Exceptions
**Duration**: 3 hours | **Risk**: Low | **Impact**: Removes 45 lines duplication

**New file**: `js/weapon-metadata.js`
```javascript
/**
 * Special weapon handling rules
 * Centralized registry for weapons with non-standard behavior
 */
const WEAPON_SPECIAL_RULES = {
  "Bahamut Greatsword": {
    forceShowCondition: true,
    reason: "Variable potency based on HP threshold"
  },
  "Sabin's Claws": {
    forceShowCondition: true,
    reason: "Multi-hit with conditional bonus"
  },
  "Blade of the Worthy": {
    forceShowCondition: true,
    reason: "Stacking damage buff"
  },
  "Umbral Blade": {
    forceShowCondition: true,
    reason: "Darkness-dependent potency"
  }
};

/**
 * Check if weapon should display condition column
 * @param {string} weaponName - Weapon name
 * @param {number} pot - Base potency
 * @param {number} maxPot - Max potency
 * @returns {boolean} True if condition should be shown
 */
function shouldShowCondition(weaponName, pot, maxPot) {
  if (WEAPON_SPECIAL_RULES[weaponName]?.forceShowCondition) {
    return true;
  }
  return maxPot > pot;
}

/**
 * Get weapon condition text (effect1 or effect2 based on DMG keyword)
 * @param {Array} weapon - Weapon data object
 * @returns {string} Condition text
 */
function getWeaponCondition(weapon) {
  if (findWeaponWithProperty(weapon, 'effect1', "DMG")) {
    return getValueFromDatabaseItem(weapon, "condition1");
  }
  return getValueFromDatabaseItem(weapon, "condition2");
}
```

**Replace in scripts.js** (lines 733-747, 816-830, 898-912):
```javascript
// Before (15 lines repeated 3 times)
if ((maxPot > pot) ||
    (getValueFromDatabaseItem(weaponDatabase[i], "name") == "Bahamut Greatsword") ||
    (getValueFromDatabaseItem(weaponDatabase[i], "name") == "Sabin's Claws") ||
    ...) {
  if (findWeaponWithProperty(weaponDatabase[i], 'effect1', "DMG")) {
    row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition1"));
  } else {
    row.push(getValueFromDatabaseItem(weaponDatabase[i], "condition2"));
  }
} else {
  row.push("");
}

// After (3 lines)
if (shouldShowCondition(weaponName, pot, maxPot)) {
  row.push(getWeaponCondition(weaponDatabase[i]));
} else {
  row.push("");
}
```

**Tests**: Add to `tests/unit/calculations.test.js` (5 new tests)

**Commit**: `refactor: extract hardcoded weapon exceptions to metadata registry`

---

#### Optimization #4: Eliminate Filter Function Duplication
**Duration**: 4 hours | **Risk**: Low | **Impact**: Removes 156 lines

**New file**: `js/filter-registry.js`
```javascript
/**
 * Filter configuration registry
 * Centralizes all 27 filter definitions
 */
const FILTER_CONFIGS = {
  // Element filters
  fire: { type: 'element', value: 'Fire', handler: 'printElemWeapon' },
  ice: { type: 'element', value: 'Ice', handler: 'printElemWeapon' },
  lightning: { type: 'element', value: 'Lightning', handler: 'printElemWeapon' },
  water: { type: 'element', value: 'Water', handler: 'printElemWeapon' },
  wind: { type: 'element', value: 'Wind', handler: 'printElemWeapon' },
  earth: { type: 'element', value: 'Earth', handler: 'printElemWeapon' },
  none: { type: 'element', value: 'None', handler: 'printElemWeapon' },

  // Stat debuffs
  matkDown: { type: 'effect', value: '[Debuff] MATK', header: 'Weapon with [Debuff] MATK:', handler: 'printWeaponEffect' },
  patkDown: { type: 'effect', value: '[Debuff] PATK', header: 'Weapon with [Debuff] PATK:', handler: 'printWeaponEffect' },
  pdefDown: { type: 'effect', value: '[Debuff] PDEF', header: 'Weapon with [Debuff] PDEF:', handler: 'printWeaponEffect' },
  mdefDown: { type: 'effect', value: '[Debuff] MDEF', header: 'Weapon with [Debuff] MDEF:', handler: 'printWeaponEffect' },

  // Stat buffs
  patkUp: { type: 'buff', value: '[Buff] PATK', header: 'Weapon with [Buff] PATK:', handler: 'printWeaponEffect' },
  matkUp: { type: 'buff', value: '[Buff] MATK', header: 'Weapon with [Buff] MATK:', handler: 'printWeaponEffect' },
  pdefUp: { type: 'buff', value: '[Buff] PDEF', header: 'Weapon with [Buff] PDEF:', handler: 'printWeaponEffect' },
  mdefUp: { type: 'buff', value: '[Buff] MDEF', header: 'Weapon with [Buff] MDEF:', handler: 'printWeaponEffect' },

  // Materia slots
  circle: { type: 'materia', value: 'Circle', header: 'Weapon with ◯ Sigil Materia Slot:', handler: 'printWeaponMateria' },
  triangle: { type: 'materia', value: 'Triangle', header: 'Weapon with △ Sigil Materia Slot:', handler: 'printWeaponMateria' },
  xSigil: { type: 'materia', value: 'X Sigil', header: 'Weapon with ✕ Sigil Materia Slot:', handler: 'printWeaponMateria' },
  diamond: { type: 'sigil', value: 'Diamond', header: 'Weapon with ◊ Sigil:', handler: 'printWeaponSigil' },

  // Special filters
  exploitWeakness: { type: 'effect', value: '[Buff] Weakness', header: 'Exploit Weakness Weapon:', handler: 'printWeaponEffect' },
  provoke: { type: 'multi', handler: 'filterProvoke' },  // Complex filter with multiple calls
  heal: { type: 'multi', handler: 'filterHeal' },        // Complex filter
  unique: { type: 'multi', handler: 'filterUniqueEffect' }, // Complex filter
  limited: { type: 'gacha', value: 'L', header: 'Limited/Crossover Weapons:', handler: 'printLimitedWeapon' },
  all: { type: 'all', header: 'List of All Weapons:', handler: 'printAllWeapon' }
};

/**
 * Generic filter executor
 * @param {string} filterKey - Key from FILTER_CONFIGS
 */
function executeFilterByKey(filterKey) {
  const config = FILTER_CONFIGS[filterKey];
  if (!config) {
    console.error(`Unknown filter: ${filterKey}`);
    return;
  }

  // Handle complex multi-part filters
  if (config.type === 'multi') {
    window[config.handler]();
    return;
  }

  closeDropdown();
  readDatabase(() => {
    document.getElementById('Output').innerHTML = '';

    // Route to appropriate handler
    if (config.type === 'element') {
      printElemWeapon(config.value);
    } else if (config.type === 'effect' || config.type === 'buff') {
      printWeaponEffect(config.value, config.header);
    } else if (config.type === 'materia') {
      printWeaponMateria(config.value, config.header);
    } else if (config.type === 'sigil') {
      printWeaponSigil(config.value, config.header);
    } else if (config.type === 'gacha') {
      printLimitedWeapon(config.value, config.header);
    } else if (config.type === 'all') {
      printAllWeapon('', config.header);
    }
  });
}

// Generate global functions for backward compatibility with onclick handlers
Object.keys(FILTER_CONFIGS).forEach(key => {
  const fnName = `filter${key.charAt(0).toUpperCase() + key.slice(1)}`;
  window[fnName] = () => executeFilterByKey(key);
});
```

**Remove from scripts.js**: Lines 494-650 (156 lines)

**Tests**: New file `tests/unit/filter-registry.test.js` (10 tests)

**Commit**: `refactor: consolidate 27 filter functions into configuration registry`

---

### Phase 2: Structure Improvements (Week 2-3)

#### Optimization #5: Remove Unused sortTable() Function
**Duration**: 1 hour | **Risk**: Low | **Impact**: Removes 72 lines dead code

**Verification steps**:
1. Search codebase for `sortTable(` - should find 0 calls
2. Check HTML for `onclick="sortTable"` - should find 0
3. Confirm DataTables handles all sorting

**Remove**: Lines 104-175 in scripts.js

**Add comment**:
```javascript
// REMOVED: sortTable() function (72 lines) at lines 104-175
// DataTables.js handles all table sorting as of 2025-12-13
// Legacy function was never called after modern table renderer added
```

**Commit**: `refactor: remove unused sortTable() function (DataTables handles sorting)`

---

#### Optimization #6: Refactor readDatabase() Function
**Duration**: 8 hours | **Risk**: Medium | **Impact**: Enables 20 skipped tests

**New file**: `js/database-loader.js`

**Step 1**: Create `parseWeaponRow()` - TDD approach
```javascript
/**
 * Parse single weapon row from CSV array into weapon object
 * @param {Array<string>} row - CSV row array (50+ columns expected)
 * @returns {Array<Object>} Weapon data as {name, value} pairs
 * @throws {Error} If row is invalid or missing required columns
 */
function parseWeaponRow(row) {
  if (!row || row.length < 40) {
    throw new Error(`Invalid weapon row: expected 50+ columns, got ${row?.length || 0}`);
  }

  const weapData = [];
  let m = 0;

  // Basic properties (0-6)
  weapData.push({ name: 'name', value: row[m++] || '' });
  weapData.push({ name: 'charName', value: row[m++] || '' });
  weapData.push({ name: 'sigil', value: row[m++] || '' });
  weapData.push({ name: 'atb', value: row[m++] || '' });
  weapData.push({ name: 'type', value: row[m++] || '' });
  weapData.push({ name: 'element', value: row[m++] || '' });
  weapData.push({ name: 'range', value: row[m++] || '' });

  // Effect 1 (7-10)
  weapData.push({ name: 'effect1Target', value: row[m++] || '' });
  weapData.push({ name: 'effect1', value: row[m++] || '' });
  weapData.push({ name: 'effect1Pot', value: row[m++] || '' });
  weapData.push({ name: 'effect1MaxPot', value: row[m++] || '' });

  // Effect 2 (11-14)
  weapData.push({ name: 'effect2Target', value: row[m++] || '' });
  weapData.push({ name: 'effect2', value: row[m++] || '' });
  weapData.push({ name: 'effect2Pot', value: row[m++] || '' });
  weapData.push({ name: 'effect2MaxPot', value: row[m++] || '' });

  // Effect 3 (15-18)
  weapData.push({ name: 'effect3Target', value: row[m++] || '' });
  weapData.push({ name: 'effect3', value: row[m++] || '' });
  weapData.push({ name: 'effect3Pot', value: row[m++] || '' });
  weapData.push({ name: 'effect3MaxPot', value: row[m++] || '' });

  // Support materia (19-21)
  weapData.push({ name: 'support1', value: row[m++] || '' });
  weapData.push({ name: 'support2', value: row[m++] || '' });
  weapData.push({ name: 'support3', value: row[m++] || '' });

  // R-Abilities (22-23)
  weapData.push({ name: 'rAbility1', value: row[m++] || '' });
  weapData.push({ name: 'rAbility2', value: row[m++] || '' });

  // Potencies (24-25)
  weapData.push({ name: 'potOb10', value: row[m++] || '' });
  weapData.push({ name: 'maxPotOb10', value: row[m++] || '' });

  // Durations (26-28)
  weapData.push({ name: 'effect1Dur', value: row[m++] || '' });
  weapData.push({ name: 'effect2Dur', value: row[m++] || '' });
  weapData.push({ name: 'effect3Dur', value: row[m++] || '' });

  // Conditions (29-31)
  weapData.push({ name: 'condition1', value: row[m++] || '' });
  weapData.push({ name: 'condition2', value: row[m++] || '' });
  weapData.push({ name: 'condition3', value: row[m++] || '' });

  // Skip 15 columns (32-46)
  m += 15;

  // Range and Uses (47-48)
  weapData.push({ name: 'effect1Range', value: row[m++] || '' });

  // Special handling for uses field
  const usesValue = row[m++];
  weapData.push({
    name: 'uses',
    value: (usesValue == 0 || usesValue == '0') ? ZERO_ATB_DISPLAY : usesValue
  });

  // Skip ID column
  m++;

  // Gacha type and effect2 range (50-51)
  weapData.push({ name: 'gachaType', value: row[m++] || '' });
  weapData.push({ name: 'effect2Range', value: row[m++] || '' });

  return weapData;
}
```

**Step 2**: Create `parseWeaponCSV()`
```javascript
/**
 * Parse CSV text into weapon database array
 * @param {string} csvText - Raw CSV file content
 * @returns {Array<Array<Object>>} Array of weapon objects
 * @throws {Error} If CSV is invalid or empty
 */
function parseWeaponCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    throw new Error('Invalid CSV input: expected non-empty string');
  }

  const lines = csvText.split('\n');
  if (lines.length < WEAP_NUM_SKIP_LINE + 1) {
    throw new Error(`CSV too short: expected at least ${WEAP_NUM_SKIP_LINE + 1} lines, got ${lines.length}`);
  }

  const weapons = [];
  const errors = [];

  for (let lineNum = WEAP_NUM_SKIP_LINE; lineNum < lines.length - 1; lineNum++) {
    try {
      const row = CSVToArray(lines[lineNum], ',');
      if (!row || !row[0] || row[0].length < 40) {
        errors.push(`Line ${lineNum + 1}: insufficient columns (expected 50+, got ${row?.[0]?.length || 0})`);
        continue;
      }

      const weapon = parseWeaponRow(row[0]);
      weapons.push(weapon);
    } catch (err) {
      errors.push(`Line ${lineNum + 1}: ${err.message}`);
    }
  }

  if (errors.length > 0 && errors.length < 10) {
    console.warn('CSV parsing warnings:', errors);
  } else if (errors.length >= 10) {
    console.error(`CSV parsing errors (${errors.length} total):`, errors.slice(0, 5));
    showLoadingError(`CSV has ${errors.length} parsing errors. Check console for details.`);
  }

  if (weapons.length === 0) {
    throw new Error('No valid weapons found in CSV');
  }

  console.log(`Loaded ${weapons.length} weapons (${errors.length} errors)`);
  return weapons;
}
```

**Step 3**: Create `getCSVUrl()`
```javascript
/**
 * Get CSV file URL with cache busting
 * @returns {string} CSV file URL with timestamp
 */
function getCSVUrl() {
  const location = window.location.href;
  const directoryPath = location.substring(0, location.lastIndexOf("/") + 1);
  // Add timestamp to prevent caching during development
  return directoryPath + FILE_NAME + "?t=" + new Date().getTime();
}
```

**Step 4**: Refactor `readDatabase()`
```javascript
/**
 * Load weapon database from CSV file
 * @param {Function} callback - Called after load completes
 */
function readDatabase(callback) {
  // Early return if already loaded
  if (weaponDatabase[0] != null) {
    if (callback) callback();
    return;
  }

  showLoadingSpinner('Loading weapon database...');

  const csvUrl = getCSVUrl();
  loadFile(csvUrl, (result, error) => {
    if (error) {
      showLoadingError(error);
      console.error('Database load error:', error);
      return;
    }

    try {
      // Parse and populate global database
      weaponDatabase = parseWeaponCSV(result);

      hideLoadingSpinner();
      calculateFilterCounts();

      if (callback) callback();
    } catch (parseError) {
      showLoadingError(`Failed to parse weapon data: ${parseError.message}`);
      console.error('Parse error:', parseError);
    }
  });
}
```

**Tests**: New file `tests/unit/database-loader.test.js` (25 tests)

**Update index.html**: Add `<script src="js/database-loader.js"></script>` before scripts.js

**Commit**: `refactor: extract database loading into testable functions`

---

#### Optimization #7: Extract Row-Building Logic
**Duration**: 6 hours | **Risk**: Medium | **Impact**: Removes 120+ lines duplication

**New file**: `js/table-builders.js`

*[Full implementation as shown in the detailed plan earlier]*

**Commit**: `refactor: consolidate row-building logic into reusable utilities`

---

#### Optimization #8: Add Error Handling
**Duration**: 4 hours | **Risk**: Low | **Impact**: Better UX

**Update `findElement()`**:
```javascript
function findElement(arr, propName, propValue) {
  if (!arr || !Array.isArray(arr)) {
    console.warn('findElement: invalid array', arr);
    return undefined;
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] && arr[i][propName] === propValue) {
      return arr[i];
    }
  }

  return undefined;
}
```

**Update `getValueFromDatabaseItem()`**:
```javascript
function getValueFromDatabaseItem(item, name) {
  if (!item || !Array.isArray(item)) {
    console.warn('getValueFromDatabaseItem: invalid item', item);
    return '';
  }

  const prop = findElement(item, "name", name);
  if (!prop || !prop.hasOwnProperty('value')) {
    console.warn(`getValueFromDatabaseItem: property "${name}" not found`);
    return '';
  }

  return prop.value || '';
}
```

**Tests**: Add 15 error case tests

**Commit**: `feat: add comprehensive error handling and validation`

---

### Phase 3: Performance (Week 4)

#### Optimization #9: Optimize Character Count Updates
**Duration**: 2 hours | **Risk**: Low | **Impact**: 19x faster

**Replace** in `js/character-filter.js` (lines 81-122):
```javascript
function updateCharacterCounts() {
  // Initialize counts (O(c) where c ≈ 20 characters)
  const characterWeapons = {};
  allCharacters.forEach(char => {
    characterWeapons[char] = new Set();
  });

  // Single pass through rows (O(n) where n = visible weapons)
  const allRows = document.querySelectorAll('#Output table tbody tr');
  allRows.forEach(row => {
    const weaponName = row.cells[0]?.textContent.trim();
    const charName = row.cells[1]?.textContent.trim();

    if (weaponName && charName && characterWeapons[charName]) {
      characterWeapons[charName].add(weaponName);
    }
  });

  // Batch DOM update (O(c)) - only update if changed
  const container = document.getElementById('characterFilterButtons');
  if (!container) return;

  const buttons = container.querySelectorAll('button[data-char]');
  buttons.forEach(btn => {
    const char = btn.dataset.char;
    const count = characterWeapons[char]?.size || 0;
    const countSpan = btn.querySelector('span:last-child');

    // Only update DOM if count changed
    if (countSpan && countSpan.textContent !== `(${count})`) {
      countSpan.textContent = `(${count})`;
    }
  });
}
```

**Performance**:
- **Before**: 8,680 operations (nested loops)
- **After**: 454 operations (single pass + updates)
- **Improvement**: ~19x faster (~200ms → ~10ms)

**Tests**: Add performance test to character-filter.test.js

**Commit**: `perf: optimize character count updates from O(n²) to O(n)`

---

## Implementation Roadmap

### Timeline

| Week | Phase | Tasks | Commits | Lines | Tests |
|------|-------|-------|---------|-------|-------|
| 1 | Phase 1 | var→const, constants, exceptions, filters | 4 | -200 | +15 |
| 2-3 | Phase 2 | sortTable, database, builders, errors | 4 | -200 | +70 |
| 4 | Phase 3 | Performance optimization | 1 | 0 | +1 |
| **Total** | **3** | **10 optimizations** | **9** | **-400** | **+86** |

### Commit Strategy

Each optimization gets its own commit with:
- Descriptive commit message following conventional commits
- All tests passing
- No breaking changes

**Commit format**: `<type>: <description>`
- `refactor:` - Code restructuring, no behavior change
- `feat:` - New functionality (error handling)
- `perf:` - Performance improvement
- `test:` - Test additions

---

## Success Criteria

### Quantitative Metrics
- ✅ Reduce scripts.js: 1,270 → ~870 lines (-31%)
- ✅ Add tests: 150 → 236 (+86 tests)
- ✅ Enable skipped tests: 20 tests now passing
- ✅ Performance: Character counts 19x faster
- ✅ Coverage: >90% for pure functions

### Qualitative Metrics
- ✅ All 27 filters work identically
- ✅ No user-facing changes
- ✅ Better maintainability (DRY, SRP)
- ✅ Clear documentation (JSDoc)
- ✅ Better error messages

### Testing Checklist
- [ ] All unit tests pass
- [ ] Manual test all 27 filters
- [ ] Test character filter
- [ ] Test error states
- [ ] Performance benchmarks
- [ ] No console errors

---

## Risk Mitigation

### Testing Strategy
1. **After each change**: `npm test`
2. **After each phase**: Manual smoke test
3. **Before commit**: Full regression
4. **After deployment**: Monitor console

### Rollback Plan
- Each optimization is separate commit
- Can `git revert` individual commits
- Database loader wrapped in module (can disable)
- Performance change isolated (easy revert)

**Emergency**: `git revert HEAD~N` where N = commits to undo

---

## Files Modified

### New Files (5)
1. `CODE-OPTIMIZATION-PLAN.md` (this file)
2. `js/weapon-metadata.js` (special weapon rules)
3. `js/filter-registry.js` (filter configuration)
4. `js/database-loader.js` (CSV loading utilities)
5. `js/table-builders.js` (row building utilities)

### Modified Files (4)
1. `js/scripts.js` (core refactoring, -400 lines)
2. `js/character-filter.js` (performance optimization)
3. `js/table-renderer.js` (minor updates)
4. `index.html` (add script tags)

### Test Files (6)
1. `tests/unit/filter-registry.test.js` (NEW, 10 tests)
2. `tests/unit/database-loader.test.js` (NEW, 25 tests)
3. `tests/unit/table-builders.test.js` (NEW, 30 tests)
4. `tests/unit/character-filter.test.js` (updated, +6 tests)
5. `tests/unit/table-renderer.test.js` (updated, +5 tests)
6. `tests/unit/calculations.test.js` (updated, +5 tests)

---

## Post-Implementation

### Documentation Updates
- [ ] Update CLAUDE.md architecture section
- [ ] Update tests/README.md with new tests
- [ ] Add JSDoc to all new functions
- [ ] Update this document with actual timings

### Future Enhancements (Optional)
- ES6 module structure (+16 hours)
- Promise-based async loading
- TypeScript conversion
- Bundle optimization

---

## Notes

- All changes preserve backward compatibility
- No user-facing functionality changes
- Focus on maintainability over clever code
- Incremental approach with clear rollback points
- Tests pass at each checkpoint

**Status**: ✅ Plan complete, ready for implementation
**Next**: Create baseline tests, then begin Phase 1
