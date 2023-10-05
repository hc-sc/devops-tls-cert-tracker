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
  // const deleteRow = addRow.insertCell(2);

  const today = new Date();
  const expiryDateData = new Date(certificate.ValidTo);
  // dateString = expiryDateData.getFullYear() + " - " + expiryDateData.getMonth() + " - " + expiryDateData.getDate();

  // add cell content with json data
  url.textContent = certificate.url;
  expiryDate.textContent = certificate.ValidTo
 //  status.textContent = certificate.status;
  addRow.setAttribute('certificateId', certificate.id);

  // Expiration date calculation for visual notification
  const dateCalculate = Math.floor((expiryDateData - today) / (1000 * 60 * 60 * 24));

  // Visual notification based on the expiry date
  if (expiryDateData < today) {
    // Certificate has expired
    addRow.setAttribute('id', 'expired');
  } else if (dateCalculate < 14) {
    // Expiring within 2 weeks (less than 14 days)
    addRow.setAttribute('id', 'expiringInTwoWeeks');
  } else if (dateCalculate < 42) {
    // Expiring within 6 weeks (less than 42 days)
    addRow.setAttribute('id', 'expiringInSixWeeks');
  } else {
    // else (more than 6 weeks remaining)
    addRow.setAttribute('id', 'expiringGood');
  }
}


callingMockedData();