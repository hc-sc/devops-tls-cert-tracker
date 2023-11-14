import {authenticationSubmit, togglePasswordView} from "./testmodule.js";

// form submit will trigger validation, if no there are no errors, sbumit the form
const registrationForm = document.querySelector("#register-form");

authenticationSubmit(registrationForm, register)

function register(data=null){

    // call api to destroy access token and redirect user to page displaying you are now sig
    console.log("You are successfully registered")

    // location.href = "./#";
}

const passwordIcon = document.querySelector("#show-password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon,"show-password-text");
});

const passwordConfirmIcon = document.querySelector("#show-password-confirm");
passwordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("password-confirm", passwordConfirmIcon, "show-password-confirm-text");
});

// Calling backend API for registration
async function fetctRegister(data) {
    
    apiUrl = "/api/certificates/auth/register"
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({data})
      });
      const data = await response.json();
      if(!response.ok){
        displayErrorMessages(data.error);
        throw data;

      } else {
        const registrationResult = confirm("You are successfully registered");
        if (registrationResult){
            location.href = "./signin.html";
        }
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (get all):", error);
    }
  }