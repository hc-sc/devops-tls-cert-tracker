import {authenticationSubmit, togglePasswordView, displayServerErrorMessages, displaySuccessMessages, clearForm} from "./module.js";

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

        displayServerErrorMessages("register-form", data.message);
        throw data;

      } else {
        registrationForm.classList.add("hidden");
        displaySuccessMessages("registration-success", "Verification email has sent to your email address, please verify your email to sign in.")
        successRegistrationContainer.classList.remove("hidden");
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (registration):", error);
    }
  }