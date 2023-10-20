//save id number to cookie and send it to certinfo.html js file
function setCookie(name, value){
  const cookieExpires = "";
  document.cookie = name + "=" + (value || "");
}


async function callingMockedData() {
  try {
    const response = await fetch('mockedData.json'); // Replace with the correct path to your JSON file
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    console.log(data);
    populateTable(data);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

const urlInputForm = document.querySelector('form');
urlInputForm.addEventListener('submit', function (e){
  e.preventDefault();
});

const userInputField = document.querySelector("#userInputUrl");
userInputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    urlSubmitBtn.click();
  }
});

const urlSubmitBtn = document.querySelector('#submitUrl');
urlSubmitBtn.addEventListener('click', function (e) {

  const userInput = document.querySelector("#userInputUrl").value;
  let validation = urlValidation(userInput);
  if (validation){
    const tableBody = document.querySelector('#certTable tbody');
    const addRow = tableBody.insertRow();
    const url = addRow.insertCell(0);
    const expiryDate = addRow.insertCell(1);
    const deleteRow = addRow.insertCell(2);
  
    url.textContent = userInput;
  } else {
    console.log("Invalid User Input")
  }


});

// Saved certificates are displayed in the table
  function populateTable(data) {
    const tableBody = document.querySelector('#certTable tbody');

    data.forEach(certificate => {
      manipulateRow(certificate);
    });
  }
        

// Prevent empty user input
function urlValidation(userInput){
  if(userInput.trim() === ""){
    return false;
  } else {
    return true;
  }
}       

function manipulateRow(certificate) {
  // add a row and the cells in the corresponding row
  const tableBody = document.querySelector('#certTable tbody');
  const addRow = tableBody.insertRow();
  const url = addRow.insertCell(0);
  const expiryDate = addRow.insertCell(1);
  const actionRow = addRow.insertCell(2);

  actionRow.classList.add("actionRow");

  // Saves dates in a variable for time calculations
  const today = new Date();
  const expiryDateData = new Date(certificate.ValidTo);

  // add cell content with certificate data
  url.textContent = certificate.url;
  expiryDate.textContent = certificate.ValidTo
  addRow.setAttribute('certificateId', certificate.id);

  // Expiration date calculation for visual notification
  const calculatedTimeRemaining = calculateTimeRemaining(today, expiryDateData);
  const formattedMessage = formatTimeRemaining(calculatedTimeRemaining);
  
  // add text how many time is left to expire
  expiryDate.textContent += ", " + formattedMessage ;

  // Visual notification based on the how many days left to expire
  const daysRemaining = calculatedTimeRemaining.days;
  colorAlert(daysRemaining, addRow);

  //link to page displaying additional info about certification and save corresponding id number to cookie
  const moreCertInfo = document.createElement("span");
  moreCertInfo.classList.add('moreCertInfo');
  moreCertInfo.classList.add('glyphicon');
  moreCertInfo.classList.add('glyphicon-info-sign');
  actionRow.appendChild(moreCertInfo)

  moreCertInfo.addEventListener('click', () => {
    
    const certificateId = addRow.getAttribute('certificateId');
    setCookie("certId", certificateId)
    window.location.replace("./certinfo.html");

  });

  // Deletion handling

  // Create button element for deleting the certificate
  const deleteButton = document.createElement("span");

  // Adding class to style the delete button
  deleteButton.classList.add('deleteBtn');
  deleteButton.classList.add('glyphicon');
  deleteButton.classList.add('glyphicon-trash');


  // Append the element into the appropriate cell in the table
  actionRow.appendChild(deleteButton)
  
  deleteButton.addEventListener('click', () => {
    
    const certificateId = addRow.getAttribute('certificateId');
    const rowToRemove = tableBody.querySelector(`[certificateId="${certificateId}"]`);
    
    if (rowToRemove) {
      tableBody.removeChild(rowToRemove);
    }
  });

}

// Calculate time, days, week, month left to expiry
function calculateTimeRemaining(fromDate, toDate) {
  const msPerHour = 1000 * 60 * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const timeDifference = toDate - fromDate;
  const monthsRemaining = ((toDate - fromDate) / msPerDay / 30.44);
  const weeksRemaining = (timeDifference / msPerWeek);
  const daysRemaining = timeDifference / msPerDay;
  const hoursRemaining = Math.floor(timeDifference % msPerDay) / msPerHour;
  const minutesRemaining = Math.floor(timeDifference % msPerHour) / (1000 * 60);
  
  return { months: monthsRemaining, weeks: weeksRemaining, days: daysRemaining, hours: hoursRemaining, minutes: minutesRemaining };
}

// Format the calculated remaining time to expiry and return correct message depending on the time
function formatTimeRemaining(calculatedTimeRemaining) {
  const { months, weeks, days, hours, minutes } = calculatedTimeRemaining;

  const roundedMonths = Math.round(months);
  const roundedWeeks = Math.round(weeks);
  const roundedDays = Math.round(days);
  const roundedHours = Math.round(hours);
  const roundedMinutes = Math.round(minutes);

  const commonMessage = "left to expire"

  if (months >= 1) {

    return `${roundedMonths} month(s) ${commonMessage}`;

  } else if (weeks >= 1) {

    return `${roundedWeeks} week(s) ${commonMessage}`;

  } else if (days >= 1) {

    return `${roundedDays} day(s) ${commonMessage}`;

  } else if (hours >= 1) {

    return `${roundedHours} hour(s) ${roundedMinutes} minute(s) ${commonMessage}`;

  } else if (minutes >= 1) {

    return `${roundedMinutes} minute(s) ${commonMessage}`;

  } else {
    return "This certificate is expired";
  }
}

// Visual notification based on the expiry date
function colorAlert(daysRemaining, row){
    
    if (daysRemaining < 0) {
      // Certificate has expired
      row.classList.add('color_expired');
    } else if (daysRemaining < 14) {
      // Expiring within 2 weeks (less than 14 days)
      row.classList.add('color_expiringInTwoWeeks');
    } else if (daysRemaining < 42) {
      // Expiring within 6 weeks (less than 42 days)
      row.classList.add('color_expiringInSixWeeks');
    } else {
      // else (more than 6 weeks remaining)
      row.classList.add('color_expiringGood');
    }
}


callingMockedData();

// const table = $('#certTable').DataTable();