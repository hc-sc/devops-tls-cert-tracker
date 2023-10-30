// common behavour of the submit button for sign in and registration

export function authenticationSubmit(form, apiCallBack){
    
    form.addEventListener('submit', function(e) {
        
        e.preventDefault();

        // Check the validity of the form with jQeury (which WET-boew utilizes for its form validation) to see if the form is ready to call the api
        if(!$(this).valid()){
            return ;
        } else {
            
            // Convert form data into JSON data
            const formData = new FormData(this);
            const formJsonData = {};
    
            formData.forEach(function(value, key) {
                formJsonData[key] = value;
            });
            console.log(formJsonData);
        }
        
        apiCallBack();
   
    });
}

// takes id name of the password input field and the show password icon elemet.
// it switches icon between eye-opn and eye closed and show and hide password.
export function togglePasswordView(passwordInputId, icon){
    const passwordInputField = document.querySelector(`#${passwordInputId}`);

    if (passwordInputField.type === "password") {
        passwordInputField.type = "text";
        icon.classList.remove("glyphicon-eye-open");
        icon.classList.add("glyphicon-eye-close");
    } else {
        passwordInputField.type = "password";
        icon.classList.remove("glyphicon-eye-close");
        icon.classList.add("glyphicon-eye-open");
    }
}