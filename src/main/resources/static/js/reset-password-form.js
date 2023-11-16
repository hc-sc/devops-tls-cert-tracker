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


// Calling backend API for registration
async function fetchResetPassword(passwordInfoWithToken) {
    let apiUrl = `/api/auth/password-reset?token=${passwordInfoWithToken.token}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({ newPassword: passwordInfoWithToken.newPassword })
      });
      // const data = await response.json();
      if(!response.ok){
        resetPasswordForm.classList.add("hidden");
        displayServerErrorMessages('password-reset-error', "Your link for resetting the password might have expired.");
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


  