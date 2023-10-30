import {authenticationSubmit, togglePasswordView} from "./testauthentication.js";

// form submit will trigger validation, if no there are no errors, sbumit the form
const registrationForm = document.querySelector("#register_form");

authenticationSubmit(registrationForm, register)

function register(){

    // call api to destroy access token and redirect user to page displaying you are now sig
    console.log("You are successfully registered")

    // location.href = "./#";
}

const passwordIcon = document.querySelector("#show_password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon);
});

const passwordConfirmIcon = document.querySelector("#show_passwordconfirm");
passwordConfirmIcon.addEventListener("click", () => {
    togglePasswordView("passwordconfirm", passwordConfirmIcon);
});