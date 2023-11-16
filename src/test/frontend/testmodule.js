// sign out functionality
export function signOut(){
    const signOutBtn = document.querySelector(`.signOut`);
    signOutBtn.addEventListener('click', ()=>{
        let signOutConfirmation = confirm("Are you signing out?");
        if (signOutConfirmation){
            
            // call sign out api here

            // redirect user to landing page if signed out.
            location.href="./certificate-tracker.html";
        }
        
    })
    
}


// overlay panel navigation for signed in user 
export function userBtn(){
    const openOverlayBtn = document.getElementById('open-user-overlay-btn');
    const closeOverlayBtn = document.getElementById('close-user-overlay-btn');
    const overlay = document.getElementById('user-overlay');

    const userName = getCookie('userName');
    openOverlayBtn.textContent = `Hi, ${userName}`;

    openOverlayBtn.addEventListener('click', function () {
        overlay.style.display = 'block';
    });

    closeOverlayBtn.addEventListener('click', function () {
        overlay.style.display = 'none';
    });
    
    window.addEventListener('click', function (event) {
        if (event.target !== overlay && !overlay.contains(event.target) && event.target !== openOverlayBtn) {
            overlay.style.display = 'none';
        }
    });
}


// to set cookie
export function setCookie(name, value){
    const cookieExpires = "";
    document.cookie = name + "=" + (value || "");
  }
  
// to get the cookie
export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

// generic form behavior for sign in, registration, password change (relevant to authentication)
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
            
            apiCallBack(formJsonData);
        }       
    });
}

// takes id name of the password input field and the show password icon elemet.
// it switches icon between eye-opn and eye closed and show and hide password.
export function togglePasswordView(passwordInputId, icon, sr){
    const passwordInputField = document.querySelector(`#${passwordInputId}`);
    const showPasswordSr = document.querySelector(`#${sr}`);

    if (passwordInputField.type === "password") {
        passwordInputField.type = "text";
        icon.classList.remove("glyphicon-eye-open");
        icon.classList.add("glyphicon-eye-close");
        showPasswordSr.textContent = "hide password";
    } else {
        passwordInputField.type = "password";
        icon.classList.remove("glyphicon-eye-close");
        icon.classList.add("glyphicon-eye-open");
        showPasswordSr.textContent = "show password";
    }
}

// Display error message depending on the corresponding server-side error
// matches the WET form validation plugin error message
export function displayErrorMessages(formId, error) {

    if (error) {
      const errorSection = document.createElement('section');
      errorSection.classList.add('alert', 'alert-danger', 'server-error');
  
      errorSection.setAttribute('tabindex', '-1');
  
      const h2 = document.createElement('h2');
      h2.textContent = 'There was an error with your request';
  
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = `#error-test`;
      anchor.textContent = `Error test: ${error.message}`;
      li.appendChild(anchor);
      ul.appendChild(li);
  
      errorSection.appendChild(h2);
      errorSection.appendChild(ul);
  
      // Insert the error section before the form
      const form = document.getElementById(`${formId}`);
      form.insertBefore(errorSection, form.firstChild);
    }
  }
  
  // Clear (remove the server error element) server error messages
  export function clearServerErrorMessage(){
    const serverErrorSection = document.querySelector('.server-error');
    if (serverErrorSection) {
      serverErrorSection.remove();
    }
  }


// set multiple attributes in key, value pairs
export function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}