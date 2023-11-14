import {authenticationSubmit, displaySuccessMessages, displayServerErrorMessages} from './module.js'

const forgotPasswordForm = document.querySelector('#recovery-email-form')

authenticationSubmit(forgotPasswordForm, fetchPasswordRecovery);

// Calling backend API for sign in
async function fetchPasswordRecovery(emailData) {
    let apiUrl = "/api/auth/password-reset-request"
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(emailData)
      });
      if(!response.ok ||response.ok){
        displaySuccessMessages('recovery-email-form', "Recovery Email has send to you.");
        throw data;
      }
    } catch (error) {
      console.error("Error fetching JSON data (password recovery):", error);
    }
  }