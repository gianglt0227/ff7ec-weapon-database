/**
 * Unit Tests for CSVToArray Function
 *
 * Purpose: Test CSV parsing logic with various input scenarios
 * Dependencies: scripts.js (CSVToArray function)
 */

// Load the script to test
const fs = require('fs');
const path = require('path');

const {
  mockCSVString,
  mockCSVMalformed,
  mockCSVQuoted,
  mockCSVEscaped
} = require('../fixtures/mock-weapon-data');

// Setup DOM before loading scripts.js
document.body.innerHTML = `
  <div id="ecDropdown" class="dropdown-content"></div>
  <div id="Output" class="output"></div>
`;

// Load and evaluate scripts.js - do this at module level
const scriptPath = path.join(__dirname, '../../scripts.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
eval(scriptContent);

describe('CSVToArray', () => {

  describe('Basic CSV Parsing', () => {
    test('should parse simple CSV with single row', () => {
      const input = 'Name,Age,City\nJohn,30,NYC';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(['Name', 'Age', 'City']);
      expect(result[1]).toEqual(['John', '30', 'NYC']);
    });

    test('should parse CSV with multiple rows', () => {
      const input = 'A,B,C\n1,2,3\n4,5,6\n7,8,9';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(4);
      expect(result[1]).toEqual(['1', '2', '3']);
      expect(result[2]).toEqual(['4', '5', '6']);
      expect(result[3]).toEqual(['7', '8', '9']);
    });

    test('should handle empty fields', () => {
      const input = 'A,B,C\n1,,3\n,5,\n,,';
      const result = CSVToArray(input, ',');

      expect(result[1]).toEqual(['1', '', '3']);
      expect(result[2]).toEqual(['', '5', '']);
      expect(result[3]).toEqual(['', '', '']);
    });

    test('should use comma as default delimiter', () => {
      const input = 'A,B,C\n1,2,3';
      const result = CSVToArray(input);

      expect(result[0]).toEqual(['A', 'B', 'C']);
      expect(result[1]).toEqual(['1', '2', '3']);
    });
  });

  describe('Quoted Fields', () => {
    test('should handle fields with quotes containing commas', () => {
      const input = 'Name,Description\n"Test Sword","A sword, sharp and deadly"';
      const result = CSVToArray(input, ',');

      expect(result[1][0]).toBe('Test Sword');
      expect(result[1][1]).toBe('A sword, sharp and deadly');
    });

    test('should handle escaped quotes within quoted fields', () => {
      const input = 'Name,Quote\n"Test","He said ""hello"""';
      const result = CSVToArray(input, ',');

      expect(result[1][0]).toBe('Test');
      expect(result[1][1]).toBe('He said "hello"');
    });

    test('should handle multiple escaped quotes', () => {
      const input = 'A,B\n"Test ""Special"" Item","Value ""1"""';
      const result = CSVToArray(input, ',');

      expect(result[1][0]).toBe('Test "Special" Item');
      expect(result[1][1]).toBe('Value "1"');
    });

    test('should handle empty quoted fields', () => {
      const input = 'A,B,C\n"",value,""';
      const result = CSVToArray(input, ',');

      expect(result[1]).toEqual(['', 'value', '']);
    });
  });

  describe('Line Endings', () => {
    test('should handle CRLF line endings', () => {
      const input = 'A,B\r\n1,2\r\n3,4';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(3);
      expect(result[1]).toEqual(['1', '2']);
      expect(result[2]).toEqual(['3', '4']);
    });

    test('should handle LF line endings', () => {
      const input = 'A,B\n1,2\n3,4';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(3);
      expect(result[1]).toEqual(['1', '2']);
    });

    test('should handle CR line endings', () => {
      const input = 'A,B\r1,2\r3,4';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(3);
      expect(result[1]).toEqual(['1', '2']);
    });

    test('should handle mixed line endings', () => {
      const input = 'A,B\r\n1,2\n3,4\r5,6';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(4);
      expect(result[1]).toEqual(['1', '2']);
      expect(result[2]).toEqual(['3', '4']);
      expect(result[3]).toEqual(['5', '6']);
    });
  });

  describe('Different Delimiters', () => {
    test('should handle semicolon delimiter', () => {
      const input = 'A;B;C\n1;2;3';
      const result = CSVToArray(input, ';');

      expect(result[0]).toEqual(['A', 'B', 'C']);
      expect(result[1]).toEqual(['1', '2', '3']);
    });

    test('should handle tab delimiter', () => {
      const input = 'A\tB\tC\n1\t2\t3';
      const result = CSVToArray(input, '\t');

      expect(result[0]).toEqual(['A', 'B', 'C']);
      expect(result[1]).toEqual(['1', '2', '3']);
    });

    test('should handle pipe delimiter', () => {
      const input = 'A|B|C\n1|2|3';
      const result = CSVToArray(input, '|');

      expect(result[0]).toEqual(['A', 'B', 'C']);
      expect(result[1]).toEqual(['1', '2', '3']);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string input', () => {
      const result = CSVToArray('', ',');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(['']);
    });

    test('should handle single cell', () => {
      const input = 'Value';
      const result = CSVToArray(input, ',');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(['Value']);
    });

    test('should handle trailing newline', () => {
      const input = 'A,B\n1,2\n';
      const result = CSVToArray(input, ',');

      // Should not create empty row for trailing newline
      expect(result).toHaveLength(3);
      expect(result[2]).toEqual(['']);
    });

    test('should handle only delimiters', () => {
      const input = ',,,\n,,,';
      const result = CSVToArray(input, ',');

      expect(result[0]).toEqual(['', '', '', '']);
      expect(result[1]).toEqual(['', '', '', '']);
    });

    test('should handle very long lines', () => {
      const longValue = 'x'.repeat(10000);
      const input = `A,B\n${longValue},value`;
      const result = CSVToArray(input, ',');

      expect(result[1][0]).toBe(longValue);
      expect(result[1][1]).toBe('value');
    });
  });

  describe('Weapon Data CSV', () => {
    test('should parse actual weapon CSV format', () => {
      const result = CSVToArray(mockCSVString, ',');

      expect(result).toHaveLength(3); // Header + 2 weapons
      expect(result[0][0]).toBe('Name');
      expect(result[1][0]).toBe('Test Sword');
      expect(result[2][0]).toBe('Test Staff');
    });

    test('should handle weapon data with empty fields', () => {
      const input = 'Name,Char Name,Sigil,ATB\nTest Sword,Cloud,,4';
      const result = CSVToArray(input, ',');

      expect(result[1]).toEqual(['Test Sword', 'Cloud', '', '4']);
    });

    test('should parse weapons with special characters', () => {
      const input = 'Name,Description\n"Tifa\'s Gloves","A fist weapon, very powerful"';
      const result = CSVToArray(input, ',');

      expect(result[1][0]).toBe("Tifa's Gloves");
      expect(result[1][1]).toBe('A fist weapon, very powerful');
    });

    test('should handle weapon data with 50+ columns', () => {
      const result = CSVToArray(mockCSVString, ',');
      const headerCount = result[0].length;

      // Weapon CSV has 50+ columns
      expect(headerCount).toBeGreaterThan(40);
      expect(result[1].length).toBe(headerCount);
      expect(result[2].length).toBe(headerCount);
    });
  });

  describe('Error Tolerance', () => {
    test('should handle unclosed quotes gracefully', () => {
      const input = 'A,B\n"unclosed,value';
      const result = CSVToArray(input, ',');

      // Should still return a result
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    test('should handle special characters in unquoted fields', () => {
      const input = 'A,B\nvalue-with-dash,value_with_underscore';
      const result = CSVToArray(input, ',');

      expect(result[1][0]).toBe('value-with-dash');
      expect(result[1][1]).toBe('value_with_underscore');
    });

    test('should handle unicode characters', () => {
      const input = 'Name,Sigil\nTest,◯\nWeapon,△';
      const result = CSVToArray(input, ',');

      expect(result[1][1]).toBe('◯');
      expect(result[2][1]).toBe('△');
    });
  });

  describe('Performance', () => {
    test('should handle large CSV files efficiently', () => {
      // Create a CSV with 500 rows (similar to actual weapon database)
      const header = 'A,B,C,D,E';
      const rows = Array.from({ length: 500 }, (_, i) =>
        `${i},value${i},data${i},test${i},field${i}`
      );
      const input = [header, ...rows].join('\n');

      const startTime = Date.now();
      const result = CSVToArray(input, ',');
      const endTime = Date.now();

      expect(result).toHaveLength(501);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete in < 1 second
    });
  });
});
