# Generate Unit and Integration Tests for FF7EC Weapon Database

## Project Context

This is a **Final Fantasy 7 Ever Crisis Weapon Database** - a vanilla JavaScript single-page application that:
- Loads weapon data from a CSV file (434+ weapons)
- Provides interactive filtering via dropdown menu (20+ filter options)
- Dynamically generates sortable tables using DataTables.js
- Has no existing test infrastructure or build system

**Technology Stack:**
- Vanilla JavaScript (ES5 style)
- jQuery 3.7.1
- DataTables 2.1.8
- HTML/CSS
- Must run via HTTP server (uses XMLHttpRequest for CSV loading)

## Your Task

Analyze the codebase and generate **executable** unit tests and integration tests that can be implemented in this project.

---

## Phase 1: Codebase Analysis

### 1.1 Analyze Files

**index.html** - Document:
- All interactive elements (buttons, dropdowns, output containers)
- External dependencies and their versions
- DOM structure relevant to testing

**scripts.js** - Identify and categorize:
- **Pure functions** (can be unit tested in isolation)
- **DOM manipulation functions** (require DOM environment)
- **Data processing functions** (CSV parsing, filtering, sorting)
- **Integration points** (functions that orchestrate multiple operations)
- **Global state** (variables that hold application state)

### 1.2 Create Function Inventory

For each function, document:
```
Function: functionName()
Type: [Pure/DOM/Data Processing/Integration]
Purpose: [Brief description]
Inputs: [Parameter types]
Outputs: [Return type]
Dependencies: [Other functions, globals, libraries]
Side Effects: [DOM changes, global state mutations]
Testability: [Easy/Medium/Hard]
```

---

## Phase 2: Test Infrastructure Recommendations

### 2.1 Propose Testing Setup

Given this is a vanilla JS project with no build system, recommend:

1. **Test Framework Options:**
   - Which testing framework(s) would work best? (Jest, Mocha/Chai, Jasmine, QUnit)
   - Rationale for your recommendation
   - Minimal setup steps

2. **DOM Testing:**
   - How to test DOM manipulation (jsdom, testing-library, manual DOM setup)
   - How to mock DataTables.js behavior

3. **HTTP Server Mocking:**
   - How to mock XMLHttpRequest for CSV loading
   - Test data strategy (fixture CSV files vs. mocked data)

4. **Project Structure:**
   ```
   /tests
     /unit
       - csv-parser.test.js
       - filter-logic.test.js
       - data-processing.test.js
     /integration
       - filter-workflow.test.js
       - table-generation.test.js
     /fixtures
       - sample-weapon-data.csv
   ```

---

## Phase 3: Unit Test Generation

### 3.1 Pure Function Tests

Generate unit tests for **isolated, pure functions**:

**Priority Functions:**
- `CSVToArray(strData, strDelimiter)` - CSV parsing logic
- `findElement(arr, propName, propValue)` - Array search
- `getValueFromDatabaseItem(item, name)` - Data extraction
- `findWeaponWithProperty(arr, propName, propValue)` - Filter matching
- `elementalCompare(a, b)` - Sorting comparator

**For each test, provide:**
```javascript
describe('FunctionName', () => {
  test('should handle normal case', () => {
    // Arrange
    const input = ...;

    // Act
    const result = functionName(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  test('should handle edge case: ...', () => {
    // Test implementation
  });

  test('should handle error case: ...', () => {
    // Test implementation
  });
});
```

**Test Coverage Requirements:**
- ✅ Happy path scenarios
- ✅ Edge cases (empty inputs, null/undefined, boundary values)
- ✅ Error conditions
- ✅ Data type variations

### 3.2 Data Processing Tests

Generate tests for data transformation functions:
- `readDatabase()` - CSV loading and parsing
- `printWeaponElem()` - Elemental weapon filtering
- `printWeaponEffect()` - Effect-based filtering
- `printWeaponMateria()` - Materia slot filtering
- `printRegenWeapon()` - Regen calculation logic

**Special Cases to Test:**
- Hardcoded weapon exceptions (Bahamut Greatsword, Sabin's Claws, etc.)
- Regen calculations: `(duration / 3) * 15% + initial_pot`
- Healing threshold filtering (< 25% potency)
- Zero ATB cost handling
- Conditional damage calculations

---

## Phase 4: Integration Test Generation

### 4.1 User Workflow Tests

Generate integration tests for **end-to-end user interactions**:

**Test Scenarios:**

1. **Complete Filter Workflow**
   ```javascript
   describe('Fire Element Filter Integration', () => {
     test('should display all fire weapons with correct columns', async () => {
       // Setup: Load page, inject test CSV
       // Action: Click "Fire" filter
       // Verify:
       //   - Dropdown closes
       //   - Multiple tables rendered (C-Abilities, Resist Down, Damage Up, Materia)
       //   - Correct weapons displayed
       //   - DataTables initialized
       //   - Sorting works
     });
   });
   ```

2. **Table Generation Pipeline**
   - CSV load → Parse → Filter → Build table array → Render HTML → Initialize DataTables

3. **Sequential Filter Usage**
   - Select filter → Clear output → Select different filter → Verify state clean

### 4.2 DOM Integration Tests

Test functions that interact with the DOM:
- `ecSearch()` - Dropdown toggle
- `tableCreate()` - HTML table generation
- `sortTable()` - Custom sorting behavior

**Mock Requirements:**
```javascript
// Setup DOM environment
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

// Mock DataTables
global.DataTable = jest.fn();

// Mock XMLHttpRequest
global.XMLHttpRequest = MockXMLHttpRequest;
```

---

## Phase 5: Test Data Strategy

### 5.1 Fixture Data

Create minimal CSV fixtures for testing:

**fixture-minimal.csv** (5-10 weapons covering all edge cases):
- Different elements (Fire, Ice, Heal, None)
- Various effect types (buffs, debuffs, status)
- Edge cases (zero ATB, no limits, special weapons)
- Different materia slots and sigils

### 5.2 Mock Data

For unit tests, provide in-memory mock objects:
```javascript
const mockWeaponData = [
  { name: 'name', value: 'Test Sword' },
  { name: 'element', value: 'Fire' },
  // ... complete weapon structure
];
```

---

## Deliverables

Please provide:

### 1. **Test Infrastructure Setup Guide**
- Step-by-step installation instructions
- Configuration files (package.json, jest.config.js, etc.)
- How to run tests: `npm test`, `npm run test:unit`, `npm run test:integration`

### 2. **Complete Unit Test Suite**
- Organized by function category
- Minimum 80% code coverage for testable functions
- Include test data and mocks

### 3. **Complete Integration Test Suite**
- At least one test per filter button (20+ tests)
- Full workflow tests for major user journeys
- DOM and external dependency mocking

### 4. **Test Utilities**
- Helper functions for test setup
- Reusable mocks and fixtures
- Custom matchers if needed

### 5. **Documentation**
```markdown
# Testing Guide

## Running Tests
[Commands and options]

## Test Structure
[Organization explanation]

## Writing New Tests
[Guidelines for future tests]

## Known Limitations
[What cannot be tested and why]

## CI/CD Integration
[How to integrate with GitHub Actions or similar]
```

### 6. **Coverage Report Template**
- Which functions are tested vs. untested
- Rationale for untested code (e.g., legacy code, external dependencies)
- Coverage goals and current status

---

## Constraints & Considerations

### Technical Constraints
- No existing build system (tests must be standalone or propose minimal tooling)
- Global state management (tests must reset state between runs)
- jQuery and DataTables dependencies (must be mocked or run in browser-like environment)
- CSV loading requires HTTP server (mock or use fixtures)

### Code Quality Notes
The codebase has acknowledged technical debt:
- Repetitive filter functions (opportunity for DRY test patterns)
- Mixed sorting implementations (test both to ensure compatibility)
- No error handling (tests should document expected behavior on errors)
- Legacy code paths (document which functions may be unused)

### Testing Priorities
**High Priority** (test first):
1. CSV parsing (`CSVToArray`)
2. Data filtering (`findWeaponWithProperty`)
3. Core filter workflows (Fire, Heal, Buff/Debuff)

**Medium Priority**:
4. Table generation
5. Sorting logic
6. Special calculations (Regen, % per ATB)

**Low Priority**:
7. UI interactions (dropdown toggle)
8. Legacy sorting function
9. Edge case filters

---

## Output Format

For each test file, structure as:

```javascript
/**
 * Unit Tests for [Function/Module Name]
 *
 * Purpose: [What this test file covers]
 * Dependencies: [What needs to be imported/mocked]
 */

// Imports
import { functionName } from './scripts.js';

// Test data
const testData = { ... };

// Test suite
describe('[Module Name]', () => {

  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('functionName()', () => {
    test('should ...', () => {
      // Test implementation
    });
  });
});
```

---

## Success Criteria

Your test suite should:
- ✅ Be **executable** (include all setup needed to run)
- ✅ Be **comprehensive** (cover happy paths, edge cases, errors)
- ✅ Be **maintainable** (well-organized, documented, DRY)
- ✅ Be **practical** (account for project constraints and technical debt)
- ✅ Provide **value** (catch real bugs, enable safe refactoring)
- ✅ Include **documentation** (how to run, extend, and interpret results)

Begin with the codebase analysis and function inventory, then proceed to generate the complete test suite.
