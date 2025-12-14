/**
 * Unit Tests for Table Renderer Module
 *
 * Purpose: Test modern table generation with Tailwind CSS
 * Dependencies: js/table-renderer.js, js/character-filter.js
 */

const fs = require('fs');
const path = require('path');
const tableRendererPath = path.join(__dirname, '../../js/table-renderer.js');
const characterFilterPath = path.join(__dirname, '../../js/character-filter.js');
const tableRendererContent = fs.readFileSync(tableRendererPath, 'utf8');
const characterFilterContent = fs.readFileSync(characterFilterPath, 'utf8');

// Mock sortTable function from scripts.js
global.sortTable = jest.fn();

describe.skip('Table Renderer Module', () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <div id="Output"></div>
      <div id="characterFilterContainer" class="hidden">
        <div id="characterFilterButtons"></div>
      </div>
    `;

        global.weaponDatabase = [];

        // Use indirect eval to execute in global scope
        (1, eval)(characterFilterContent);
        (1, eval)(tableRendererContent);

        // Make functions globally accessible
        global.tableCreate = tableCreate;
        global.populateCharacterFilter = populateCharacterFilter;
        global.applyCharacterFilter = applyCharacterFilter;
    });

    describe('tableCreate', () => {
        test('should create table with header', () => {
            const data = [
                ['Name', 'Character', 'Element'],
                ['Buster Sword', 'Cloud', 'Fire']
            ];

            tableCreate(2, 3, data, 'Fire Weapons');

            const header = document.querySelector('h2');
            expect(header).toBeTruthy();
            expect(header.textContent).toContain('Fire Weapons');
        });

        test('should create table with Tailwind classes', () => {
            const data = [
                ['Name', 'Character'],
                ['Buster Sword', 'Cloud']
            ];

            tableCreate(2, 2, data, 'Test Table');

            const table = document.querySelector('table');
            expect(table.className).toContain('min-w-full');
            expect(table.className).toContain('divide-y');
        });

        test('should add data-character attribute to rows', () => {
            const data = [
                ['Name', 'Character'],
                ['Buster Sword', 'Cloud'],
                ['Premium Heart', 'Tifa']
            ];

            tableCreate(3, 2, data, 'Test');

            const rows = document.querySelectorAll('tbody tr');
            expect(rows[0].dataset.character).toBe('Cloud');
            expect(rows[1].dataset.character).toBe('Tifa');
        });

        test('should create header row with sort functionality', () => {
            const data = [
                ['Name', 'Character'],
                ['Buster Sword', 'Cloud']
            ];

            tableCreate(2, 2, data, 'Test');

            const headerCells = document.querySelectorAll('th');
            expect(headerCells.length).toBe(2);

            headerCells[0].click();
            expect(global.sortTable).toHaveBeenCalled();
        });

        test('should format numeric columns with font-mono class', () => {
            const data = [
                ['Name', 'HP'],
                ['Weapon', '1000']
            ];

            tableCreate(2, 2, data, 'Test');

            const cells = document.querySelectorAll('td');
            const hpCell = Array.from(cells).find(c => c.textContent === '1000');
            expect(hpCell.className).toContain('font-mono');
        });

        test('should call populateCharacterFilter', () => {
            const spy = jest.spyOn(global, 'populateCharacterFilter');

            const data = [
                ['Name', 'Character'],
                ['Weapon', 'Cloud']
            ];

            tableCreate(2, 2, data, 'Test');

            expect(spy).toHaveBeenCalledWith(data);
            spy.mockRestore();
        });

        test('should initialize DataTable', () => {
            const data = [
                ['Name', 'Character'],
                ['Weapon', 'Cloud']
            ];

            tableCreate(2, 2, data, 'Test');

            expect(global.DataTable).toHaveBeenCalled();
            const call = global.DataTable.mock.calls[0];
            expect(call[1].paging).toBe(false);
            expect(call[1].searching).toBe(true);
        });

        test('should apply character filter after table creation', () => {
            const spy = jest.spyOn(global, 'applyCharacterFilter');

            const data = [
                ['Name', 'Character'],
                ['Weapon', 'Cloud']
            ];

            tableCreate(2, 2, data, 'Test');

            expect(spy).toHaveBeenCalled();
            spy.mockRestore();
        });
    });
});
