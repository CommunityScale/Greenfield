// Function to fetch and process CSV data
function fetchCSVData() {
    fetch('./c_income_zhvi_mortgage_comprehensive_affordability.csv') // Path to your CSV file
      .then(response => response.text())
      .then(data => {
        // Split the CSV into rows
        const rows = data.split('\n');
        console.log('CSV Rows:', rows);  // Debugging: Log all the rows to verify CSV content
  
        // Remove any empty or whitespace-only rows
        const nonEmptyRows = rows.filter(row => row.trim() !== '');
        console.log('Non-empty Rows:', nonEmptyRows);  // Debugging: Log non-empty rows
  
        if (nonEmptyRows.length < 13) {
          console.error('Error: Not enough rows in the CSV to calculate 12 rows prior.');
          return;  // Exit the function early if there are not enough rows
        }
  
        // Get the index of the last row
        const lastRowIndex = nonEmptyRows.length - 1;
  
        // Get the last row, previous row, and 12 rows prior (if available)
        const lastRow = nonEmptyRows[lastRowIndex].split(',');
        const previousRow = nonEmptyRows[lastRowIndex - 1]?.split(',');
        const row12Prior = nonEmptyRows[lastRowIndex - 12]?.split(',');
  
        console.log('Last Row:', lastRow);  // Debugging: Log the last row
        console.log('Previous Row:', previousRow);  // Debugging: Log the previous row
        console.log('12 Rows Prior:', row12Prior);  // Debugging: Log the 12th prior row
  
        // Check if rows contain enough columns
        if (lastRow.length < 15 || previousRow?.length < 15 || row12Prior?.length < 15) {
          console.error('Error: Rows do not have enough columns.');
          return;  // Exit the function early if columns are missing
        }
  
        // 1. Extract value from the last row, column 12 (index 5)
        let lastRowCol12 = lastRow[12].trim();
  
        // 2. Extract value from the last row, column 15 (index 14)
        let lastRowCol15 = lastRow[15].trim();
  
        // Convert the values from string to number
        lastRowCol6 = parseFloat(lastRowCol12);
        lastRowCol15 = parseFloat(lastRowCol15);
  
        if (isNaN(lastRowCol6) || isNaN(lastRowCol15)) {
          console.error('Error: Unable to convert column values to numbers.');
          return;  // Exit the function early if conversion to number fails
        }
  
        // 3. Calculate the difference between lastRowCol15 and the same value from the previous row
        let prevRowCol15 = previousRow ? parseFloat(previousRow[15].trim()) : NaN;
        let diffWithPrevRow = isNaN(prevRowCol15) ? 'N/A' : lastRowCol15 - prevRowCol15;
  
        // 4. Calculate the difference between lastRowCol15 and the same value from 12 rows prior
        let row12PriorCol15 = row12Prior ? parseFloat(row12Prior[15].trim()) : NaN;
        let diffWith12RowsPrior = isNaN(row12PriorCol15) ? 'N/A' : lastRowCol15 - row12PriorCol15;
  
        // Format the non currency values with commas and no decimals
        const formattedLastRowCol6 = lastRowCol12.toLocaleString('en-US', { maximumFractionDigits: 0 });
        
        // Format the currency values with dollar signs, commas, and no decimals
        const formattedLastRowCol15 = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(lastRowCol15);
          
          const formattedDiffWithPrevRow = typeof diffWithPrevRow === 'number' 
            ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(diffWithPrevRow) 
            : 'N/A';
          
          const formattedDiffWith12RowsPrior = typeof diffWith12RowsPrior === 'number' 
            ? new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(diffWith12RowsPrior) 
            : 'N/A';
            
        // Insert the extracted values into the corresponding HTML elements
        document.getElementById('mortgage-rate').innerText = formattedLastRowCol6;
        document.getElementById('current-gap').innerText = formattedLastRowCol15;
        document.getElementById('change-month').innerText = formattedDiffWithPrevRow;
        document.getElementById('change-year').innerText = formattedDiffWith12RowsPrior;
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }
  
  // Call the function when the page loads
  window.onload = fetchCSVData;
  