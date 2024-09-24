// Function to fetch and process CSV data
function fetchCSVData() {
    fetch('./c_income_zhvi_mortgage_comprehensive_affordability.csv') // Path to your CSV file
      .then(response => response.text())
      .then(data => {
        // Split the CSV into rows
        const rows = data.split('\n');
 
      // Remove any empty or whitespace-only rows (e.g., a trailing newline)
      const nonEmptyRows = rows.filter(row => row.trim() !== '');
      console.log('Filtered Rows:', nonEmptyRows);

      // Get the last row
      const lastRow = nonEmptyRows[nonEmptyRows.length - 1];
      console.log('Last Row:', lastRow);

      // Example: If we want to pull the value from the second column (index 1) of the last row
      let specificValue = lastRow.split(',')[15]; // Adjust index based on your CSV format
      console.log('Extracted Value:', specificValue);

      // Check if the value is valid before formatting
      if (specificValue) {
        // Convert to number, format with commas, and remove decimals
        specificValue = parseFloat(specificValue.trim()).toLocaleString('en-US', { maximumFractionDigits: 0 });
        console.log('Formatted Value:', specificValue);

        // Insert the formatted value into the HTML element
        document.getElementById('csv-value').innerText = specificValue;
      } else {
        console.error('Error: Extracted value is empty or invalid');
      }
    })
    .catch(error => console.error('Error fetching CSV:', error));
}

// Call the function when the page loads
window.onload = fetchCSVData;