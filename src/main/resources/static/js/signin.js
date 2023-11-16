import {setCookie, authenticationSubmit, togglePasswordView, displayServerErrorMessages, refreshTokenPageRedirection, clearForm} from "./module.js";

refreshTokenPageRedirection('./dashboard.html');


const signinForm = document.querySelector("#signin-form");

// dynamically interact with form to clear messages
clearForm(signinForm)

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
        if(data.status == 401){
          displayServerErrorMessages('signin-form', "Please, check if you have correct email and password.");
        } else if(data.status == 403){
          displayServerErrorMessages('signin-form', "Please verify your email before sign in"); 
        } else {
          displayServerErrorMessages('signin-form', `${data.status} + "Internal Server Error"`); 
        }
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