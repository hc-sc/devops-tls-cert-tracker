import { togglePasswordView, authenticationSubmit, displayServerErrorMessages, displaySuccessMessages, clearForm } from "./module.js";


// Adding functioanlity to show password feature
const passwordIcon = document.querySelector("#show-newPassword");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("newPassword", passwordIcon, "show-newPassword-text");
});
const passwordConfirmIcon = document.querySelector("#show-password-confirm");
passwordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("password-confirm", passwordConfirmIcon, "show-password-confirm-text");
});

const resetPasswordForm = document.querySelector('#reset-password-form');
const errorPasswordReset = document.querySelector('#password-reset-error');
const successPasswordReset = document.querySelector('#password-reset-success');

// Dynamically clears any server messages
clearForm(resetPasswordForm);

// Preventing default form submission, and fetch from the endpoint
authenticationSubmit(resetPasswordForm, fetchResetPassword);

// Create a URLSearchParams object from the query string of the URL
const urlParams = new URLSearchParams(new URL(window.location.href).search);

// Get the value of the 'code' parameter from the query string
const code = urlParams.get('code');

// Calling backend API for registration
async function fetchResetPassword(passwordInfo) {
  
  // code is retrieved from this JavaScript page not module.js
  let apiUrl = `/api/auth/password-reset?token=${code}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({ newPassword: passwordInfo.newPassword })
    });
    const data = await response.json();
    if(!response.ok){
      resetPasswordForm.classList.add("hidden");
      displayServerErrorMessages('password-reset-error', data.message);
      errorPasswordReset.classList.remove("hidden");
      
    } else{
      resetPasswordForm.classList.add("hidden");
      displaySuccessMessages('password-reset-success', "Your password has successfully changed");
      successPasswordReset.classList.remove("hidden");
      document.querySelector("#newPassword").value = ""
      document.querySelector("#password-confirm").value = ""
    }

  } catch (error) {
    console.error("Error fetching JSON data (reset password):", error);
  }
}


  