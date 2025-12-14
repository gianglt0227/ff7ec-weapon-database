/**
 * Unit Tests for Sorting Functions
 *
 * Purpose: Test elementalCompare comparator function
 * Dependencies: scripts.js
 */

const fs = require('fs');
const path = require('path');
const scriptPath = path.join(__dirname, '../../js/scripts.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Setup DOM before evaluating scripts.js
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

eval(scriptContent);

describe('Sorting - elementalCompare', () => {

  // Note: MAX_POT_INDEX is defined in scripts.js as 6
  const MAX_POT_INDEX = 6;

  describe('Basic Comparison', () => {
    test('should return -1 when first item has higher potency (descending)', () => {
      const a = new Array(10);
      const b = new Array(10);
      a[MAX_POT_INDEX] = '1000';
      b[MAX_POT_INDEX] = '500';

      const result = elementalCompare(a, b);

      expect(result).toBe(-1);
    });

    test('should return 1 when first item has lower potency', () => {
      const a = new Array(10);
      const b = new Array(10);
      a[MAX_POT_INDEX] = '500';
      b[MAX_POT_INDEX] = '1000';

      const result = elementalCompare(a, b);

      expect(result).toBe(1);
    });

    test('should return 0 when items have equal potency', () => {
      const a = new Array(10);
      const b = new Array(10);
      a[MAX_POT_INDEX] = '750';
      b[MAX_POT_INDEX] = '750';

      const result = elementalCompare(a, b);

      expect(result).toBe(0);
    });
  });

  describe('Numeric Values', () => {
    test('should handle integer values', () => {
      const a = ['', '', '', '', '', '', '100'];
      const b = ['', '', '', '', '', '', '50'];

      expect(elementalCompare(a, b)).toBe(-1);
      expect(elementalCompare(b, a)).toBe(1);
    });

    test('should handle decimal values', () => {
      const a = ['', '', '', '', '', '', '99.5'];
      const b = ['', '', '', '', '', '', '99.4'];

      expect(elementalCompare(a, b)).toBe(-1);
    });

    test('should handle zero values', () => {
      const a = ['', '', '', '', '', '', '0'];
      const b = ['', '', '', '', '', '', '100'];

      expect(elementalCompare(a, b)).toBe(1);
      expect(elementalCompare(b, a)).toBe(-1);
    });

    test('should handle negative values', () => {
      const a = ['', '', '', '', '', '', '-50'];
      const b = ['', '', '', '', '', '', '50'];

      expect(elementalCompare(a, b)).toBe(1);
    });

    test('should handle large numbers', () => {
      const a = ['', '', '', '', '', '', '9999'];
      const b = ['', '', '', '', '', '', '1'];

      expect(elementalCompare(a, b)).toBe(-1);
    });
  });

  describe('String to Number Conversion', () => {
    test('should parse string numbers correctly', () => {
      const a = ['', '', '', '', '', '', '540'];
      const b = ['', '', '', '', '', '', '75'];

      expect(elementalCompare(a, b)).toBe(-1);
    });

    test('should handle leading zeros', () => {
      const a = ['', '', '', '', '', '', '0100'];
      const b = ['', '', '', '', '', '', '50'];

      expect(elementalCompare(a, b)).toBe(-1);
    });

    test('should handle whitespace in numbers', () => {
      const a = ['', '', '', '', '', '', ' 100'];
      const b = ['', '', '', '', '', '', '50 '];

      expect(elementalCompare(a, b)).toBe(-1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty strings (NaN comparison)', () => {
      const a = ['', '', '', '', '', '', ''];
      const b = ['', '', '', '', '', '', '100'];

      const result = elementalCompare(a, b);

      // parseFloat('') returns NaN, NaN comparisons return false
      expect(typeof result).toBe('number');
    });

    test('should handle undefined values', () => {
      const a = ['', '', '', '', '', ''];
      const b = ['', '', '', '', '', '', '100'];

      const result = elementalCompare(a, b);

      expect(typeof result).toBe('number');
    });

    test('should handle equal zero values', () => {
      const a = ['', '', '', '', '', '', '0'];
      const b = ['', '', '', '', '', '', '0'];

      expect(elementalCompare(a, b)).toBe(0);
    });

    test('should handle very small differences', () => {
      const a = ['', '', '', '', '', '', '100.001'];
      const b = ['', '', '', '', '', '', '100.000'];

      expect(elementalCompare(a, b)).toBe(-1);
    });
  });

  describe('Sorting Array Behavior', () => {
    test('should sort array in descending order of potency', () => {
      const weapons = [
        ['W1', '', '', '', '', '', '300'],
        ['W2', '', '', '', '', '', '800'],
        ['W3', '', '', '', '', '', '500'],
        ['W4', '', '', '', '', '', '1000'],
        ['W5', '', '', '', '', '', '100']
      ];

      weapons.sort(elementalCompare);

      expect(weapons[0][MAX_POT_INDEX]).toBe('1000');
      expect(weapons[1][MAX_POT_INDEX]).toBe('800');
      expect(weapons[2][MAX_POT_INDEX]).toBe('500');
      expect(weapons[3][MAX_POT_INDEX]).toBe('300');
      expect(weapons[4][MAX_POT_INDEX]).toBe('100');
    });

    test('should maintain order for equal values', () => {
      const weapons = [
        ['W1', '', '', '', '', '', '500'],
        ['W2', '', '', '', '', '', '500'],
        ['W3', '', '', '', '', '', '500']
      ];

      weapons.sort(elementalCompare);

      // Equal values should maintain relative order (stable sort)
      expect(weapons[0][0]).toBe('W1');
      expect(weapons[1][0]).toBe('W2');
      expect(weapons[2][0]).toBe('W3');
    });

    test('should handle realistic weapon potency values', () => {
      const weapons = [
        ['Guard Stick', 'Aerith', '', '', '', '', '15'],
        ['Silver Staff', 'Aerith', '', '', '', '', '540'],
        ['Fairy Tale', 'Aerith', '', '', '', '', '74'],
        ['Wizard Staff', 'Aerith', '', '', '', '', '540'],
        ['Mythril Rod', 'Aerith', '', '', '', '', '9']
      ];

      weapons.sort(elementalCompare);

      expect(weapons[0][MAX_POT_INDEX]).toBe('540'); // Silver Staff or Wizard Staff
      expect(weapons[1][MAX_POT_INDEX]).toBe('540');
      expect(weapons[2][MAX_POT_INDEX]).toBe('74');
      expect(weapons[3][MAX_POT_INDEX]).toBe('15');
      expect(weapons[4][MAX_POT_INDEX]).toBe('9');
    });
  });

  describe('Special Weapon Potencies', () => {
    test('should handle Bahamut Greatsword (conditional potency)', () => {
      const weapons = [
        ['Regular Sword', '', '', '', '', '', '540'],
        ['Bahamut Greatsword', '', '', '', '', '', '1200']
      ];

      weapons.sort(elementalCompare);

      expect(weapons[0][0]).toBe('Bahamut Greatsword');
      expect(weapons[1][0]).toBe('Regular Sword');
    });

    test('should sort limited weapons correctly', () => {
      const weapons = [
        ['Limited A', '', '', '', '', '', '1000'],
        ['Limited B', '', '', '', '', '', '1200'],
        ['Regular', '', '', '', '', '', '540'],
        ['Limited C', '', '', '', '', '', '800']
      ];

      weapons.sort(elementalCompare);

      expect(weapons[0][MAX_POT_INDEX]).toBe('1200');
      expect(weapons[1][MAX_POT_INDEX]).toBe('1000');
      expect(weapons[2][MAX_POT_INDEX]).toBe('800');
      expect(weapons[3][MAX_POT_INDEX]).toBe('540');
    });

    test('should handle healing potency values', () => {
      const weapons = [
        ['Low Heal', '', '', '', '', '', '15'],
        ['Mid Heal', '', '', '', '', '', '74'],
        ['High Heal', '', '', '', '', '', '13']
      ];

      weapons.sort(elementalCompare);

      expect(weapons[0][MAX_POT_INDEX]).toBe('74');
      expect(weapons[1][MAX_POT_INDEX]).toBe('15');
      expect(weapons[2][MAX_POT_INDEX]).toBe('13');
    });
  });

  describe('Performance', () => {
    test('should sort large arrays efficiently', () => {
      // Create array of 500 weapons (similar to actual database size)
      const weapons = Array.from({ length: 500 }, (_, i) => {
        const potency = Math.floor(Math.random() * 2000);
        return ['Weapon' + i, '', '', '', '', '', String(potency)];
      });

      const startTime = Date.now();
      weapons.sort(elementalCompare);
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(100);

      // Verify actually sorted
      for (let i = 1; i < weapons.length; i++) {
        const current = parseFloat(weapons[i][MAX_POT_INDEX]);
        const previous = parseFloat(weapons[i - 1][MAX_POT_INDEX]);
        expect(current).toBeLessThanOrEqual(previous);
      }
    });
  });

  describe('Integration with Table Display', () => {
    test('should sort % per ATB correctly', () => {
      // Test scenario where weapons have different ATB costs
      // In actual code, % per ATB is calculated as: maxPot / atb
      const weapons = [
        ['4 ATB Weapon', '', '', '', '', '', '540'], // 135 per ATB
        ['5 ATB Weapon', '', '', '', '', '', '800'], // 160 per ATB
        ['3 ATB Weapon', '', '', '', '', '', '300']  // 100 per ATB
      ];

      weapons.sort(elementalCompare);

      // Sorted by max potency (descending)
      expect(weapons[0][MAX_POT_INDEX]).toBe('800');
      expect(weapons[1][MAX_POT_INDEX]).toBe('540');
      expect(weapons[2][MAX_POT_INDEX]).toBe('300');
    });
  });
});
