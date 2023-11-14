const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

class RegistrationTests extends BasePage {

    async clickSubmit(){
        await driver.findElement(By.xpath('//*[@id="register-form"]/input[1]')).click();
    }



    // Test validation error messages for required input field
    async requiredInput_test(){
        let result = true;

        // const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));
        // submitBtn.click();
        this.clickSubmit();
        await driver.sleep(500);

        let fnameError = await super.getTextById("firstname-error");
        if(!fnameError.includes("This field is required.")){
            console.log('Fail, fname required input');
            result = false;
        }

        let lnameError = await super.getTextById("lastname-error");
        if(!lnameError.includes("This field is required.")){
            console.log('Fail, lname required input');
            result = false;
        }

        // let telError = await super.getTextById("tel-error");
        // if(!telError.includes("This field is required.")){
        //     console.log('Fail, tel required input');
        //     result = false;
        // }

        let emailError = await super.getTextById("email-error");
        if(!emailError.includes("This field is required.")){
            console.log('Fail, email required input');
            result = false;
        }

        let passwordError = await super.getTextById("password-error");
        if(!passwordError.includes("Password must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password required input');
            result = false;
        }

        let passwordConfirmError = await super.getTextById("password-confirm-error");
        if(!passwordConfirmError.includes("This field is required.")){
            console.log('Fail, password confirm required input');
            result = false;
        }

        return result;

    }

    // Test validation error messages for first name input field
    async nameRuleValidation(id){
        let result = true;

        // Test correct error message is displaying for when the input is less than 2 characters
        // const fnameInputField = driver.findElement(By.xpath('//*[@id="fname"]'));
        // fnameInputField.sendKeys("j");
        super.enterInputById(id, "j");
        this.clickSubmit();
        await driver.sleep(500);

        let nameError = await super.getTextById(`${id}-error`);
        if(!nameError.includes("Please enter at least 2 characters.")){
            console.log('Fail, at least 2 characters');
            result = false;
        }

        super.clearsInputById(id);

        // Test correct error message is displaying for when the input is not letters
        super.enterInputById(id, "1234");
        this.clickSubmit();
        await driver.sleep(500);

        nameError = await super.getTextById(`${id}-error`);
        if(!nameError.includes("Letters only please.")){
            console.log('Fail, Letters only');
            result = false;
        }
        return result;
    }

    // Test validation error messages for tel input field
    async telRuleValidation(){
        let result = true;

        // Test correct error message is displaying for when the  input it not a number
        super.enterInputById("tel", "1234");

        this.clickSubmit();
        await driver.sleep(500);

        let telError = await super.getTextById(`tel-error`);
        if(!telError.includes("Please specify a valid phone number.")){
            console.log('Fail, tel validation');
            result = false;
        }

        return result;
    }

    // Test validation error messages for email input field
    async emailRuleValidation(){
        let result = true;

        // Test correct error message is displaying for when the input it not a valid email format
        super.enterInputById("email", "1@1.1");

        this.clickSubmit();
        await driver.sleep(500);

        let emailError = await super.getTextById(`email-error`);
        if(!emailError.includes("Invalid format.")){
            console.log('Fail, email validation');
            result = false;
        }

        return result;
    }

    // Test validation error messages for new password input field
    async passwordRuleValidation(){
        let result = true;

        // Test correct error message is displaying for when password length is less than 6
        super.enterInputById("password", "a!1aa");

        this.clickSubmit();
        await driver.sleep(500);

        let passwordError = await super.getTextById(`password-error`);
        if(!passwordError.includes("must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password validation length');
            result = false;
        }

        // Test correct error message is displaying for when password length is at least 6 and does not contain number
        super.clearsInputById("password")
        super.enterInputById("password", "aaaaa!");

        this.clickSubmit();
        await driver.sleep(500);

        passwordError = await super.getTextById(`password-error`);
        if(!passwordError.includes("must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password validation number');
            result = false;
        }

        // Test correct error message is displaying for when password length is at least 6 and does not contain speical character
        super.clearsInputById("password")
        super.enterInputById("password", "aaaaa1");
        
        this.clickSubmit();
        await driver.sleep(500);
        
        passwordError = await super.getTextById(`password-error`);
        if(!passwordError.includes("must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password validation special character');
            result = false;
        }
        
        
        return result;
    }

    // Test validation error messages for passwordconfirm input field
    async passwordconfirmRuleValidation(){
        let result = true;

        // Valid new password in the input field
        super.enterInputById("password", "1234a!");
        
        // set different password in the password confirm field for testing purpose
        super.enterInputById("password-confirm", "1234a");
   
        this.clickSubmit();
        await driver.sleep(500);

        let passwordconfirmError = await super.getTextById(`password-confirm-error`);
        if(!passwordconfirmError.includes("Please enter the same value again.")){
            console.log('Fail, password confirm validation');
            result = false;
        }
        return result;
    }

    async user_button_to_profile_test(){
        super.clickById('open-user-overlay-btn');
        await driver.sleep(500);
        super.clickByXpath('//*[@id="user-overlay"]/ul/li[1]/a');
        await driver.sleep(500);
        
        //get text from additional information
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("profile.html")){
            console.log("Success, you are redirected to profile page")
            return true;
        } else {
            console.log("Fail, you are not redirected to profile page")
            return false;
        }

    }
    // Test if clicking exit button will redirect user to landing page
    async exit_button_test(){
        super.clickByXpath('//*[@id="register-form"]/a');

        await driver.sleep(500);
        
        //get text from additional information
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("certificate-tracker.html")){
            console.log("Success, you are redirected to landing page")
            return true;
        } else {
            console.log("Fail, you are not redirected to landing page")
            return false;
        }

    }

}

module.exports = new RegistrationTests;