/**
 * Test Helper Utilities
 * Comprehensive utilities for full test automation
 */

/**
 * Setup DOM environment with required elements
 */
function setupDOM() {
  document.body.innerHTML = `
    <div id="ecDropdown" class="dropdown-content"></div>
    <div id="Output" class="output"></div>
  `;
}

/**
 * Reset DOM to clean state
 */
function resetDOM() {
  document.body.innerHTML = '';
  setupDOM();
}

/**
 * Reset global weapon database
 */
function resetWeaponDatabase() {
  if (typeof weaponDatabase !== 'undefined') {
    weaponDatabase.length = 0;
  }
}

/**
 * Mock XMLHttpRequest for CSV loading
 * @param {string} responseText - The response to return
 * @param {number} status - HTTP status code (default: 200)
 */
function mockXMLHttpRequest(responseText, status = 200) {
  const mockXHR = {
    open: jest.fn(),
    send: jest.fn(),
    status: status,
    responseText: responseText
  };

  global.XMLHttpRequest = jest.fn(() => mockXHR);
  return mockXHR;
}

/**
 * Class-based XMLHttpRequest mock for flexible testing
 */
class MockXMLHttpRequestClass {
  constructor(responseText = '', status = 200) {
    this.responseText = responseText;
    this.status = status;
    this.readyState = 4;
  }

  open() {}
  send() {}
  setRequestHeader() {}
}

/**
 * Extract table data from rendered HTML
 * @param {string} tableId - Optional table ID to target specific table
 * @returns {Array<Array<string>>} 2D array of table cell values
 */
function getTableData(tableId) {
  const selector = tableId ? `#${tableId}` : 'table';
  const table = document.querySelector(selector);

  if (!table) return [];

  const rows = Array.from(table.querySelectorAll('tr'));
  return rows.map(row => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    return cells.map(cell => cell.textContent);
  });
}

/**
 * Verify table structure
 * @param {string} selector - Table selector
 * @returns {Object} Table structure info
 */
function verifyTableStructure(selector = 'table') {
  const table = document.querySelector(selector);

  if (!table) {
    return { exists: false };
  }

  return {
    exists: true,
    className: table.className,
    id: table.id,
    headerCount: table.querySelectorAll('thead th').length,
    bodyRowCount: table.querySelectorAll('tbody tr').length,
    totalCellCount: table.querySelectorAll('td, th').length
  };
}

/**
 * Extract table headers
 * @param {string} selector - Table selector
 * @returns {Array<string>} Array of header text
 */
function extractTableHeaders(selector = 'table') {
  const table = document.querySelector(selector);
  if (!table) return [];

  const headers = Array.from(table.querySelectorAll('thead th'));
  return headers.map(h => h.textContent);
}

/**
 * Count tables in output
 * @returns {number} Number of tables
 */
function countTables() {
  return document.querySelectorAll('#Output table').length;
}

/**
 * Simulate click event
 * @param {string} selector - Element selector
 */
function simulateClick(selector) {
  const element = document.querySelector(selector);
  if (element && element.onclick) {
    element.onclick();
  }
}

/**
 * Wait for async operations
 * @param {number} ms - Milliseconds to wait
 */
function waitForAsync(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create mock weapon data object
 * @param {Object} overrides - Properties to override
 * @returns {Array} Weapon data array
 */
function createMockWeapon(overrides = {}) {
  const defaults = {
    name: 'Test Sword',
    charName: 'Cloud',
    sigil: '',
    atb: 4,
    type: 'Phys.',
    element: 'Fire',
    range: 'Single',
    effect1Target: 'Enemy',
    effect1: '[Debuff] PDEF -',
    effect1Pot: '50',
    effect1MaxPot: '75',
    effect2Target: '',
    effect2: '',
    effect2Pot: '',
    effect2MaxPot: '',
    effect3Target: '',
    effect3: '',
    effect3Pot: '',
    effect3MaxPot: '',
    support1: 'DMG +10%',
    support2: 'DMG +20% (Phys.)',
    support3: 'Fire',
    rAbility1: 'Boost PATK',
    rAbility2: 'Boost Fire Pot.',
    potOb10: '540',
    maxPotOb10: '540',
    effect1Dur: '25',
    effect2Dur: '',
    effect3Dur: '',
    condition1: '',
    condition2: '',
    condition3: '',
    effect1Range: 'Single',
    uses: '0',
    gachaType: 'N',
    effect2Range: ''
  };

  const merged = { ...defaults, ...overrides };

  // Convert to array format used by scripts.js
  return Object.entries(merged).map(([key, value]) => ({
    name: key,
    value: value
  }));
}

/**
 * Reset all global state
 */
function resetGlobalState() {
  resetWeaponDatabase();
  resetDOM();
  jest.clearAllMocks();
}

/**
 * Create mock CSV string
 * @param {Array<Object>} weapons - Array of weapon objects
 * @returns {string} CSV formatted string
 */
function createMockCSV(weapons) {
  const headers = 'Name,Char Name,Sigil,ATB,Type,element,Range,effect1Target,effect1,effect1Pot,effect1MaxPot,effect2Target,effect2,effect2Pot,effect2MaxPot,effect3Target,effect3,effect3Pot,effect3MaxPot,support1,support2,support3,rability1,rability2,potOb10,maxPot,effect1Dur,effect2Dur,effect3Dur,effect1Con,effect2Con,effect3Con,ob0,ob1,ob6,patk1,patk120,matk1,matk120,heal1,heal120,rAbiilty1PtScale,rAbiilty2PtScale,firstR,secondR,UW,effect1Range,uses,id,event,effect2Range,';

  const rows = weapons.map(weapon => {
    // Convert weapon object to CSV row
    return [
      weapon.name || '',
      weapon.charName || '',
      weapon.sigil || '',
      weapon.atb || '',
      weapon.type || '',
      weapon.element || '',
      weapon.range || '',
      weapon.effect1Target || '',
      weapon.effect1 || '',
      weapon.effect1Pot || '',
      weapon.effect1MaxPot || '',
      weapon.effect2Target || '',
      weapon.effect2 || '',
      weapon.effect2Pot || '',
      weapon.effect2MaxPot || '',
      weapon.effect3Target || '',
      weapon.effect3 || '',
      weapon.effect3Pot || '',
      weapon.effect3MaxPot || '',
      weapon.support1 || '',
      weapon.support2 || '',
      weapon.support3 || '',
      weapon.rAbility1 || '',
      weapon.rAbility2 || '',
      weapon.potOb10 || '',
      weapon.maxPotOb10 || '',
      weapon.effect1Dur || '',
      weapon.effect2Dur || '',
      weapon.effect3Dur || '',
      weapon.condition1 || '',
      weapon.condition2 || '',
      weapon.condition3 || '',
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', // ob0-secondR
      weapon.effect1Range || '',
      weapon.uses || '',
      weapon.id || '',
      weapon.gachaType || '',
      weapon.effect2Range || ''
    ].join(',');
  });

  return headers + '\n' + rows.join('\n');
}

module.exports = {
  setupDOM,
  resetDOM,
  resetWeaponDatabase,
  mockXMLHttpRequest,
  MockXMLHttpRequestClass,
  getTableData,
  verifyTableStructure,
  extractTableHeaders,
  countTables,
  simulateClick,
  waitForAsync,
  createMockWeapon,
  resetGlobalState,
  createMockCSV
};
