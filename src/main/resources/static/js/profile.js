import { userBtn, togglePasswordView, authenticationSubmit, displayServerErrorMessages, displaySuccessMessages, signOut, refreshToken, clearForm } from "./module.js";

// Call refresh token to renew the accesstoken if the user hasn't signed out yet
refreshToken();

// Adding functionality to user button overlay
userBtn();

// Adding functionality to sign out link in user button over lay
signOut();

// Retrieve values from localstorage to fill some fileds in profile page
const userInfo = JSON.parse(localStorage.getItem('user'))
document.querySelector("#firstname").value = userInfo.firstname;
document.querySelector("#lastname").value = userInfo.lastname;
document.querySelector("#email").value = userInfo.email;

const passwordChangeForm = document.querySelector('#profile-change-password-form');

// Dynamically clears any server messages
clearForm(passwordChangeForm);

// Preventing default form submission, and fetch from the endpoint
authenticationSubmit(passwordChangeForm, fetctChangePassword);

// Adding functioanlity to show password feature
const currentpasswordIcon = document.querySelector("#show-current-password");
currentpasswordIcon.addEventListener("click", () => {
    togglePasswordView("currentPassword", currentpasswordIcon, "show-current-password-text");
});
const newpasswordIcon = document.querySelector("#show-new-password");
newpasswordIcon.addEventListener("click", () => {
    togglePasswordView("newPassword", newpasswordIcon, "show-new-password-text");
});

const newpasswordConfirmIcon = document.querySelector("#show-new-password-confirm");
newpasswordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("confirmationPassword", newpasswordConfirmIcon, "show-new-password-confirm-text");
});


// Calling backend API for registration
async function fetctChangePassword(passwordInfo) {
  
  // renew refresh token if access token is expired and user hasn't signed out
  await refreshToken();

  let apiUrl = "/api/users/change-password";
  try {
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(passwordInfo)
    });
    // const data = await response.json();
    if(!response.ok){
      displayServerErrorMessages('profile-change-password-form', "Something went wrong");
    } else{
      displaySuccessMessages('profile-change-password-form', "Your password has successfully changed");
      document.querySelector("#currentPassword").value = ""
      document.querySelector("#newPassword").value = ""
      document.querySelector("#confirmationPassword").value = ""
    }

  } catch (error) {
    console.error("Error fetching JSON data (profile, changing password):", error);
  }
}


