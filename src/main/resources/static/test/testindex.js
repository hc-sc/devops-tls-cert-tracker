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
     addandDeleteRow(certificate);
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

function addandDeleteRow(certificate) {
  const tableBody = document.querySelector('#certTable tbody');
  const addRow = tableBody.insertRow();
  const url = addRow.insertCell(0);
  const expiryDate = addRow.insertCell(1);
  const actionRow = addRow.insertCell(2);

  const today = new Date();
  const expiryDateData = new Date(certificate.ValidTo);

  // add cell content with json data
  url.textContent = certificate.url;
  expiryDate.textContent = certificate.ValidTo
  addRow.setAttribute('certificateId', certificate.id);

  // Expiration date calculation for visual notification
  const dateCalculate = Math.floor((expiryDateData - today) / (1000 * 60 * 60 * 24));

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
    window.location.replace("http://127.0.0.1:5500/src/main/resources/static/test/certinfo.html");
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


callingMockedData();