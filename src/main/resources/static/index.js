// Function call to fetch all the list of certificates in the database
fetchTableData();

// *************************************************************************************************************
// **********************************DOM Manipulation for table and URL input***********************************
// *************************************************************************************************************

// prevent the form from submitting with enter for user input
const urlIputForm = document.querySelector('#certTable');
urlIputForm.addEventListener('submit', async function (e) {
  e.preventDefault();
});

const userInputField = document.querySelector("#userInputUrl");
userInputField.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default Enter key behavior
    urlSubmitBtn.click(); // Trigger a click event on the submit button
  }
});

// handling form submission (fetching POST request)
let submissionInProgress = false;

const urlSubmitBtn = document.querySelector('#submitUrl');
urlSubmitBtn.addEventListener('click', async function (e) {
  e.preventDefault();


  const loadingImg = document.querySelector('.loadingImg');
  loadingImg.classList.remove("hidden");

  // prevent multiple form submission while it's loading the data
  if (submissionInProgress) {
    return;
  }

  const userInput = document.querySelector("#userInputUrl").value;

  try {
    submissionInProgress = true;
    await addFetch(userInput);
  } catch (error) {
    console.log(error);
  }
  submissionInProgress = false;
});

// Functions

// Function to dynamically populate the table body with json data
function populateTable(data) {
  const tableBody = document.querySelector('#certTable tbody');

  data.forEach(certificate => {
    addandDeleteRow(certificate);
  });
}

// Dynamically generate HTML elements in the table with fetched data (certificate)
// Visually notifies user depending on the expiry date

function addandDeleteRow(certificate) {
  const tableBody = document.querySelector('#certTable tbody');
  const addRow = tableBody.insertRow();
  const url = addRow.insertCell(0);
  const expiryDate = addRow.insertCell(1);
  const actionRow = addRow.insertCell(2);

  actionRow.classList.add("actionRow");

  const today = new Date();
  const expiryDateData = new Date(certificate.validTo);

  // add cell content with json data
  url.textContent = certificate.url;
  expiryDate.textContent = certificate.validTo.substring(0, 10);
  //  status.textContent = certificate.status;
  addRow.setAttribute('certificateId', certificate.id);

  // Expiration date calculation for visual notification
  const dateCalculate = Math.floor((expiryDateData - today) / (1000 * 60 * 60 * 24));
  
  let calculatedTimeRemaining = calculateTimeRemaining(today, expiryDateData);
  let formattedMessage = formatTimeRemaining(calculatedTimeRemaining);
  console.log(formattedMessage);
  expiryDate.textContent += ", " + formattedMessage ;

  // Visual notification based on the expiry date
  if (expiryDateData < today) {
    // Certificate has expired
    addRow.classList.add('color_expired');
  } else if (dateCalculate < 14) {
    // Expiring within 2 weeks (less than 14 days)
    addRow.classList.add('color_expiringInTwoWeeks');
  } else if (dateCalculate < 42) {
    // Expiring within 6 weeks (less than 42 days)
    addRow.classList.add('color_expiringInSixWeeks');
  } else {
    // else (more than 6 weeks remaining)
    addRow.classList.add('color_expiringGood');
  }

    //link to page displaying additional info about certification and save corresponding id number to cookie
    const moreCert = document.createElement("span");
    moreCert.classList.add('moreCertInfo');
    moreCert.classList.add('glyphicon');
    moreCert.classList.add('glyphicon-info-sign');
    actionRow.appendChild(moreCert)
  
    moreCert.addEventListener('click', () => {
      
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
  deleteButton.setAttribute('alt', 'Delete Button');
  // Append the element into the appropriate cell in the table
  actionRow.appendChild(deleteButton);
  deleteButton.addEventListener('click', () => {
    const certificateId = addRow.getAttribute('certificateId');
    deleteFetch(certificateId);
  });
}

//save id number to cookie and send it to certinfo.html js file
function setCookie(name, value){
  const cookieExpires = "";
  document.cookie = name + "=" + (value || "");
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


// *************************************************************************************************************
// ************************************************API Functions************************************************
// *************************************************************************************************************

// GET request to API to fetch list of all the certificate in the database
async function fetchTableData() {
  apiUrl = "/api/certificates/all"

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': "application/json"
      }
    });
    const data = await response.json();
    if(!response.ok){
      throw data;
    } else {
      const noDataElement = document.querySelector('.dataTables_empty');
      if (noDataElement) {
        const noDataRow = noDataElement.parentElement; // Get the parent <tr> element
        noDataRow.remove(); // Remove the row if the "no data" element exists
      }
      console.log(data);
      populateTable(data);
    }

  } catch (error) {
    console.error("Error fetching JSON data (get all):", error);
  }
}

// POST request to API for sending URL to the backend
async function addFetch(userInputUrl) {
  let apiUrl = "/api/certificates/add";

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ url: userInputUrl })
    });

    const data = await response.json();

    if(!response.ok){
      throw data;
    } else {
      addandDeleteRow(data);
      location.reload();
    }
  } catch (error) {
    console.error("Error calling data for addFetch:", error)
  }
}

// Delete request to API, with ID# of the certificate to be deleted
async function deleteFetch(certificateId) {

  let apiUrl = `/api/certificates/delete/${certificateId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    const error = await response.json();

    if(!response.ok){
      throw error;
    }

  } catch (error) {
    console.error("Error calling api for deletion:", error)
  }

  const tableBody = document.querySelector('#certTable tbody');
  const rowToRemove = tableBody.querySelector(`[certificateId="${certificateId}"]`);

  if (rowToRemove) {
    tableBody.removeChild(rowToRemove);
    location.reload();
  }
}