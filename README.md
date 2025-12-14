# FF7EC Weapon Database

A comprehensive, interactive weapon database for **Final Fantasy VII Ever Crisis** featuring 434+ weapons with advanced filtering, sorting, and search capabilities.

## Features

- 🎨 **Modern UI** - Clean, responsive Tailwind CSS design with dark mode
- 🗡️ **434+ Weapons** - Complete database with all weapon stats and abilities
- 🔍 **Advanced Filtering** - Filter by element, effects, buffs/debuffs, materia slots, sigils, and more
- 📊 **Interactive Tables** - Sortable columns with DataTables integration
- 🎮 **Game-Accurate Data** - Includes potencies, durations, conditions, and special effects
- ⚡ **Fast Search** - Instant filtering across 50+ weapon properties

## Quick Start

### Running the Application

```bash
# Start a local HTTP server
python -m http.server 8000
# or
python3 -m http.server 8000

# Open in browser
# Open in browser
# http://localhost:8000/ (Modern UI)
# http://localhost:8000/index-legacy.html (Legacy UI)
```

**Note**: Must be served via HTTP server (not `file://`) due to CSV loading requirements.

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests (130 tests pass in < 1 second)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```
ff7ec-weapon-database/
├── index.html              # Main application (Tailwind + Tailwind CLI)
├── index-legacy.html       # Legacy application
├── js/
│   ├── scripts.js          # Core application logic (1,030 lines)
│   ├── character-filter.js # Character filter state and UI
│   ├── table-renderer.js   # Modern table generation with Tailwind
│   ├── ui-dropdown.js      # Dropdown toggle logic
│   └── last-update.js      # Last update date display
├── css/
│   └── styles.css          # Legacy table layouts
├── src/
│   └── input.css           # Tailwind CSS source
├── dist/
│   └── output.css          # Compiled Tailwind CSS (30KB)
├── weaponData.csv          # Complete weapon database (434+ weapons)
├── tailwind.config.js      # Tailwind configuration
├── package.json            # npm configuration with test and build scripts
├── jest.config.js          # Jest test configuration
├── tests/
│   ├── setup.js           # Test environment setup
│   ├── test-helpers.js    # Test utility functions
│   ├── fixtures/          # Test data and mocks
│   └── unit/              # Unit tests (150 tests total, 130 passing)
│       ├── array-utilities.test.js
│       ├── filter-logic.test.js
│       ├── sorting.test.js
│       ├── calculations.test.js
│       ├── csv-parser.test.js
│       ├── character-filter.test.js (skipped)
│       └── table-renderer.test.js (skipped)
├── CLAUDE.md              # Claude Code documentation
├── AGENTS.md              # AI agents documentation
└── README.md              # This file
```

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES5), HTML5
- **Styling**: Tailwind CSS (via Tailwind CLI, production build), Google Fonts (Cinzel, Inter)
- **Build**: Tailwind CLI for CSS compilation
- **Dependencies**: jQuery 3.7.1, DataTables 2.1.8
- **Testing**: Jest 29.7.0, jsdom
- **Data Format**: CSV (50+ columns per weapon)

## Development

### Architecture

The application uses a simple three-layer architecture:

1. **Data Layer** - CSV file loaded via XMLHttpRequest
2. **Logic Layer** - Filtering, sorting, and table generation in `scripts.js`
3. **Presentation Layer** - Dynamic HTML table rendering with DataTables

See [CLAUDE.md](CLAUDE.md) for detailed architecture documentation.

### Testing

The project includes a comprehensive Jest test suite:

- **150 tests total** (130 passing, 20 skipped)
- **95%+ coverage** for pure functions
- **< 1 second** execution time
- Full documentation in [tests/README.md](tests/README.md)

Test categories:
- Array utilities (24 tests)
- Filter logic (43 tests)
- Sorting algorithms (26 tests)
- Calculations (37 tests)
- Character filter (12 tests, skipped)
- Table renderer (8 tests, skipped)

> **⚠️ CRITICAL: Testing Requirements for All Code Changes**
>
> Before committing any code changes:
> 1. **ALWAYS run `npm test`** to ensure no existing tests are broken
> 2. **If tests fail**: Review your code logic first before modifying tests
> 3. **For new features**: Write tests to cover the new functionality
> 4. **Test categories**: Unit tests for logic, integration tests for workflows
>
> Skipping tests or modifying them without understanding why they fail can introduce bugs.

## Contributing

### Adding New Weapons

1. Edit `weaponData.csv` with new weapon data
2. Maintain exact 50+ column structure
3. Test with local server
4. Commit with message: `Update weaponData.csv`

### Adding New Features

1. Review [CLAUDE.md](CLAUDE.md) for architecture patterns
2. Add filter functions following existing patterns
3. Write tests for new functionality
4. Update documentation

## Documentation

- [CLAUDE.md](CLAUDE.md) - Complete technical documentation for Claude Code
- [AGENTS.md](AGENTS.md) - Documentation for other AI coding agents
- [tests/README.md](tests/README.md) - Testing guide and best practices
- [TEST-IMPLEMENTATION-SUMMARY.md](TEST-IMPLEMENTATION-SUMMARY.md) - Test implementation status
- [TEST-FIXES-SUMMARY.md](TEST-FIXES-SUMMARY.md) - Known issues and fixes

## Known Issues

- CSV parser tests temporarily disabled in Jest due to V8 memory allocation error
- Function works correctly in production environment
- See [TEST-FIXES-SUMMARY.md](TEST-FIXES-SUMMARY.md) for details

## Credits

- **Original Author**: Database and core functionality
- **GUI Contributor**: gianglt0227
- **Database Maintainer**: Nilu/cia
- **Bug Fixes**: Cantiga
- **Test Infrastructure**: Generated with [Claude Code](https://claude.com/claude-code)

## License

This project is a community resource for Final Fantasy VII Ever Crisis players.
