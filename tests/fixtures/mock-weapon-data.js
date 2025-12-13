/**
 * Mock Weapon Data
 * Provides test fixtures for unit and integration tests
 */

/**
 * Mock weapon data in the format used by scripts.js
 */
const mockWeaponData = [
  { name: 'name', value: 'Test Fire Sword' },
  { name: 'charName', value: 'Cloud' },
  { name: 'sigil', value: '' },
  { name: 'atb', value: '4' },
  { name: 'type', value: 'Phys.' },
  { name: 'element', value: 'Fire' },
  { name: 'range', value: 'Single' },
  { name: 'effect1Target', value: 'Enemy' },
  { name: 'effect1', value: '[Debuff] PDEF -' },
  { name: 'effect1Pot', value: '50' },
  { name: 'effect1MaxPot', value: '75' },
  { name: 'effect2Target', value: '' },
  { name: 'effect2', value: '' },
  { name: 'effect2Pot', value: '' },
  { name: 'effect2MaxPot', value: '' },
  { name: 'effect3Target', value: '' },
  { name: 'effect3', value: '' },
  { name: 'effect3Pot', value: '' },
  { name: 'effect3MaxPot', value: '' },
  { name: 'support1', value: 'DMG +10%' },
  { name: 'support2', value: 'DMG +20% (Phys.)' },
  { name: 'support3', value: 'Fire' },
  { name: 'rAbility1', value: 'Boost PATK' },
  { name: 'rAbility2', value: 'Boost Fire Pot.' },
  { name: 'potOb10', value: '540' },
  { name: 'maxPotOb10', value: '540' },
  { name: 'effect1Dur', value: '25' },
  { name: 'effect2Dur', value: '' },
  { name: 'effect3Dur', value: '' },
  { name: 'condition1', value: '' },
  { name: 'condition2', value: '' },
  { name: 'condition3', value: '' },
  { name: 'effect1Range', value: 'Single' },
  { name: 'uses', value: '0' },
  { name: 'gachaType', value: 'N' },
  { name: 'effect2Range', value: '' }
];

/**
 * Mock CSV string (valid format)
 */
const mockCSVString = `Name,Char Name,Sigil,ATB,Type,element,Range,effect1Target,effect1,effect1Pot,effect1MaxPot,effect2Target,effect2,effect2Pot,effect2MaxPot,effect3Target,effect3,effect3Pot,effect3MaxPot,support1,support2,support3,rability1,rability2,potOb10,maxPot,effect1Dur,effect2Dur,effect3Dur,effect1Con,effect2Con,effect3Con,ob0,ob1,ob6,patk1,patk120,matk1,matk120,heal1,heal120,rAbiilty1PtScale,rAbiilty2PtScale,firstR,secondR,UW,effect1Range,uses,id,event,effect2Range,
Test Sword,Cloud,,4,Phys.,Fire,Single,Enemy,[Debuff] PDEF -,50,75,,,,,,,,,DMG +10%,DMG +20% (Phys.),Fire,Boost PATK,Boost Fire Pot.,540,540,25,,,,,,290,350,450,35,246,31,215,44,189,24,9,7,0,N,Single,0,1001,N,,
Test Staff,Aerith,,4,Mag.,Ice,All,Enemy,[Debuff] MDEF -,Mid,High,,,,,,,,,DMG +10%,DMG +20% (Mag.),Ice,Boost MATK,Boost Ice Pot.,540,600,30,,,,,,290,350,450,29,204,37,257,44,191,24,9,5,15,N,All,0,1002,N,,`;

/**
 * Mock CSV with malformed data
 */
const mockCSVMalformed = `Name,Char Name,Element
"Broken Sword,Cloud,Fire
Test Staff,"Aerith,Ice`;

/**
 * Mock CSV with quoted fields containing commas
 */
const mockCSVQuoted = `Name,Description
"Test Sword","A sword, sharp and deadly"
"Test Staff","A staff, magical and powerful"`;

/**
 * Mock CSV with escaped quotes
 */
const mockCSVEscaped = `Name,Description
"Test ""Special"" Sword","A sword with ""quotes"""
"Normal Staff","Regular staff"`;

/**
 * Create a mock weapon with custom properties
 * @param {Object} overrides - Properties to override
 * @returns {Array} Mock weapon data
 */
function createMockWeapon(overrides = {}) {
  const defaults = {
    name: 'Test Weapon',
    charName: 'Cloud',
    sigil: '',
    atb: '4',
    type: 'Phys.',
    element: 'Fire',
    range: 'Single',
    effect1Target: 'Enemy',
    effect1: '',
    effect1Pot: '0',
    effect1MaxPot: '0',
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
    effect1Dur: '',
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

  return Object.entries(merged).map(([key, value]) => ({
    name: key,
    value: String(value)
  }));
}

/**
 * Reset global state for tests
 */
function resetGlobalState() {
  if (typeof weaponDatabase !== 'undefined') {
    weaponDatabase.length = 0;
  }
}

/**
 * Create mock weapon database array
 * @param {Array<Object>} weapons - Array of weapon configs
 * @returns {Array} Array of weapon data arrays
 */
function createMockDatabase(weapons) {
  return weapons.map(weapon => createMockWeapon(weapon));
}

/**
 * Mock special weapons (hardcoded exceptions)
 */
const mockSpecialWeapons = {
  bahamutGreatsword: createMockWeapon({
    name: 'Bahamut Greatsword',
    charName: 'Cloud',
    element: 'None',
    atb: '5',
    potOb10: '800',
    maxPotOb10: '1200',
    condition1: 'Stagger',
    gachaType: 'L'
  }),

  sabinsClaws: createMockWeapon({
    name: "Sabin's Claws",
    charName: 'Tifa',
    element: 'Earth',
    atb: '4',
    potOb10: '540',
    maxPotOb10: '800',
    condition2: 'Combo',
    gachaType: 'L'
  }),

  bladeOfTheWorthy: createMockWeapon({
    name: 'Blade of the Worthy',
    charName: 'Cloud',
    element: 'None',
    atb: '5',
    potOb10: '900',
    maxPotOb10: '1100',
    condition1: 'HP > 50%',
    gachaType: 'L'
  }),

  umbralBlade: createMockWeapon({
    name: 'Umbral Blade',
    charName: 'Sephiroth',
    element: 'None',
    atb: '5',
    potOb10: '850',
    maxPotOb10: '1050',
    condition1: 'Weakness',
    gachaType: 'L'
  })
};

/**
 * Mock weapons for specific test scenarios
 */
const mockTestScenarios = {
  // Healing weapon above threshold (>= 25%)
  healingHigh: createMockWeapon({
    name: 'High Heal Staff',
    element: 'Heal',
    potOb10: '74',
    maxPotOb10: '74'
  }),

  // Healing weapon below threshold (< 25%)
  healingLow: createMockWeapon({
    name: 'Low Heal Staff',
    element: 'Heal',
    potOb10: '15',
    maxPotOb10: '15'
  }),

  // Weapon with regen effect
  regenWeapon: createMockWeapon({
    name: 'Regen Staff',
    element: 'Heal',
    effect1: '[Heal] Regen',
    effect1Dur: '18',
    potOb10: '13',
    maxPotOb10: '13'
  }),

  // Zero ATB weapon
  zeroATB: createMockWeapon({
    name: 'Zero ATB Weapon',
    atb: '0',
    potOb10: '300',
    maxPotOb10: '300',
    uses: '5'
  }),

  // Limited/Crossover weapon
  limited: createMockWeapon({
    name: 'Limited Sword',
    gachaType: 'L',
    potOb10: '800',
    maxPotOb10: '1000'
  }),

  // Event weapon
  event: createMockWeapon({
    name: 'Event Weapon',
    gachaType: 'Y',
    potOb10: '600',
    maxPotOb10: '600'
  })
};

module.exports = {
  mockWeaponData,
  mockCSVString,
  mockCSVMalformed,
  mockCSVQuoted,
  mockCSVEscaped,
  createMockWeapon,
  resetGlobalState,
  createMockDatabase,
  mockSpecialWeapons,
  mockTestScenarios
};
