import {authenticationSubmit, togglePasswordView} from "./testauthentication.js";

const signinForm = document.querySelector("#signin_form");

authenticationSubmit(signinForm, signIn);

function signIn(){

    // call api to destroy access token and redirect user to page displaying you are now sig
    console.log("you are successfully signed in")

    location.href = "./index.html";
}

const passwordIcon = document.querySelector("#show_password");
passwordIcon.addEventListener("click", () => {
    togglePasswordView("password", passwordIcon);
});