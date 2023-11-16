import { authenticationSubmit, togglePasswordView, displayServerErrorMessages, refreshTokenPageRedirection, clearForm, refreshToken } from "./module.js";

// Protecting the page and redirecting the user to correct page depending on user status (signed in, or not signed in)
refreshTokenPageRedirection('./dashboard.html');


const signinForm = document.querySelector("#signin-form");

// Dynamically clears any server messages
clearForm(signinForm)

// Preventing default form submission, and fetch from the endpoint
authenticationSubmit(signinForm, fetchSignIn);

// Adding functioanlity to show password feature
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
        // If the user is successfully signed in, save user info in local storage
        localStorage.setItem('user', JSON.stringify(data));
        // and redirect the user to the dashboard page
        location.href = "./dashboard.html";
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (Sign in):", error);
    }
  }