import {authenticationSubmit, togglePasswordView, displayServerErrorMessages, displaySuccessMessages, clearForm} from "./module.js";

// i18n

var registrationPageLanguage = document.documentElement.lang;
var emailSuccess;
switch (registrationPageLanguage) {
    case "en":
        emailSuccess = "An email has been sent to you with a link to verify your email address.";
        break;
    case "fr":
        emailSuccess = "Un courriel vous a été envoyé avec un lien pour vérifier votre adresse courriel.";
        break;
    default:
        emailSuccess = "An email has been sent to you with a link to verify your email address.";
}

// form submit will trigger validation, if no there are no errors, sbumit the form
const registrationForm = document.querySelector("#register-form");
const successRegistrationContainer = document.querySelector('#registration-success');

// Dynamically interact with form to clear messages
clearForm(registrationForm);

// Preventing default form submission, and fetch from the endpoint
authenticationSubmit(registrationForm, fetchRegister);

// Adding functioanlity to show password feature
const passwordIcon = document.querySelector("#show-password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon,"show-password-text");
});

const passwordConfirmIcon = document.querySelector("#show-password-confirm");
passwordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("password-confirm", passwordConfirmIcon, "show-password-confirm-text");
});


// Calling backend API for registration
async function fetchRegister(registrationInfo) {
    
    let apiUrl = "/api/auth/register";
  
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

        displayServerErrorMessages("register-form", data.message);
        throw data;

      } else {
        registrationForm.classList.add("hidden");
        displaySuccessMessages("registration-success", ${emailSuccess} )
        successRegistrationContainer.classList.remove("hidden");
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (registration):", error);
    }
  }