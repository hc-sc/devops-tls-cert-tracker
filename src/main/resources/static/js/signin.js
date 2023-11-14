import {setCookie, authenticationSubmit, togglePasswordView, displayServerErrorMessages, refreshTokenPageRedirection} from "./module.js";

refreshTokenPageRedirection('./dashboard.html');

const signinForm = document.querySelector("#signin-form");

authenticationSubmit(signinForm, fetchSignIn);

const passwordIcon = document.querySelector("#show-password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon, "show-password-text");
});


// Calling backend API for sign in
async function fetchSignIn(signinData) {
    let apiUrl = "/api/auth/signin"
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(signinData)
      });
      const data = await response.json();
      if(!response.ok){
        displayServerErrorMessages('signin-form', data.message);
        throw data;

      } else {
        setCookie('userFirstName', data.firstname);
        setCookie('userLastName', data.lastname);
        setCookie('userEmail', data.email);
        location.href = "./dashboard.html";
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (Sign in):", error);
    }
  }