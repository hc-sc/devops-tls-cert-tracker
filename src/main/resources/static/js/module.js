// sign out functionality for sign out link on user button overlay
export function signOut(){
    const signOutBtn = document.querySelector(`.signOut`);
    signOutBtn.addEventListener('click', ()=>{
            
    // call sign out api here
    fetctSignOut();  
    })
}

// overlay panel navigation for signed in user 
export function userBtn(){
    const openOverlayBtn = document.getElementById('open-user-overlay-btn');
    const closeOverlayBtn = document.getElementById('close-user-overlay-btn');
    const overlay = document.getElementById('user-overlay');
    
    // const userFirstName = getCookie('userFirstName');
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if(userInfo !=null) {
      openOverlayBtn.textContent = `Hi, ${userInfo.firstname[0].toUpperCase() + userInfo.firstname.slice(1)}`;
    }

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
export function authenticationSubmit(form, api){
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        clearServerMessage()

        // Check the validity of the form with jQeury (which WET-boew utilizes for its form validation) to see if the form is ready to call the api
        if(!$(this).valid()){
            return ;
        } else {
        // Convert form data into JSON data
        const formData = new FormData(this);
        if(formData.has('password-confirm')){
          formData.delete('password-confirm');
        }
        
        const formJsonData = {};
        formData.forEach(function(key, value) {
            formJsonData[value] = key;
        });
        api(formJsonData);
            
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
export function displayServerErrorMessages(formId, error) {

    if (error) {
      const errorSection = document.createElement('section');
      errorSection.classList.add('alert', 'alert-danger', 'server-error');
  
      errorSection.setAttribute('tabindex', '-1');
  
      const h2 = document.createElement('h2');
      h2.textContent = 'There was an error with your request';
  
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.textContent = error;
      li.appendChild(anchor);
      ul.appendChild(li);
  
      errorSection.appendChild(h2);
      errorSection.appendChild(ul);
  
      // Insert the error section before the form
      const form = document.getElementById(`${formId}`);
      form.insertBefore(errorSection, form.firstChild);
    }
  }

  // Dynamically add corresponding html elements to show successful attempt message
  export function displaySuccessMessages(formId, message) {

    if (message) {
      const successSection = document.createElement('section');
      successSection.classList.add('alert', 'alert-success', 'server-success');
  
      successSection.setAttribute('tabindex', '-1');
  
      const h2 = document.createElement('h2');
      h2.textContent = `${message}`;
    
      successSection.appendChild(h2);
  
      // Insert the error section before the form
      const form = document.getElementById(`${formId}`);
      form.insertBefore(successSection, form.firstChild);
    }
  }

  
  // Clear (remove the server error element) server error messages
  export function clearServerMessage(){
    const serverErrorSection = document.querySelector('.server-error');
    const successMessageSection = document.querySelector('.server-success');
    if (serverErrorSection) {
        serverErrorSection.remove();
    }
    if (successMessageSection){
        successMessageSection.remove();
    }

  }

// set multiple attributes in key, value pairs
export function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

// Interact with sign out end point
async function fetctSignOut() {

    let apiUrl = "/api/auth/signout";
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
      });
      const data = await response.json();
      if(!response.ok){
        displayServerErrorMessages(data.error);
        throw data;
      } else {
        location.href="../index.html";
      }
    } catch (error) {
      console.error("Error fetching JSON data (Sign Out):", error);
    }
  }

  // Interact with refresh token end point to renew access token
  export async function refreshToken(){
        let apiUrl = "/api/auth/refreshtoken";
      
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': "application/json"
            },
          });
          const data = await response.json();
          if(!response.ok){
            location.href="../index.html";
          } else {
            // location.reload();
          }
        } catch (error) {
          console.error("Error fetching JSON data (Sign in):", error);
      }
  }

  // Interact with refresh token and redirect user depending on the result
  export async function refreshTokenPageRedirection(htmlPage){
    let apiUrl = "/api/auth/refreshtoken"
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
      });
      if(response.ok){
        location.href=`${htmlPage}`;
      }

    } catch (error) {
      console.error("Error fetching JSON data (refreshToken redirection):", error);
  }
}

// Dynamically listent to changes in authentication related forms and clear any server messages upon any changes being made to the form
export function clearForm(form){
  form.addEventListener('input', (event) => {
    if (event.target.tagName.toLowerCase() === 'input') {
      clearServerMessage();
    }
  });
}

