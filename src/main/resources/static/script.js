'user strict';
const toggleLogin = document.querySelector('.login-toggle-btn');
const toggleRegister = document.querySelector('.register-toggle-btn');
const loginForm = document.querySelector('.login-form');
const registrationForm = document.querySelector('.registration-form');

toggleLogin.addEventListener('click', function () {
  loginForm.style.right = '3rem';
  registrationForm.style.left = '35rem';
  toggleLogin.classList.add('bg-color');
  toggleRegister.classList.remove('bg-color');
});
toggleRegister.addEventListener('click', function () {
  loginForm.style.right = '35rem';
  registrationForm.style.left = '3rem';
  toggleLogin.classList.remove('bg-color');
  toggleRegister.classList.add('bg-color');
});
