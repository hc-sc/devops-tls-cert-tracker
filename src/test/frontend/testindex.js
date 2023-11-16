import {getCookie, userBtn, displayErrorMessages, clearServerErrorMessage, signOut, setAttributes} from "./testmodule.js";

// user button behaviour for signed in user
userBtn();
// sign out
signOut();

// greet signed in user by getting his name stored from cookie
const greeting = document.querySelector(".greeting");
let userName = getCookie("userName");
if(userName && userName !== null){
  greeting.textContent = ` Hi, ${userName}! Welcome.`;
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

let submissionInProgress = false;
let update = false;

const urlInputForm = document.querySelector('#url-form');
urlInputForm.addEventListener('submit', async function (e){
  e.preventDefault();

  clearServerErrorMessage();
  let inputValid = $(this).valid();
  let errorTest = true
  // for testing purpose intentionally failing the request
  if(inputValid){
    
    // Display loading .gif file while it's fetching data
    const loadingImg = document.querySelector('.loadingImg');
    loadingImg.classList.remove("hidden");

    if (submissionInProgress) {
      return ;
    }

    try{
      submissionInProgress = true;
      
      const userInput = document.querySelector("#userInputUrl").value;
      const tableBody = document.querySelector('#certTable tbody');
      const addRow = tableBody.insertRow();
      const status = addRow.insertCell(0);
      const url = addRow.insertCell(1);
      const expiryDate = addRow.insertCell(2);
      const deleteRow = addRow.insertCell(3);
    
      url.textContent = userInput;
  
      // location.reload();
    } catch (error){
      console.log(error);
    } finally{
      loadingImg.classList.add("hidden");
      submissionInProgress = false;
    }

  } else {
    console.log("Invalid User Input")
  }


  // testing for displaying server error
  if(inputValid && !errorTest){
    console.log("error detected");
    const errorsFromServer = {"error:": '500', 
                              "message": 'Invalid URL format'};
    displayErrorMessages("url-form", errorsFromServer);
  }
  
});

// Saved certificates are displayed in the table
  function populateTable(data) {
    const tableBody = document.querySelector('#certTable tbody');

    data.forEach(certificate => {
      manipulateRow(certificate);
    });
  }
        
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
  const expiryDateData = new Date(certificate.ValidTo);

  // add cell content with certificate data
  url.textContent = certificate.url;
  expiryDate.textContent = certificate.ValidTo.substring(0, 10);
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

  // link to page displaying additional info about certification and save corresponding id number to cookie
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
  
  // Event listener 
  moreCertInfo.addEventListener('click', () => {
    
    const certificateId = addRow.getAttribute('certificateId');
    fetchCertificateById(certificateId);
  });

  // Deletion handling

  // Create button element for deleting the certificate
  const deleteButton = document.createElement('button');

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

  // !!!!!!!!!!! needs translated !!!!!!!!!!!!!!
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


callingMockedData();

async function fetchCertificateById(certid) {
  try {
    const response = await fetch('mockedData.json')
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();

    // Filter the data by ID
    const item = data.find(item => item.id == certid);

    if (item) {
      // Do something with the item, e.g., populate a table
      certificateTextContent(item);
      console.log('Item found:', item);
    } else {
      console.error('Item with ID not found:', certid);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Usage: Call the function with the desired id (e.g., 2)
// change text of html element with data
function certificateTextContent(certificate){
  const certUrl = document.querySelector(".certUrl");
  const certName = document.querySelector(".certName");
  const certIssuer = document.querySelector(".certIssuer");
  const certValidFrom = document.querySelector(".certValidFrom");
  const certValidTo = document.querySelector(".certValidTo");
  // pageHeading.textContent = "Certificate Details\n" + certificate.url;
  // pageHeading.style.whiteSpace= "pre";
  certUrl.textContent = certificate.url;
  certName.textContent = certificate.name;
  certIssuer.textContent = certificate.issuer;
  certValidFrom.textContent = certificate.ValidFrom;
  certValidTo.textContent = certificate.ValidTo;
}

// URL input popup modal closing behavior for jquery and wet-boew lightbox plugin
document.querySelector("#close-url-form").addEventListener('click',()=>{
  if(!submissionInProgress){
    console.log(submissionInProgress);
    $.magnificPopup.proto.close();
  } else{
    console.log(submissionInProgress);
    return ;
    
  }
})
  
  
$(".url-form").on("mfpAfterClose", () => {
  // refreshing the page to update table once the popup is closed
  // (commented in this test.js because we are not integrated and no need to refresh the table as we manually add rows)
  
  // location.reload();
});
  