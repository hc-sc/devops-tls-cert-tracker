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