import {userBtn, getCookie, togglePasswordView, authenticationSubmit, displayServerErrorMessages, displaySuccessMessages, signOut, refreshToken} from "./module.js";
refreshToken();
userBtn();
signOut();

document.querySelector("#firstname").value = getCookie("userFirstName");
document.querySelector("#lastname").value = getCookie("userLastName");
document.querySelector("#email").value = getCookie("userEmail");

const passwordChangeForm = document.querySelector('#profile-change-password-form');
authenticationSubmit(passwordChangeForm, fetctChangePassword);


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
  refreshToken();
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
      displaySuccessMessages('profile-change-password-form', "Your password is successfully changed");
      document.querySelector("#currentPassword").value = ""
      document.querySelector("#newPassword").value = ""
      document.querySelector("#confirmationPassword").value = ""
    }

  } catch (error) {
    console.error("Error fetching JSON data (profile, changing password):", error);
  }
}


