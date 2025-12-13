/**
 * Global Test Setup
 * Runs before all tests to configure the testing environment
 */

// Mock global DataTable function (from DataTables.js library)
global.DataTable = jest.fn(function(selector, options) {
  // Mock DataTable instance
  return {
    selector: selector,
    options: options || {},
    // Mock methods that might be called
    on: jest.fn(),
    off: jest.fn(),
    destroy: jest.fn(),
    clear: jest.fn(),
    draw: jest.fn()
  };
});

// Mock jQuery (minimal implementation for DataTables dependency)
global.$ = jest.fn((selector) => {
  return {
    DataTable: global.DataTable,
    length: 1,
    // Add other jQuery methods if needed
    on: jest.fn(),
    off: jest.fn(),
    html: jest.fn(),
    text: jest.fn()
  };
});

// Also expose as jQuery
global.jQuery = global.$;

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for actual errors
  error: console.error
};

// Add global test utilities
global.testUtils = {
  // Helper to wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  // Helper to get clean DOM state
  getCleanDOM: () => {
    document.body.innerHTML = `
      <div id="ecDropdown" class="dropdown-content"></div>
      <div id="Output" class="output"></div>
    `;
  }
};

// Run before each test file
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
});
