import { togglePasswordView, authenticationSubmit, displayServerErrorMessages, displaySuccessMessages } from "./module.js";


const passwordIcon = document.querySelector("#show-resetPassword");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("resetPassword", passwordIcon, "show-resetPassword-text");
});
const passwordConfirmIcon = document.querySelector("#show-password-confirm");
passwordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("password-confirm", passwordConfirmIcon, "show-password-confirm-text");
});

const resetPasswordForm = document.querySelector('#reset-password-form');
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
        body: JSON.stringify(passwordInfoWithToken.resetPassword)
      });
      const data = await response.json();
      if(!response.ok){
        displayServerErrorMessages('reset-password-form', data.message);
        // "Something went wrong, please check your passwords"
      } else{
        displaySuccessMessages('reset-password-form', "Your password is successfully changed");
        document.querySelector("#resetPassword").value = ""
        document.querySelector("#password-confirm").value = ""
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (profile, changing password):", error);
    }
  }


  