// Table Renderer
// Modern table generation with Tailwind CSS classes

/**
 * MODERNIZED TABLE GENERATION
 * Overrides the legacy CreateTable function from scripts.js.
 * Uses Tailwind CSS classes for modern design.
 */
function tableCreate(user_row, user_col, list, header) {
    var body = document.getElementById('Output');

    // 1. Header with Tailwind
    const h1 = document.createElement("h2");
    h1.className = "text-2xl md:text-3xl font-display font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2";
    h1.innerHTML = `<span class="material-symbols-outlined text-primary">analytics</span> ${header}`;
    body.appendChild(h1);

    console.log("Modern Table Data:", list);

    // 2. Container for rounded corners and overflow
    const container = document.createElement("div");
    container.className = "bg-card-light dark:bg-card-dark rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden mb-8";

    const scrollWrapper = document.createElement("div");
    scrollWrapper.className = "overflow-x-auto custom-scrollbar";
    container.appendChild(scrollWrapper);

    // Populate Filter (ensure we have data)
    populateCharacterFilter(list);

    // 3. Table Element
    var tbl = document.createElement("table");
    tbl.className = "min-w-full divide-y divide-gray-200 dark:divide-gray-700 w-full";
    tbl.id = "modernTable" + Math.random().toString(36).substr(2, 9);

    var tblHead = document.createElement("thead");
    tblHead.className = "bg-gray-50 dark:bg-gray-800/50";

    var tblBody = document.createElement("tbody");
    tblBody.className = "divide-y divide-gray-200 dark:divide-gray-700 bg-card-light dark:bg-card-dark";

    var headerRow = document.createElement("tr");

    // 4. Build Rows
    for (var j = 0; j < user_row; j++) {
        var row = document.createElement("tr");
        row.className = "hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors";

        // Add data-character attribute for filtering (Column 1 is Char Name)
        if (j > 0 && list[j] && list[j][1]) {
            row.dataset.character = list[j][1];
        }

        for (var i = 0; i < user_col; i++) {
            var cell;

            // HEADER ROW
            if (j == 0) {
                cell = document.createElement("th");
                cell.className = "px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider";
                // Removed legacy sortTable() onclick - DataTables handles sorting

                // Plain header content (DataTables adds its own sort indicators)
                let content = list[j][i] || "";
                cell.textContent = content;

                headerRow.appendChild(cell);
            }
            // DATA ROW
            else {
                cell = document.createElement("td");
                cell.className = "px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300";

                let cellText = list[j][i] || "";

                // Simple formatting for numeric columns
                if (!isNaN(parseFloat(cellText)) && isFinite(cellText)) {
                    cell.className += " font-mono";
                }

                cell.textContent = cellText;
                row.appendChild(cell);
            }
        }
        if (j > 0) {
            tblBody.appendChild(row);
        }
    }

    tblHead.appendChild(headerRow);
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);

    scrollWrapper.appendChild(tbl);
    body.appendChild(container);

    // 5. Initialize DataTable
    new DataTable('#' + tbl.id, {
        paging: false,
        searching: true,
        info: false,
        autoWidth: false,
        dom: '<"p-4"f>t' // f = filtering input, t = table
    });

    console.log("Created Modern Table");

    // Apply current filters immediately to the new table
    applyCharacterFilter();
}
