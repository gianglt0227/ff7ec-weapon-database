function tableCreate(user_row, user_col, list, header) {
    //body reference 
    var body = document.getElementById('Output'); 

    // header
    const h1 = document.createElement("h1"); 
    const textNode = document.createTextNode(header);
    h1.className = "weaponHeader";
    h1.appendChild(textNode);
    body.appendChild(h1);

    console.log("Table Data:", list);
  
    // create <table> and a <tbody>
    var tbl = document.createElement("table");
    let tblClassName;
    let tblId = "table_" + Math.random().toString(36).substr(2, 9); // Generate a unique ID for each table

    // Different format for each table 
    if (user_col == ELEM_TABL_COL) {
        tblClassName = "elemTable";
    }
    else if (user_col == MATERIA_TABL_COL) {
        tblClassName = "materiaTable";
    }
    else if (user_col == STATUS_TABL_COL) {
        tblClassName = "statusTable";
    }
    else if (user_col == UNIQUE_TABL_COL) {
        tblClassName = "uniqueTable";
    }
    else {
        tblClassName = "effectTable";
    }
    tbl.className = tblClassName;
    tbl.id = tblId; // Set the unique ID
    var tblBody = document.createElement("tbody");

    // create <tr> and <td>
    for (var j = 0; j < user_row; j++) {
        var row = document.createElement("tr");

        for (var i = 0; i < user_col; i++) {
            var cell;
            if (j == 0) {
                cell = document.createElement("th");
                cell.onclick = function () {
                    sortTable(this);
                };
            }
            else {
                cell = document.createElement("td");
            }
            var cellText;
            cellText = document.createTextNode(list[j][i] || ""); // Ensure no undefined values
            cell.appendChild(cellText);
            row.appendChild(cell);
        }

        tblBody.appendChild(row);
    }

    // append the <tbody> inside the <table>
    tbl.appendChild(tblBody);

    // put <table> in the <body>
    body.appendChild(tbl);

    // tbl border attribute to 
    tbl.setAttribute("border", "2");

    // Initialize DataTable after appending to the DOM
    $('#' + tblId).DataTable();
}
