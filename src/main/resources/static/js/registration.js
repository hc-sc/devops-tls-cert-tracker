import {authenticationSubmit, togglePasswordView, displayServerErrorMessages} from "./module.js";

// form submit will trigger validation, if no there are no errors, sbumit the form
const registrationForm = document.querySelector("#register-form");



authenticationSubmit(registrationForm, fetctRegister);


// let testData = authenticationSubmit(registrationForm);
// console.log(testData);
// if(testData){
//   fetctRegister(testData);
// }
// function register(data=null){

//     // call api to destroy access token and redirect user to page displaying you are now sig
//     console.log("You are successfully registered")

//     // location.href = "./#";
// }

const passwordIcon = document.querySelector("#show-password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon,"show-password-text");
});

const passwordConfirmIcon = document.querySelector("#show-password-confirm");
passwordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("password-confirm", passwordConfirmIcon, "show-password-confirm-text");
});

// Calling backend API for registration
async function fetctRegister(registrationInfo) {
    
    let apiUrl = "/api/auth/register"
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(registrationInfo)
      });
      const data = await response.json();
      if(!response.ok){

        displayServerErrorMessages(data.error);
        throw data;

      } else {
        console.log(data);
        if (data.message){
            // location.href = "./signin.html";
        }
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (registration):", error);
    }
  }