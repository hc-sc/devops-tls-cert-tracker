import { displayServerErrorMessages, clearForm, clearServerMessage} from './module.js'

const forgotPasswordCodeForm = document.querySelector('#recovery-code-form');
const passwordRecoveryCodeError = document.querySelector('#password-recovery-code-error');

clearForm(forgotPasswordCodeForm);
// generic form behavior for sign in, registration, password change (relevant to authentication)

forgotPasswordCodeForm.addEventListener('submit', async function(e) { 
  clearServerMessage();

  // Prevent the form submission initially
  e.preventDefault();

  // Check the validity of the form with jQuery (which WET-boew utilizes for its form validation)
  // to see if the form is ready to call the API
  if (!$(this).valid()) {
    return;
  }

  const recoveryCode = this.code.value;

  let codeValidation = await fetchValidatePasswordRecoveryCode(recoveryCode);

  // If codeValidation is true, manually submit the form
  if (codeValidation) {
    this.submit();
  }
});

// Calling backend API for sign in
async function fetchValidatePasswordRecoveryCode(code) {
    let apiUrl = `/api/auth/validate-password-code?code=${code}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json"
        },
      });
      const data = await response.json();
      if(!response.ok){
        if(data.message.includes("Invalid")){
          displayServerErrorMessages("recovery-code-form", "Invalid code, please check your code again.");
          console.log(data);
        } else {
          displayServerErrorMessages("password-recovery-code-error", "Your code might have expired, please try again by sending new recovery email.");
          passwordRecoveryCodeError.classList.remove("hidden");
          forgotPasswordCodeForm.classList.add("hidden");
        }
        return false;
      } else{
        return true;
      }
    } catch (error) {
      console.error("Error fetching JSON data (password recovery):", error);
    }
  }