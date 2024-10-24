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

      // Extract and convert necessary column values
      const lastRowCol12 = parseToNumber(lastRow[12]);
      const lastRowCol15 = parseToNumber(lastRow[15]);

      if (isNaN(lastRowCol12) || isNaN(lastRowCol15)) {
        console.error('Error: Unable to convert column values to numbers.');
        return;  // Exit the function early if conversion to number fails
      }

      // Calculate differences with previous rows
      const prevRowCol15 = parseToNumber(previousRow[15]);
      const diffWithPrevRow = isNaN(prevRowCol15) ? 'N/A' : lastRowCol15 - prevRowCol15;

      const row12PriorCol15 = parseToNumber(row12Prior[15]);
      const diffWith12RowsPrior = isNaN(row12PriorCol15) ? 'N/A' : lastRowCol15 - row12PriorCol15;

      // Format values for display
      const formattedLastRowCol12 = formatNumber(lastRowCol12);
      const formattedLastRowCol15 = formatCurrency(lastRowCol15);
      const formattedDiffWithPrevRow = typeof diffWithPrevRow === 'number' ? formatCurrency(diffWithPrevRow) : 'N/A';
      const formattedDiffWith12RowsPrior = typeof diffWith12RowsPrior === 'number' ? formatCurrency(diffWith12RowsPrior) : 'N/A';
      
      // Extract the month name from the previous row (column 0 assumed to be date)
      let previousMonthName = 'N/A';
      if (previousRow && previousRow[0]) {
        const date = new Date(previousRow[0].trim());
        if (!isNaN(date)) {
          previousMonthName = date.toLocaleString('en-US', { month: 'long' });
        }
      }
      
      // Insert the extracted values into the corresponding HTML elements
      document.getElementById('mortgage-rate').innerText = formattedLastRowCol12;
      document.getElementById('current-gap').innerText = formattedLastRowCol15;
      document.getElementById('change-month').innerText = formattedDiffWithPrevRow;
      document.getElementById('change-year').innerText = formattedDiffWith12RowsPrior;
      document.getElementById('last-month').innerText = previousMonthName;
    })
    .catch(error => console.error('Error fetching CSV:', error));
}

// Utility function to parse a CSV row into an array
function parseCSVRow(row) {
  return row ? row.split(',') : [];
}

// Utility function to check if a row has enough columns
function hasEnoughColumns(row, minColumns) {
  return row && row.length >= minColumns;
}

// Utility function to parse a value to a number
function parseToNumber(value) {
  return parseFloat(value?.trim());
}

// Utility function to format a number with commas and no decimals
function formatNumber(value) {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Utility function to format a value as currency
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Call the function when the page loads
window.onload = fetchCSVData;
