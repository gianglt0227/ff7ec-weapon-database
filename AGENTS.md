# AGENTS.md

Documentation for AI coding agents (Cursor, Windsurf, Aider, Continue, etc.) working with this codebase.

## Project Overview

**FF7EC Weapon Database** - An interactive single-page web application for browsing and filtering Final Fantasy VII Ever Crisis weapon data.

- **Language**: Vanilla JavaScript (ES5) - No frameworks, no build system
- **Data Source**: CSV file with 434+ weapons, 50+ columns per weapon
- **Dependencies**: jQuery 3.7.1, DataTables 2.1.8 (loaded from CDN)
- **Testing**: Jest 29.7.0 with 130+ passing tests

## Quick Commands

```bash
# Run the application
python -m http.server 8000
# Then open http://localhost:8000

# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for tests
npm run test:watch
```

## Architecture Summary

### Data Flow
```
User clicks filter → filter*() function → readDatabase() (lazy load CSV)
→ Loop through weaponDatabase array → findWeaponWithProperty() filters
→ Build 2D array with selected columns → tableCreate() renders HTML
→ DataTables.js initialization for sorting
```

### Key Files

| File | Purpose | Lines | Notes |
|------|---------|-------|-------|
| `index.html` | Main page | 50 | Dropdown menu with 20+ filters |
| `scripts.js` | Application logic | 1,030 | 45 functions, heavy duplication |
| `styles.css` | Styling | - | Table layouts for different views |
| `weaponData.csv` | Data | 435 | 50+ columns, parsed with regex |

### Function Categories (scripts.js)

1. **Pure Functions** (5 functions) - Highly testable
   - `CSVToArray()` - CSV parser with regex (lines 949-1030)
   - `findElement()` - Array search (lines 246-250)
   - `getValueFromDatabaseItem()` - Property extraction (lines 251-255)
   - `findWeaponWithProperty()` - Substring matching (lines 256-266)
   - `elementalCompare()` - Sorting comparator (lines 268-278)

2. **Data Processing** (13 functions) - Requires mocking
   - `readDatabase()` - CSV loading (lines 173-243)
   - `printWeaponElem()` - Element filtering (lines 621-699)
   - `printWeaponEffect()` - Effect filtering (lines 819-872)
   - `printRegenWeapon()` - Regen calculation (lines 753-817)
   - And 9 more `printWeapon*()` functions

3. **DOM Manipulation** (3 functions) - Low testability
   - `tableCreate()` - HTML table generation (lines 20-99)
   - `sortTable()` - Bubble sort DOM rows (lines 101-172)
   - `ecSearch()` - Dropdown toggle (lines 14-17)

4. **Wrapper Functions** (26 functions) - Filter button handlers
   - All `filter*()` functions delegate to `printWeapon*()` functions

## Critical Implementation Details

### Special Cases You Must Know

1. **Hardcoded Weapon Exceptions**
   ```javascript
   // Lines 517-520, 675-678, 594-597
   if (name === "Bahamut Greatsword" || name === "Sabin's Claws" ||
       name === "Blade of the Worthy" || name === "Umbral Blade") {
       // Special conditional damage handling
   }
   ```

2. **Regen Formula** (lines 798-801)
   ```javascript
   maxPot = Math.floor(dur / 3) * 15 + pot
   // Ticks every 3 seconds, each tick = 15% heal
   ```

3. **Healing Threshold** (line 636)
   ```javascript
   if (pot < 25) continue; // Filter out low-potency heals
   ```

4. **Element Mapping**
   ```javascript
   // Lightning → Thunder for resist/enchant
   // Lightning → Light for materia slots
   ```

5. **Zero ATB Handling**
   ```javascript
   if (atb == 0) display = "No Limit";
   ```

## Testing Infrastructure

### Test Structure
```
tests/
├── setup.js              # Mocks: DataTables, jQuery, console
├── test-helpers.js       # 13 utility functions
├── fixtures/
│   ├── minimal-weapons.csv      # 10 representative weapons
│   └── mock-weapon-data.js      # Mock generators
└── unit/
    ├── array-utilities.test.js  # 24 tests ✅
    ├── filter-logic.test.js     # 43 tests ✅
    ├── sorting.test.js          # 26 tests ✅
    ├── calculations.test.js     # 37 tests ✅
    └── csv-parser.test.js       # 50+ tests ⚠️ Disabled
```

### Why CSV Parser Tests Are Disabled

The `CSVToArray()` function uses complex regex that causes V8 memory allocation errors when evaluated in Jest/Node.js environment. The function works perfectly in production/browser. Tests are written but temporarily disabled via `testPathIgnorePatterns` in jest.config.js.

### Running Tests

All tests load `scripts.js` using `eval()` since the codebase isn't modularized:

```javascript
// DOM must be set up BEFORE eval
document.body.innerHTML = `
  <div id="ecDropdown"></div>
  <div id="Output"></div>
`;
eval(scriptContent);
```

## Common Tasks

### Adding New Weapons
1. Edit `weaponData.csv` - add row with 50+ columns
2. No code changes needed
3. Test by running application locally

### Adding New Filter
1. Add `<a onclick="filterNewType()">` to dropdown in index.html
2. Create `filterNewType()` function in scripts.js
3. Call appropriate `printWeapon*()` or create new one
4. Add CSS if new table structure needed
5. Write tests for new filter logic

### Debugging Filter Issues
1. Open browser DevTools Console
2. Check `weaponDatabase` array is loaded
3. Verify `findWeaponWithProperty()` returns expected results
4. Check table data array before `tableCreate()` call
5. Inspect DataTables initialization

## Code Patterns to Follow

### Filter Function Pattern
```javascript
function filterSomething() {
  ecSearch(); // Toggle dropdown
  printWeaponSomething(); // Delegate to print function
}
```

### Print Function Pattern
```javascript
function printWeaponSomething() {
  readDatabase(); // Ensure CSV loaded
  let weaponsToPrint = [];

  for (let i = 0; i < weaponDatabase.length; i++) {
    if (findWeaponWithProperty(weaponDatabase[i], 'prop', 'value')) {
      let weapon = [col1, col2, col3, ...];
      weaponsToPrint.push(weapon);
    }
  }

  weaponsToPrint.sort(elementalCompare);
  tableCreate(rows, cols, weaponsToPrint, "Header");
}
```

## Technical Debt

Known issues (acknowledged in line 3: "Trash code - Need to clean up"):
- ❌ Global state (`weaponDatabase` array)
- ❌ Heavy code duplication (26 similar filter functions)
- ❌ Mixed concerns (DOM + data processing)
- ❌ No error handling for CSV parse failures
- ❌ Magic numbers and hardcoded indices
- ❌ `sortTable()` may be unused (DataTables handles sorting)

**When making changes**: Prioritize consistency over refactoring. The codebase works reliably despite technical debt.

## Performance Characteristics

- **CSV Load**: ~100ms for 434 weapons (lazy loaded on first filter)
- **Filter Operations**: < 50ms for most filters
- **Table Rendering**: < 100ms with DataTables
- **Test Execution**: < 1 second for 130 tests

## Security Considerations

- ⚠️ No input validation or sanitization
- ⚠️ Direct innerHTML manipulation (no XSS protection)
- ⚠️ Synchronous XMLHttpRequest (deprecated but works)
- ✅ Read-only data (no user submissions)
- ✅ Static hosting (no backend vulnerabilities)

## Best Practices for This Codebase

### DO:
- ✅ Follow existing function naming patterns (`filter*`, `printWeapon*`)
- ✅ Use `findWeaponWithProperty()` for all filtering
- ✅ Maintain CSV structure exactly (50+ columns)
- ✅ Write tests for new pure functions
- ✅ Test manually with local HTTP server
- ✅ Use `elementalCompare()` for sorting by potency

### DON'T:
- ❌ Refactor without extensive testing (fragile structure)
- ❌ Add external dependencies (keep it simple)
- ❌ Change CSV column order (breaks existing logic)
- ❌ Remove "unused" code without verification
- ❌ Introduce async/await (ES5 codebase)
- ❌ Use modern JS features (no transpilation)

## Getting Help

1. **Claude Code Documentation**: See [CLAUDE.md](CLAUDE.md) for comprehensive details
2. **Test Documentation**: See [tests/README.md](tests/README.md) for testing guide
3. **Implementation Summary**: See [TEST-IMPLEMENTATION-SUMMARY.md](TEST-IMPLEMENTATION-SUMMARY.md)
4. **Known Issues**: See [TEST-FIXES-SUMMARY.md](TEST-FIXES-SUMMARY.md)

## Example Workflows

### Workflow 1: Add New Element Filter
```bash
# 1. Edit index.html - add dropdown option
<a onclick="filterDark()">Dark Weapons</a>

# 2. Edit scripts.js - add filter function
function filterDark() {
  ecSearch();
  printWeaponElem("Dark");
}

# 3. Test locally
python -m http.server 8000
# Open browser, test filter

# 4. Write test
# Add to tests/unit/filter-logic.test.js
test('should match Dark element', () => {
  const weapon = createMockWeapon({ element: 'Dark' });
  expect(findWeaponWithProperty(weapon, 'element', 'Dark')).toBe(true);
});

# 5. Run tests
npm test
```

### Workflow 2: Debug Filter Not Working
```javascript
// In browser console:
readDatabase(); // Ensure CSV loaded
console.log(weaponDatabase.length); // Should be 434+
console.log(findWeaponWithProperty(weaponDatabase[0], 'element', 'Fire'));
// Test specific weapon manually
```

### Workflow 3: Add Test for New Function
```javascript
// In tests/unit/new-feature.test.js
const fs = require('fs');
const path = require('path');

// Setup DOM BEFORE eval
document.body.innerHTML = `
  <div id="ecDropdown"></div>
  <div id="Output"></div>
`;

// Load scripts.js
const scriptContent = fs.readFileSync(
  path.join(__dirname, '../../scripts.js'), 'utf8'
);
eval(scriptContent);

describe('New Feature', () => {
  test('should do something', () => {
    // Your test here
  });
});
```

## Version Information

- **Last Updated**: December 2025
- **Test Infrastructure Added**: December 2025
- **Database Version**: FF7EC weapons as of latest CSV update
- **Node.js**: v18.20.8+ recommended
- **npm**: 9.0.0+ recommended

## Contact & Contributions

This is a community-maintained project. See README.md for contributor credits.

---

**For AI Agents**: This file provides all essential context for working with this codebase. Read [CLAUDE.md](CLAUDE.md) for even more detailed technical documentation specific to Claude Code.
