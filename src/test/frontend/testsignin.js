import {authenticationSubmit, togglePasswordView, displayErrorMessages, clearServerErrorMessage} from "./testmodule.js";

const data = {
    user : [{
        'id': 1,
        'email': 'example@example.com',
        'fname': 'Jay',
        'lname': 'Lee'
    }]
}

function setCookie(name, value){
    const cookieExpires = "";
    document.cookie = name + "=" + (value || "");
  }

const signinForm = document.querySelector("#signin-form");

authenticationSubmit(signinForm, signIn);

function signIn(signinData){
    const response = true;
    // call api to destroy access token and redirect user to page displaying you are now sig
    console.log("you are successfully signed in")
    if(response){
        setCookie("userName", data.user[0].fname);
    }

    location.href = "./index.html";
}

const passwordIcon = document.querySelector("#show-password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon, "show-password-text");
});


// Calling backend API for sign in
async function fetctSignIn(data) {
    
    apiUrl = "/api/certificates/auth/sign-in"
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({data})
      });
      const data = await response.json();
      if(!response.ok){
        displayErrorMessages(data.error);
        throw data;

      } else {
        location.href = "./index.html";
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (get all):", error);
    }
  }