import {authenticationSubmit, displaySuccessMessages, displayServerErrorMessages} from './module.js'

const forgotPasswordForm = document.querySelector('#recovery-email-form');

authenticationSubmit(forgotPasswordForm, fetchPasswordRecovery);

// i18n
var passwordRecovery2PageLanguage = document.documentElement.lang;
var recoveryEmailString, recoveryDestinationURL;
switch (passwordRecovery2PageLanguage) {
    case "en":
        recoveryEmailString = "Recovery email has sent to you ";
        recoveryDestinationURL = "/password-recovery-verification.html";
        break;
    case "fr":
        recoveryEmailString = "Un courriel de récupération vous a été envoyé ";
        recoveryDestinationURL = "/recuperation-vertification.html";
        break;
    default:
        recoveryEmailString = "Recovery email has sent to you ";

}

// Calling backend API for sign in
async function fetchPasswordRecovery(emailData) {
    let apiUrl = "/api/auth/password-reset-request";
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(emailData)
      });
      if(!response.ok ||response.ok){
        displaySuccessMessages('recovery-email-form', `(${recoveryEmailString}) (${emailData.email}).`);
        location.href = ${recoveryDestinationURL};
      }
    } catch (error) {
      console.error("Error fetching JSON data (password recovery):", error);
    }
}