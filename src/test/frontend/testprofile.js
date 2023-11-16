import {userBtn, togglePasswordView, authenticationSubmit} from "./testmodule.js";

userBtn();



const currentpasswordIcon = document.querySelector("#show-current-password");
currentpasswordIcon.addEventListener("click", () => {
    togglePasswordView("current-password", currentpasswordIcon, "show-current-password-text");
});
const newpasswordIcon = document.querySelector("#show-new-password");
newpasswordIcon.addEventListener("click", () => {
    togglePasswordView("new-password", newpasswordIcon, "show-new-password-text");
});

const mewpasswordConfirmIcon = document.querySelector("#show-new-password-confirm");
mewpasswordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("new-password-confirm", mewpasswordConfirmIcon, "show-new-password-confirm-text");
});


// Calling backend API for registration
async function fetctRegister(data) {
    
    apiUrl = "/api/certificates/auth/change-password"
  
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
        const registrationResult = confirm("Your password has successfully changed.");
        if (registrationResult){
            location.href = "./signin.html";
        }
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (get all):", error);
    }
  }