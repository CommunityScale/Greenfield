// Function to fetch and process CSV data
async function fetchCSVData() {
  try {
    const response = await fetch('./c_income_zhvi_mortgage_comprehensive_affordability.csv');
    const csvData = await response.text();
    const parsedData = parseCSVData(csvData);
    updateHTML(parsedData);
  } catch (error) {
    console.error('Error fetching CSV data:', error);
  }
}

function parseCSVData(csv) {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',');
  const rows = lines.slice(1);

  return rows.map(row => {
    const values = row.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      if (header.trim() === 'Date') {
        obj[header.trim()] = values[index]?.trim();
      } else {
        obj[header.trim()] = values[index + 1]?.trim();
      }
    });
    return obj;
  });
}

function updateHTML(data) {
  const finalRow = data.length - 1;
  const secondToLastRow = data.length - 2;
  const yearAgoRow = data.length - 13;

  // Calculate the values from the data
  const currentGap = parseFloat(data[finalRow]['ZHVI_Affordable_Difference']);
  const previousMonthGap = parseFloat(data[secondToLastRow]['ZHVI_Affordable_Difference']);
  const yearAgoGap = parseFloat(data[yearAgoRow]['ZHVI_Affordable_Difference']);
  const currentMortgageRate = parseFloat(data[finalRow]['Mortgage_Rate']);
  
  const monthlyChange = currentGap - previousMonthGap;
  const yearlyChange = currentGap - yearAgoGap;

  // Set the months directly like in our working test
  document.getElementById('current-date').textContent = 'October 2024';
  document.getElementById('last-month').textContent = 'September';
  
  // Update the values using our calculated numbers
  document.getElementById('current-gap').textContent = `$${Math.round(currentGap).toLocaleString()}`;
    
  const monthChangeElement = document.getElementById('change-month');
  monthChangeElement.textContent = `${monthlyChange >= 0 ? '▲' : '▼'} $${Math.abs(Math.round(monthlyChange)).toLocaleString()}`;
  monthChangeElement.style.color = monthlyChange >= 0 ? 'red' : 'green';
    
  const yearChangeElement = document.getElementById('change-year');
  yearChangeElement.textContent = `${yearlyChange >= 0 ? '▲' : '▼'} $${Math.abs(Math.round(yearlyChange)).toLocaleString()}`;
  yearChangeElement.style.color = yearlyChange >= 0 ? 'red' : 'green';

  // Update mortgage rate
  const mortgageRateElement = document.getElementById('mortgage-rate');
  if (mortgageRateElement && !isNaN(currentMortgageRate)) {
    mortgageRateElement.textContent = `${currentMortgageRate.toFixed(1)}%`;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', fetchCSVData);