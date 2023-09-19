async function fetchTableData() {
   apiUrl = "/api/certificates/all"

   const response = await fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    console.log(data);
      populateTable(data);
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    });
}

// Function to dynamically populate the table body with json data
function populateTable(data) {
  const tableBody = document.querySelector('#certTable tbody');

  data.forEach(certificate => {
    const addRow = tableBody.insertRow();
    const url = addRow.insertCell(0);
    const expiryDate = addRow.insertCell(1);
    //const status = addRow.insertCell(2);
    const deleteRow = addRow.insertCell(2);

    const today = new Date();
    const expiryDateData = new Date(certificate.validTo);
    // dateString = expiryDateData.getFullYear() + " - " + expiryDateData.getMonth() + " - " + expiryDateData.getDate();

    // add cell content with json data
    url.textContent = certificate.url;
    expiryDate.textContent = certificate.validTo.substring(0,10);
    status.textContent = certificate.status;
    addRow.setAttribute('certificateId', certificate.id);

    // Expiration date calculation for visual notification
    const dateCalculate = Math.floor((expiryDateData - today) / (1000 * 60 * 60 * 24));

    // Visual notification based on the expiry date
    if (expiryDateData < today) {
      // Certificate has expired
      addRow.classList.add('danger');
    } else if (dateCalculate < 14) {
      // Expiring within 2 weeks (less than 14 days)
      addRow.classList.add('warning');
    } else if (dateCalculate < 42) {
      // Expiring within 6 weeks (less than 42 days)
      addRow.classList.add('info');
    } else {
      // else (more than 6 weeks remaining)
      addRow.classList.add('success');
    }

  });
}

// Function call to fetch all the list of certificates in the database
fetchTableData();

// handling form submission (fetching POST request)
const form = document.querySelector('#submitUrl');
form.addEventListener('click', function (e) {
  e.preventDefault();

  const userInput = document.querySelector("#userInputUrl").value;

  addFetch(userInput);

});

// POST request to API for sending URL to the backend
function addFetch(userInputUrl){
  let apiUrl = "/api/certificates/add";

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify({ url: userInputUrl })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log('Error:', error)
    })
}