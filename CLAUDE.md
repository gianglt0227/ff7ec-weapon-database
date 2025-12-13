# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Final Fantasy 7 Ever Crisis (FF7EC) Weapon Database** web application - a single-page interactive database for browsing and filtering weapon data from the game. The application is built with vanilla JavaScript, HTML, and CSS, with no build system or framework dependencies.

## Architecture

### Core Components

1. **Data Layer** ([weaponData.csv](weaponData.csv))
   - CSV format with 50+ columns per weapon entry (434+ weapons)
   - Columns include: Name, Character, Sigil, ATB cost, Damage Type, Element, Effects (1-3), Materia slots, R-Abilities, Potencies, Durations, Conditions
   - Parsed on-demand using `CSVToArray()` regex parser in [scripts.js](scripts.js)

2. **Application Logic** ([scripts.js](scripts.js))
   - `readDatabase()`: Lazy-loads CSV into `weaponDatabase` array (lines 173-243)
   - Each weapon stored as array of `{name, value}` objects for 35+ properties
   - Filter functions (`filter*()`) handle UI interactions for element/effect/buff searches
   - `printWeapon*()` family of functions transforms filtered data into table structures
   - `tableCreate()`: Generates HTML tables with DataTables.js integration (lines 20-99)

3. **Presentation Layer** ([index.html](index.html))
   - Single dropdown menu with 20+ filter options (elements, buffs/debuffs, materia sigils, status effects)
   - Dynamic content rendering into `#Output` div
   - External dependencies: jQuery 3.7.1, DataTables 2.1.8

4. **Styling** ([styles.css](styles.css))
   - Different table classes for different filter types: `elemTable`, `materiaTable`, `statusTable`, `uniqueTable`, `effectTable`
   - Responsive width handling for various column configurations

### Data Flow

```
User clicks filter → filter*() function → readDatabase() (if first use)
→ Loop through weaponDatabase → findWeaponWithProperty() checks criteria
→ Build 2D array with selected columns → tableCreate() renders HTML table
→ DataTables initialization for sorting
```

## Development Workflow

### Running Locally

```bash
# Start a local HTTP server (CSV loading requires HTTP, not file://)
python -m http.server
# or
python3 -m http.server 8000

# Then open http://localhost:8000 in browser
```

**Note**: The application MUST be served via HTTP server. Opening `index.html` directly in a browser will fail due to XMLHttpRequest CORS restrictions when loading `weaponData.csv`.

### Testing

This project now includes a comprehensive Jest test suite with 130+ passing tests.

#### Quick Start
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Test Structure
```
tests/
├── setup.js              # Global mocks (DataTables, jQuery, console)
├── test-helpers.js       # 13 utility functions for tests
├── fixtures/
│   ├── minimal-weapons.csv      # 10 test weapons
│   └── mock-weapon-data.js      # Mock data generators
└── unit/
    ├── array-utilities.test.js  # 24 tests ✅
    ├── filter-logic.test.js     # 43 tests ✅
    ├── sorting.test.js          # 26 tests ✅
    ├── calculations.test.js     # 37 tests ✅
    └── csv-parser.test.js       # 50+ tests (disabled - V8 memory issue)
```

#### Test Coverage
- **130 tests passing** in < 1 second
- **Pure functions**: 95%+ coverage (array utilities, filters, sorting, calculations)
- **Integration tests**: Planned for Phase 4-6 (see [TEST-IMPLEMENTATION-SUMMARY.md](TEST-IMPLEMENTATION-SUMMARY.md))

#### Manual Testing
For UI/integration testing:
1. Start local server
2. Open browser DevTools Console
3. Test each filter category from the dropdown
4. Verify table rendering, sorting, and DataTables functionality
5. Check for console errors during CSV parsing

See [tests/README.md](tests/README.md) for complete testing documentation.

## Key Implementation Details

### CSV Parsing

- `CSVToArray()` (lines 949-1030): Custom regex-based parser handling quoted fields with embedded commas/newlines
- Skips 1 header row (`WEAP_NUM_SKIP_LINE = 1`)
- Each row maps to 35+ named properties in `weapData` object

### Filter Architecture

All filter functions follow this pattern:
1. Toggle dropdown visibility
2. Call specialized `printWeapon*()` function with search criteria
3. Functions handle multiple related searches (e.g., `filterFire()` shows Fire attacks, Fire resist debuffs, Fire enchant buffs, Fire materia slots)

### Table Generation

- Column count constants: `ELEM_TABL_COL = 9`, `STATUS_TABL_COL = 9`, `MATERIA_TABL_COL = 8`, `UNIQUE_TABL_COL = 12`
- `sortTable()` (lines 101-172): Custom sorting logic for numeric vs. text columns
- **Note**: DataTables.js provides primary sorting; `sortTable()` is legacy code that may be unused

### Special Cases in Code

- **Hardcoded weapon exceptions** (lines 517-520, 675-678, 594-597): `Bahamut Greatsword`, `Sabin's Claws`, `Blade of the Worthy`, `Umbral Blade` have special condition handling
- **Regen calculations** (lines 798-801): `(duration / 3) * 15% + initial_pot`
- **Healing threshold** (line 636): Weapons below 25% healing potency are filtered out

## Common Tasks

### Adding New Weapons

1. Edit [weaponData.csv](weaponData.csv) directly
2. Maintain exact column structure (50+ columns)
3. Commit with message: `Update weaponData.csv`
4. No code changes needed unless new weapon types require new filter categories

### Adding New Filter Categories

1. Add `<a onclick="filterNewCategory()">Label</a>` to dropdown in [index.html](index.html)
2. Implement `filterNewCategory()` in [scripts.js](scripts.js)
3. Call appropriate `printWeapon*()` function or create new one
4. Add CSS rules in [styles.css](styles.css) if new table structure needed

### Modifying Table Display

- Change column sets in `printWeapon*()` functions (array initialization at start of function)
- Adjust CSS width rules for new table classes
- Update `tableCreate()` if new table type classification needed

## Code Quality Notes

The codebase includes a comment at line 3: `/* Trash code - Need to clean up and add comments and stuff*/`

Known technical debt:
- Global state (`weaponDatabase` array)
- Repetitive filter functions (line 310 comment acknowledges this)
- Mix of custom sorting and DataTables sorting
- No error handling for CSV parse failures
- Legacy `sortTable()` function possibly unused
- No input validation or sanitization

When making changes, prioritize:
1. **Consistency** with existing patterns over refactoring
2. **Data integrity** - CSV structure is fragile
3. **Filter parity** - users expect all filters to work similarly

## External Dependencies

- **jQuery 3.7.1**: Required for DataTables
- **DataTables 2.1.8**: Provides table sorting, no pagination (`paging: false`)
- Both loaded from CDN in [index.html](index.html)

## Project Maintenance

- **Primary data updates**: [weaponData.csv](weaponData.csv) (based on git history)
- **Feature additions**: Rare, mostly maintenance mode
- **Contributors**: Original author + GUI contributor (gianglt0227) + database maintainer (Nilu/cia) + bug fixes (Cantiga)

## Testing Infrastructure

### Files Added
- [package.json](package.json) - npm configuration with Jest scripts
- [jest.config.js](jest.config.js) - Jest configuration (jsdom, coverage thresholds)
- [tests/setup.js](tests/setup.js) - Global mocks and test environment
- [tests/test-helpers.js](tests/test-helpers.js) - Reusable test utilities
- [tests/fixtures/](tests/fixtures/) - Test data and mock generators
- [tests/unit/](tests/unit/) - 5 test suites covering core functions

### Documentation
- [tests/README.md](tests/README.md) - Complete testing guide
- [TEST-IMPLEMENTATION-SUMMARY.md](TEST-IMPLEMENTATION-SUMMARY.md) - Implementation status and progress
- [TEST-FIXES-SUMMARY.md](TEST-FIXES-SUMMARY.md) - Issues encountered and fixes applied

### Running Tests
See **Testing** section above for commands and workflow.

### Known Issues
- CSV parser tests temporarily disabled due to V8 memory allocation error when evaluating regex in test environment
- Function works correctly in production/browser environment
- Issue isolated to test execution only
