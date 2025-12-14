# AGENTS.md

Documentation for AI coding agents (Cursor, Windsurf, Aider, Continue, etc.) working with this codebase.

## Project Overview

**FF7EC Weapon Database** - An interactive single-page web application for browsing and filtering Final Fantasy VII Ever Crisis weapon data.

- **Language**: Vanilla JavaScript (ES5) - No frameworks, no build system
- **Styling**: Tailwind CSS (via Tailwind CLI, production build)
- **Data Source**: CSV file with 434+ weapons, 50+ columns per weapon
- **Dependencies**: jQuery 3.7.1, DataTables 2.1.8 (loaded from CDN)
- **Testing**: Jest 29.7.0 with 150 tests (130 passing, 20 skipped)
- **Build**: Tailwind CLI for CSS compilation

## Quick Commands

```bash
# Run the application
python -m http.server 8000
# Then open http://localhost:8000

# Install dependencies
npm install

# Build CSS (production)
npm run build:css

# Watch CSS (development)
npm run watch:css

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
| `index.html` | Main UI | - | Tailwind CSS (production build) |
| `index-legacy.html` | Legacy UI | 50 | Dropdown menu with 20+ filters |
| `js/scripts.js` | Core logic | 1,030 | 45 functions, heavy duplication |
| `js/character-filter.js` | Character filter | 118 | Filter state and UI |
| `js/table-renderer.js` | Table generation | 111 | Modern Tailwind tables |
| `js/ui-dropdown.js` | Dropdown toggle | 14 | Click-outside logic |
| `js/last-update.js` | Last update date | 12 | Date display |
| `css/styles.css` | Legacy styles | - | Table layouts |
| `src/input.css` | Tailwind source | 212 | Directives + custom styles |
| `dist/output.css` | Compiled CSS | 30KB | Production build |
| `weaponData.csv` | Data | 435 | 50+ columns, parsed with regex |

### Function Categories (scripts.js)

1. **Pure Functions** (5 functions) - Highly testable
   - `CSVToArray()` - CSV parser with regex (lines 949-1030 in js/scripts.js)
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

3. **DOM Manipulation** (7 functions) - Low testability
   - `tableCreate()` - HTML table generation (in js/table-renderer.js)
   - `sortTable()` - Bubble sort DOM rows (in js/scripts.js, lines 101-172)
   - `ecSearch()` - Dropdown toggle (in js/scripts.js, lines 14-17)
   - `populateCharacterFilter()` - Character filter UI (in js/character-filter.js)
   - `toggleCharacterFilter()` - Toggle character selection
   - `applyCharacterFilter()` - Apply filter to tables
   - `displayLastUpdateDate()` - Update date display (in js/last-update.js)

4. **Wrapper Functions** (26 functions) - Filter button handlers
   - All `filter*()` functions delegate to `printWeapon*()` functions

## Hybrid Architecture (index.html)

`index.html` is the new modern interface. It uses a **Hybrid Architecture**:
1.  **UI**: Native Tailwind CSS for layout, headers, and spacing.
2.  **Logic**: Reuses the legacy `scripts.js` logic completely.
3.  **Bridge**: It includes a custom `<script>` block that overrides the global `tableCreate()` function.
    *   Intercepts table data from `scripts.js`.
    *   Renders it using Tailwind classes instead of legacy `scripts.js` DOM methods.
    *   Preserves DataTables sorting logic.

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
├── setup.js                     # Mocks: DataTables, jQuery, console
├── test-helpers.js              # 13 utility functions
├── fixtures/
│   ├── minimal-weapons.csv      # 10 representative weapons
│   └── mock-weapon-data.js      # Mock generators
└── unit/
    ├── array-utilities.test.js  # 24 tests ✅
    ├── filter-logic.test.js     # 43 tests ✅
    ├── sorting.test.js          # 26 tests ✅
    ├── calculations.test.js     # 37 tests ✅
    ├── csv-parser.test.js       # 50+ tests ⚠️ Disabled
    ├── character-filter.test.js # 12 tests ⏸️ Skipped
    └── table-renderer.test.js   # 8 tests ⏸️ Skipped
```

### Why CSV Parser Tests Are Disabled

The `CSVToArray()` function uses complex regex that causes V8 memory allocation errors when evaluated in Jest/Node.js environment. The function works perfectly in production/browser. Tests are written but temporarily disabled via `testPathIgnorePatterns` in jest.config.js.

### Running Tests

All tests load `js/scripts.js` using `eval()` since the codebase isn't modularized:

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
  <div id="characterFilterContainer" class="hidden">
    <div id="characterFilterButtons"></div>
  </div>
`;

// Load js/scripts.js
const scriptContent = fs.readFileSync(
  path.join(__dirname, '../../js/scripts.js'), 'utf8'
);
eval(scriptContent);

describe('New Feature', () => {
  test('should do something', () => {
    // Your test here
  });
});
```

## ⚠️ CRITICAL: Testing Requirements

**YOU MUST follow these testing rules for ALL code changes:**

### 1. Before Committing Code

```bash
# ALWAYS run tests before committing
npm test

# If building CSS
npm run build:css
```

### 2. If Tests Fail

**DO THIS:**
1. ✅ Review YOUR code changes first
2. ✅ Debug and understand WHY the test is failing
3. ✅ Fix your code logic if the test is correct
4. ✅ Only modify tests if you're CERTAIN they're wrong

**DON'T DO THIS:**
1. ❌ Skip or disable failing tests
2. ❌ Modify tests without understanding why they fail
3. ❌ Commit broken code
4. ❌ Remove test assertions to make tests pass

### 3. For New Features

**Requirements:**
- ✅ Write tests BEFORE or ALONGSIDE implementation
- ✅ Follow existing test patterns in `tests/unit/`
- ✅ Aim for >90% coverage for pure functions
- ✅ Add integration tests for complex workflows

**Test Pattern:**
```javascript
test('should do specific thing', () => {
  // Arrange: Set up test data
  const input = createTestData();
  
  // Act: Call the function
  const result = yourFunction(input);
  
  // Assert: Verify the result
  expect(result).toBe(expected);
});
```

### 4. Test Categories

- **Unit Tests**: Pure functions (90%+ coverage required)
- **Integration Tests**: Workflows (planned)
- **Manual Tests**: UI/DOM changes (browser testing)

### 5. Build Process

```bash
# Development: Watch CSS changes
npm run watch:css

# Production: Build before commit
npm run build:css
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
