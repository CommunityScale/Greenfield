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

// Function to parse CSV data into an array of objects
function parseCSVData(csv) {
  const lines = csv.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',');
  const rows = lines.slice(1);

  return rows.map(row => {
    const values = row.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      if (header.trim() === 'Date') {
        obj[header.trim()] = values[index]?.trim(); // No shift for date column
      } else {
        obj[header.trim()] = values[index + 1]?.trim(); // Shift index by +1 for price columns
      }
    });
    return obj;
  });
}

// Function to update HTML elements with the desired values
function updateHTML(data) {
  if (data.length === 0) {
    console.error('No data available to update HTML elements.');
    return;
  }

  const latestIndex = data.length - 1;
  const previousMonthIndex = data.length - 2;
  const oneYearAgoIndex = Math.max(0, latestIndex - 12);

  // Get latest values for the desired fields from "ZHVI_Affordable_Difference" column
  const latestZHVIDifference = parseFloat(data[latestIndex]['ZHVI_Affordable_Difference']);
  const previousMonthZHVIDifference = previousMonthIndex >= 0 ? parseFloat(data[previousMonthIndex]['ZHVI_Affordable_Difference']) : NaN;
  const oneYearAgoZHVIDifference = oneYearAgoIndex >= 0 ? parseFloat(data[oneYearAgoIndex]['ZHVI_Affordable_Difference']) : NaN;
  const latestMortgageRate = parseFloat(data[latestIndex]['Mortgage_Rate']);

  // Update "current-gap"
  const currentGapElement = document.getElementById('current-gap');
  if (!isNaN(latestZHVIDifference)) {
    const currentGap = `$${Math.round(latestZHVIDifference).toLocaleString()}`;
    currentGapElement.innerText = currentGap;
  } else {
    currentGapElement.innerText = 'Data unavailable';
  }

  // Update "change-month"
  const changeMonthElement = document.getElementById('change-month');
  let changeMonthHTML = 'Data unavailable';
  if (!isNaN(latestZHVIDifference) && !isNaN(previousMonthZHVIDifference)) {
    const changeMonthValue = latestZHVIDifference - previousMonthZHVIDifference;
    changeMonthHTML = `${changeMonthValue >= 0 ? '▲' : '▼'} $${Math.abs(Math.round(changeMonthValue)).toLocaleString()}`;
    changeMonthElement.innerText = changeMonthHTML;
    changeMonthElement.style.color = changeMonthValue >= 0 ? 'red' : 'green';
  } else {
    changeMonthElement.innerText = changeMonthHTML;
    changeMonthElement.style.color = 'black';
  }

  // Update "change-year"
  const changeYearElement = document.getElementById('change-year');
  let changeYearHTML = 'Data unavailable';
  if (!isNaN(latestZHVIDifference) && !isNaN(oneYearAgoZHVIDifference)) {
    const changeYearValue = latestZHVIDifference - oneYearAgoZHVIDifference;
    changeYearHTML = `${changeYearValue >= 0 ? '▲' : '▼'} $${Math.abs(Math.round(changeYearValue)).toLocaleString()}`;
    changeYearElement.innerText = changeYearHTML;
    changeYearElement.style.color = changeYearValue >= 0 ? 'red' : 'green';
  } else {
    changeYearElement.innerText = changeYearHTML;
    changeYearElement.style.color = 'black';
  }

  // Extract the month name from the row below the previous row (column assumed to be date)
  let previousMonthName = 'N/A';
  const shiftedPreviousMonthIndex = previousMonthIndex + 1;
  if (shiftedPreviousMonthIndex < data.length && data[shiftedPreviousMonthIndex]['Date']) {
    const date = new Date(data[shiftedPreviousMonthIndex]['Date']);
    if (!isNaN(date)) {
      previousMonthName = date.toLocaleString('en-US', { month: 'long' });
    }
  }
  document.getElementById('last-month').innerText = previousMonthName;

  // Update "mortgage-rate"
  const mortgageRateElement = document.getElementById('mortgage-rate');
  let mortgageRate = 'Data unavailable';
  if (!isNaN(latestMortgageRate)) {
    mortgageRate = `${latestMortgageRate.toFixed(1)}%`;
    mortgageRateElement.innerText = mortgageRate;
  } else {
    mortgageRateElement.innerText = mortgageRate;
  }

  // Log current values for reference
  console.log(`Current Affordability Gap: ${currentGapElement.innerText}`);
  console.log(`Change from Previous Month: ${changeMonthHTML}`);
  console.log(`Change from One Year Ago: ${changeYearHTML}`);
  console.log(`Current Mortgage Rate: ${mortgageRate}`);
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchCSVData);
