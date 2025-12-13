/**
 * Unit Tests for Array Utility Functions
 *
 * Purpose: Test findElement and getValueFromDatabaseItem functions
 * Dependencies: scripts.js
 */

const fs = require('fs');
const path = require('path');
const scriptPath = path.join(__dirname, '../../scripts.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Setup DOM before evaluating scripts.js
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

eval(scriptContent);

const {  createMockWeapon } = require('../fixtures/mock-weapon-data');

describe('Array Utility Functions', () => {

  describe('findElement', () => {

    describe('Basic Functionality', () => {
      test('should find element with matching property', () => {
        const arr = [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
          { name: 'Bob', age: 35 }
        ];

        const result = findElement(arr, 'name', 'Jane');

        expect(result).toEqual({ name: 'Jane', age: 25 });
      });

      test('should return first matching element when multiple matches exist', () => {
        const arr = [
          { type: 'sword', power: 10 },
          { type: 'sword', power: 20 },
          { type: 'staff', power: 15 }
        ];

        const result = findElement(arr, 'type', 'sword');

        expect(result).toEqual({ type: 'sword', power: 10 });
      });

      test('should return undefined when no match found', () => {
        const arr = [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 }
        ];

        const result = findElement(arr, 'name', 'Bob');

        expect(result).toBeUndefined();
      });
    });

    describe('Property Value Types', () => {
      test('should match string values', () => {
        const arr = [{ id: '123', name: 'Test' }];
        const result = findElement(arr, 'id', '123');

        expect(result).toEqual({ id: '123', name: 'Test' });
      });

      test('should match number values', () => {
        const arr = [{ id: 1, name: 'Test' }, { id: 2, name: 'Test2' }];
        const result = findElement(arr, 'id', 2);

        expect(result).toEqual({ id: 2, name: 'Test2' });
      });

      test('should match boolean values', () => {
        const arr = [{ active: true }, { active: false }];
        const result = findElement(arr, 'active', false);

        expect(result).toEqual({ active: false });
      });

      test('should match null values', () => {
        const arr = [{ value: null }, { value: 'test' }];
        const result = findElement(arr, 'value', null);

        expect(result).toEqual({ value: null });
      });

      test('should match undefined values', () => {
        const arr = [{ value: undefined }, { value: 'test' }];
        const result = findElement(arr, 'value', undefined);

        expect(result).toEqual({ value: undefined });
      });
    });

    describe('Edge Cases', () => {
      test('should handle empty array', () => {
        const result = findElement([], 'name', 'test');

        expect(result).toBeUndefined();
      });

      test('should handle array with single element', () => {
        const arr = [{ name: 'John' }];
        const result = findElement(arr, 'name', 'John');

        expect(result).toEqual({ name: 'John' });
      });

      test('should handle property that does not exist', () => {
        const arr = [{ name: 'John' }];
        const result = findElement(arr, 'nonexistent', 'value');

        expect(result).toBeUndefined();
      });

      test('should handle empty string property value', () => {
        const arr = [{ name: '' }, { name: 'John' }];
        const result = findElement(arr, 'name', '');

        expect(result).toEqual({ name: '' });
      });

      test('should handle case-sensitive matching', () => {
        const arr = [{ name: 'Test' }];
        const result = findElement(arr, 'name', 'test');

        expect(result).toBeUndefined();
      });
    });

    describe('Weapon Data Format', () => {
      test('should find weapon property in scripts.js format', () => {
        const weaponData = createMockWeapon({ name: 'Test Sword', element: 'Fire' });
        const result = findElement(weaponData, 'name', 'element');

        expect(result).toEqual({ name: 'element', value: 'Fire' });
      });

      test('should work with name/value pair structure', () => {
        const arr = [
          { name: 'prop1', value: 'val1' },
          { name: 'prop2', value: 'val2' },
          { name: 'prop3', value: 'val3' }
        ];

        const result = findElement(arr, 'name', 'prop2');

        expect(result).toEqual({ name: 'prop2', value: 'val2' });
      });
    });
  });

  describe('getValueFromDatabaseItem', () => {

    describe('Basic Functionality', () => {
      test('should extract value from database item', () => {
        const item = createMockWeapon({ name: 'Test Sword', element: 'Fire' });
        const result = getValueFromDatabaseItem(item, 'element');

        expect(result).toBe('Fire');
      });

      test('should return correct value for any valid property', () => {
        const item = createMockWeapon({
          name: 'Test Sword',
          charName: 'Cloud',
          atb: '4',
          type: 'Phys.'
        });

        expect(getValueFromDatabaseItem(item, 'name')).toBe('Test Sword');
        expect(getValueFromDatabaseItem(item, 'charName')).toBe('Cloud');
        expect(getValueFromDatabaseItem(item, 'atb')).toBe('4');
        expect(getValueFromDatabaseItem(item, 'type')).toBe('Phys.');
      });

      test('should handle empty string values', () => {
        const item = createMockWeapon({ effect2: '' });
        const result = getValueFromDatabaseItem(item, 'effect2');

        expect(result).toBe('');
      });
    });

    describe('Edge Cases', () => {
      test('should throw error for nonexistent property', () => {
        const item = createMockWeapon({ name: 'Test' });

        // getValueFromDatabaseItem will crash if findElement returns undefined
        // because it tries to access undefined["value"]
        expect(() => {
          getValueFromDatabaseItem(item, 'nonexistent');
        }).toThrow();
      });

      test('should handle numeric string values', () => {
        const item = createMockWeapon({ atb: '5', potOb10: '540' });

        expect(getValueFromDatabaseItem(item, 'atb')).toBe('5');
        expect(getValueFromDatabaseItem(item, 'potOb10')).toBe('540');
      });

      test('should handle special characters in values', () => {
        const item = createMockWeapon({
          effect1: '[Debuff] PDEF -',
          support3: '◯ Circle Sigil +2'
        });

        expect(getValueFromDatabaseItem(item, 'effect1')).toBe('[Debuff] PDEF -');
        expect(getValueFromDatabaseItem(item, 'support3')).toBe('◯ Circle Sigil +2');
      });
    });

    describe('Weapon Property Access', () => {
      test('should access all standard weapon properties', () => {
        const item = createMockWeapon({
          name: 'Buster Sword',
          charName: 'Cloud',
          sigil: 'Diamond',
          atb: '4',
          type: 'Phys.',
          element: 'Fire',
          range: 'Single',
          effect1Target: 'Enemy',
          effect1: '[Debuff] PDEF -',
          effect1Pot: '50',
          effect1MaxPot: '75',
          support1: 'DMG +10%',
          support2: 'DMG +20% (Phys.)',
          support3: 'Fire',
          rAbility1: 'Boost PATK',
          rAbility2: 'Boost Fire Pot.',
          potOb10: '540',
          maxPotOb10: '540',
          effect1Dur: '25',
          condition1: 'Weakness',
          effect1Range: 'Single',
          uses: '0',
          gachaType: 'N'
        });

        expect(getValueFromDatabaseItem(item, 'name')).toBe('Buster Sword');
        expect(getValueFromDatabaseItem(item, 'charName')).toBe('Cloud');
        expect(getValueFromDatabaseItem(item, 'sigil')).toBe('Diamond');
        expect(getValueFromDatabaseItem(item, 'effect1')).toBe('[Debuff] PDEF -');
        expect(getValueFromDatabaseItem(item, 'gachaType')).toBe('N');
      });

      test('should handle optional/empty weapon properties', () => {
        const item = createMockWeapon({
          name: 'Simple Sword',
          effect2: '',
          effect3: '',
          sigil: ''
        });

        expect(getValueFromDatabaseItem(item, 'effect2')).toBe('');
        expect(getValueFromDatabaseItem(item, 'effect3')).toBe('');
        expect(getValueFromDatabaseItem(item, 'sigil')).toBe('');
      });
    });

    describe('Integration with findElement', () => {
      test('should work together to extract values', () => {
        const item = createMockWeapon({
          name: 'Test Sword',
          element: 'Fire',
          charName: 'Cloud'
        });

        // This is how getValueFromDatabaseItem uses findElement internally
        const elementObj = findElement(item, 'name', 'element');
        expect(elementObj.value).toBe('Fire');

        const charObj = findElement(item, 'name', 'charName');
        expect(charObj.value).toBe('Cloud');
      });
    });
  });
});
