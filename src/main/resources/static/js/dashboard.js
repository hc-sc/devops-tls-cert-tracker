import {userBtn, displayServerErrorMessages, clearServerMessage, signOut, setAttributes, refreshToken, displaySuccessMessages} from "./module.js";

// Call refresh token to renew the accesstoken if the user hasn't signed out yet
refreshToken();

// Adding functionality to user button overlay
userBtn();

// Adding functionality to sign out link in user button over lay
signOut();

// Function call to fetch all the list of certificates in the database
fetctAllCertificate();

/*  *************************************************************************************************************
    **********************Events triggering DOM Manipulation for table and URL input Form************************
    ************************************************************************************************************* */
let submissionInProgress = false;

// prevent the form from submitting with enter for user input
const urlIputForm = document.querySelector('#url-form');
urlIputForm.addEventListener('input', (event) => {
  if (event.target.tagName.toLowerCase() === 'input') {
    clearServerMessage();
  }
});

urlIputForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  // renew refresh token if access token is expired and user hasn't signed out
  await refreshToken();
  let inputValid = $(this).valid();
  
  if(inputValid){
    
    // Display loading .gif file while it's fetching data
    const loadingImg = document.querySelector('.loadingImg');
    loadingImg.classList.remove("hidden");

    // Prevent multiple form submission while it's loading the data
    
    if (submissionInProgress) {
      return ;
    }

    // Get the URL string from the input box in the URL submit form
    const userInput = document.querySelector("#userInputUrl").value;

    try {
      submissionInProgress = true;
      await sendUrlAndFetchCertificate(userInput);
    } catch (error) {
      console.log(error);
    } finally{
      loadingImg.classList.add("hidden");
      submissionInProgress = false;
    }
    
    }

});

// Functions
// Function to dynamically populate the table body with json data
function populateTable(data) {
  data.forEach(certificate => {
    manipulateRow(certificate);
  });
}

// Dynamically generate HTML elements in the table with fetched data (certificate)
// Visually notifies user depending on the expiry date

function manipulateRow(certificate) {
  // add a row and the cells in the corresponding row
  const tableBody = document.querySelector('#certTable tbody');
  const addRow = tableBody.insertRow();
  const status = addRow.insertCell(0);
  const url = addRow.insertCell(1);
  const expiryDate = addRow.insertCell(2);
  const actionRow = addRow.insertCell(3);

  actionRow.classList.add("actionRow");

  // Saves dates in a variable for time calculations
  const today = new Date();
  const expiryDateData = new Date(certificate.validTo);

  // add cell content with certificate data
  url.textContent = certificate.url;
  expiryDate.textContent = certificate.validTo.substring(0, 10);
  
  addRow.setAttribute('certificateId', certificate.id);

  // Expiration date calculation for visual notification
  const calculatedTimeRemaining = calculateTimeRemaining(today, expiryDateData);
  const formattedMessage = formatTimeRemaining(calculatedTimeRemaining);

  // add text how many time is left to expire
  expiryDate.textContent += ", " + formattedMessage ;

  // Visual notification based on the how many days left to expire
  status.classList.add("status-cell");
  const daysRemaining = calculatedTimeRemaining.days;
  colorAlert(daysRemaining, status);

  //link to popup displaying additional info about certification
  const moreCertInfo = document.createElement('a');

  setAttributes(moreCertInfo, {"href": "#certinfo-popup", "aria-controls": "centred-popup", "class": "wb-lbx", "role": "button"});
  moreCertInfo.classList.add('icon-btn','moreCertInfo', 'glyphicon', 'glyphicon-info-sign', 'remove-link-style');
   
  // Append the element into the action cell in the table
  actionRow.appendChild(moreCertInfo);  
  
  // Create span element describing what moreCertInfo button does (screen reader) 
  // !!!!!!!!!!! needs translated !!!!!!!!!!!!!!
  const srMoreCertInfo = document.createElement("span");
  srMoreCertInfo.classList.add('wb-inv');
  srMoreCertInfo.textContent = `More certificate information about ${certificate.url}`;
  
  // Append the element for screen reader into the moreCertInfo element in the table
  moreCertInfo.appendChild(srMoreCertInfo);
  
   moreCertInfo.addEventListener('click', () => {
     
     const certificateId = addRow.getAttribute('certificateId');
     fetchCertificateById(certificateId);
   });

  // Deletion handling

  // Create button element for deleting the certificate
  const deleteButton = document.createElement("button");

  // Adding class to style the delete button
  deleteButton.classList.add('icon-btn', 'deleteBtn', 'glyphicon', 'glyphicon-trash');
  
  // Append the element into the action cell in the table
  actionRow.appendChild(deleteButton);

  // Create span element describing what deleteButton button does (screen reader)
  // !!!!!!!!!!! needs translated !!!!!!!!!!!!!!
  const srDeleteButton = document.createElement("span");
  srDeleteButton.classList.add('wb-inv');
  srDeleteButton.textContent = `Deleting certificate for ${certificate.url}`;

  // Append the element for screen reader into the moreCertInfo element in the table
  deleteButton.appendChild(srDeleteButton);

  deleteButton.addEventListener('click', () => {
    const certificateId = addRow.getAttribute('certificateId');
    fetchDeleteCertificate(certificateId);
  });
}

// Calculate time, days, week, month left to expiry
function calculateTimeRemaining(fromDate, toDate) {
  const msPerHour = 1000 * 60 * 60;
  const msPerDay = msPerHour * 24;
  const msPerWeek = msPerDay * 7;
  const timeDifference = toDate - fromDate;
  const monthsRemaining = (timeDifference / msPerDay / 30.44);
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
function colorAlert(daysRemaining, status){
    
  const colorCircle = document.createElement('span');
  status.appendChild(colorCircle);
  
  // adding element for screen reader to read the color
  const corlorSr = document.createElement('span');
  colorCircle.appendChild(corlorSr);
  corlorSr.classList.add("wb-inv");

  if (daysRemaining < 0) {
    // Certificate has expired
    colorCircle.classList.add('color-circle', 'color-expired');
    corlorSr.textContent = "Red";
  } else if (daysRemaining < 14) {
    // Expiring within 2 weeks (less than 14 days)
    colorCircle.classList.add('color-circle', 'color-expiringInTwoWeeks');
    corlorSr.textContent = "Orange";
  } else if (daysRemaining < 42) {
    // Expiring within 6 weeks (less than 42 days)
    colorCircle.classList.add('color-circle', 'color-expiringInSixWeeks');
    corlorSr.textContent = "Yellow";
  } else {
    // else (more than 6 weeks remaining)
    colorCircle.classList.add('color-circle', 'color-expiringGood');
    corlorSr.textContent = "Green";
  }
}


// *************************************************************************************************************
// ************************************************API Functions************************************************
// *************************************************************************************************************

// GET request to API to fetch list of all the certificate in the database and populate Table when browser open
async function fetctAllCertificate() {

  // renew refresh token if access token is expired and user hasn't signed out
  await refreshToken();

  let apiUrl = "/api/certificates/user/all"

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
      // On intial launch of server (application) wet-boew table does not recognize dynamically generated data on it's first launch, therefore append a row indicating no data in the table
      // this code is a temporary fix so that if there is something from database the no data row is removed.
      const noDataElement = document.querySelector('.dataTables_empty');
      if (noDataElement) {
        const noDataRow = noDataElement.parentElement; // Get the parent <tr> element
        noDataRow.remove(); // Remove the row if the "no data" element exists
      }
      populateTable(data);
    }

  } catch (error) {
    console.error("Error fetching JSON data (get all):", error);
  }
}

// POST request to API for sending URL to the backend and fetch corresponding data
async function sendUrlAndFetchCertificate(userInputUrl) {
  
  // renew refresh token if access token is expired and user hasn't signed out
  await refreshToken();

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
      displayServerErrorMessages('url-form', "Something went wrong, please check your URL address.")
      throw data;
    } else {
      displaySuccessMessages('url-form', "Successfully added new certificate.")
      // Don't need to manualy add a row because of refreshing the page
      // manipulateRow(data);
      // refresh the page to update table
      // location.reload();
    }
  } catch (error) {
    console.error("Error calling data for sendUrlAndFetchCertificate:", error)
  }
}

// Delete request to Backend API, with ID# of the certificate to be deleted
async function fetchDeleteCertificate(certificateId) {

  // renew refresh token if access token is expired and user hasn't signed out
  await refreshToken();

  let apiUrl = `/api/certificates/delete/user/${certificateId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    

    if(!response.ok){
      const error = await response.json();
      throw error;
    } else {
      // refresh the page to update table
      location.reload();
    }

  } catch (error) {
    console.error("Error calling api for deletion:", error)
  }
  // Don't need to manualy delete row because of refreshing the page
  // const tableBody = document.querySelector('#certTable tbody');
  // const rowToRemove = tableBody.querySelector(`[certificateId="${certificateId}"]`);

  // if (rowToRemove) {
  //   tableBody.removeChild(rowToRemove);
  //   location.reload();
  // }
}

async function fetchCertificateById(certificateId) {

  // renew refresh token if access token is expired and user hasn't signed out
  await refreshToken();

  let apiUrl = `/api/certificates/get/${certificateId}`

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
      console.log(data);
      populateCertInfo(data);
    }

  } catch (error) {
    console.error("Error fetching JSON data (get one certificate with id):", error);
  }
}



  // change text of html element with data
  function populateCertInfo(certificate){
    const certName = document.querySelector(".certSubjectName");
    const certSubjectOrganization = document.querySelector(".certSubjectOrganization");
    const certSubjectOrganizationUnit = document.querySelector(".certSubjectOrganizationUnit");

    const certIssuer = document.querySelector(".certIssuerName");
    const certIssuerOrganization = document.querySelector(".certIssuerOrganization");
    const certIssuerOrganizationUnit = document.querySelector(".certIssuerOrganizationUnit");

    const certValidFrom = document.querySelector(".certValidFrom");
    const certValidTo = document.querySelector(".certValidTo");

    //parse data subject to
    const parsedSubject = parseCertificateData(certificate.subject);
    certName.textContent = parsedSubject.CN || '<Not Part Of Certificate>';
    certSubjectOrganization.textContent = parsedSubject.O || '<Not Part Of Certificate>';
    certSubjectOrganizationUnit.textContent = parsedSubject.OU || '<Not Part Of Certificate>';
    const parsedIssuer = parseCertificateData(certificate.issuer)
    certIssuer.textContent = parsedIssuer.CN || '<Not Part Of Certificate>';
    certIssuerOrganization.textContent = parsedIssuer.O || '<Not Part Of Certificate>';
    certIssuerOrganizationUnit.textContent = parsedIssuer.OU || '<Not Part Of Certificate>';

    certValidFrom.textContent = certificate.validFrom;
    certValidTo.textContent = certificate.validTo;

  }
  
  function parseCertificateData(certificateData) {
    const splitedData = certificateData.split(",");
    const arrayData = [];
    const parsedResult = {};

    // What needs to be value includes "," in the string (eg. xyc\\, Inc.) which cuases problem. Spliting with "," will parse Inc as a key not value. 
    // Therefore, spliting the data into array to make sure , Inc. is included as a value no as key
    // take the splited data and break each section of data to index of array eg ['CA=www.canada.ca', 'O=xyc\\, Inc.', 'OU=xyz'] in to array based on '=' symbol
    splitedData.forEach(currentData => {
        if(currentData.includes('=')) {
          arrayData.push(currentData);
        } else {
          arrayData[arrayData.length-1] += ',' + `${currentData}`;
        }
    })

    // take the array of data and parse each index of array into key and value pair based on '=' symbol
    arrayData.forEach(data => {
      const [key, value] = data.split("=");

      //remove "\"" in the value
      parsedResult[key] = value.replace('\\', "");
    })

    return parsedResult;
}

// URL input popup modal closing behavior for jquery and wet-boew lightbox plugin
document.querySelector("#close-url-form").addEventListener('click',()=>{
  if(!submissionInProgress){
    $.magnificPopup.proto.close();
  } else{
    return ;
  }
})

  $(".url-form").on("mfpAfterClose", () => {
    // refreshing the page to update table once the popup is closed
    location.reload();
  });
