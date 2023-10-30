const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

const mockedData = require('../mockedData.json');
const { Assertion } = require('chai');

class RegistrationTests extends BasePage {
    // Test validation error messages for required input field
    async requiredInput_test(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));
        submitBtn.click();

        let fnameError = await driver.findElement(By.xpath('//*[@id="fname-error"]/span')).getText();
        if(!fnameError.includes("This field is required.")){
            console.log('Fail, fname required input');
            result = false;
        }

        let lnameError = await driver.findElement(By.xpath('//*[@id="lname-error"]/span')).getText();
        if(!lnameError.includes("This field is required.")){
            console.log('Fail, lname required input');
            result = false;
        }

        let telError = await driver.findElement(By.xpath('//*[@id="tel-error"]/span')).getText();
        if(!telError.includes("This field is required.")){
            console.log('Fail, tel required input');
            result = false;
        }

        let emailError = await driver.findElement(By.xpath('//*[@id="email-error"]/span')).getText();
        if(!emailError.includes("Please enter a valid email address.")){
            console.log('Fail, email required input');
            result = false;
        }

        let passwordError = await driver.findElement(By.xpath('//*[@id="password-error"]/span')).getText();
        if(!passwordError.includes("Password must be between 6 and 12 characters and contain at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password required input');
            result = false;
        }

        return result;

    }

    // Test validation error messages for first name input field
    async fnameRuleValidation(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));

        // Test correct error message is displaying for when the input is less than 2 characters
        const fnameInputField = driver.findElement(By.xpath('//*[@id="fname"]'));
        fnameInputField.sendKeys("j");

        submitBtn.click();

        let fnameError = await driver.findElement(By.xpath('//*[@id="fname-error"]/span')).getText();
        if(!fnameError.includes("Please enter at least 2 characters.")){
            console.log('Fail, at least 2 characters');
            result = false;
        }

        fnameInputField.clear();

        // Test correct error message is displaying for when the input is not letters
        fnameInputField.sendKeys("1234");
        submitBtn.click();

        fnameError = await driver.findElement(By.xpath('//*[@id="fname-error"]/span')).getText();
        if(!fnameError.includes("Letters only please.")){
            console.log('Fail, Letters only');
            result = false;
        }
        return result;
    }

    async lnameRuleValidation(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));

        // Test correct error message is displaying for when the input is less than 2 characters
        const lnameInputField = driver.findElement(By.xpath('//*[@id="lname"]'));
        lnameInputField.sendKeys("j");

        submitBtn.click();

        let lnameError = await driver.findElement(By.xpath('//*[@id="lname-error"]/span')).getText();
        if(!lnameError.includes("Please enter at least 2 characters.")){
            console.log('Fail, at least 2 characters');
            result = false;
        }

        lnameInputField.clear();

        // Test correct error message is displaying for when the input is not letters
        lnameInputField.sendKeys("1234");
        submitBtn.click();

        lnameError = await driver.findElement(By.xpath('//*[@id="lname-error"]/span')).getText();
        if(!lnameError.includes("Letters only please.")){
            console.log('Fail, Letters only');
            result = false;
        }
        return result;
    }

    // Test validation error messages for tel input field
    async telRuleValidation(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));


        // Test correct error message is displaying for when the  input it not a number
        const telInputField = driver.findElement(By.xpath('//*[@id="tel"]'));
        telInputField.sendKeys("j");

        submitBtn.click();

        let telError = await driver.findElement(By.xpath('//*[@id="tel-error"]/span')).getText();
        if(!telError.includes("Please specify a valid phone number.")){
            console.log('Fail, tel validation');
            result = false;
        }

        return result;
    }

    // Test validation error messages for email input field
    async emailRuleValidation(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));

        // Test correct error message is displaying for when the input it not a valid email format
        const emailInputField = driver.findElement(By.xpath('//*[@id="email"]'));
        emailInputField.sendKeys("1@1.1");

        submitBtn.click();

        let emailError = await driver.findElement(By.xpath('//*[@id="email-error"]/span')).getText();
        if(!emailError.includes("Please enter a valid email address.")){
            console.log('Fail, email validation');
            result = false;
        }

        return result;
    }

    // Test validation error messages for new password input field
    async passwordRuleValidation(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));


        // Test correct error message is displaying for when password length is less than 6
        const passwordInputField = driver.findElement(By.xpath('//*[@id="password"]'));
        passwordInputField.sendKeys("a!1aa");

        submitBtn.click();

        let passwordError = await driver.findElement(By.xpath('//*[@id="password-error"]/span')).getText();
        if(!passwordError.includes("must be between 6 and 12 characters and contain at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password validation length');
            result = false;
        }

        // Test correct error message is displaying for when password length is at least 6 and does not contain number
        passwordInputField.clear();
        passwordInputField.sendKeys("aaaaa!");
        
        submitBtn.click();

        passwordError = await driver.findElement(By.xpath('//*[@id="password-error"]/span')).getText();
        if(!passwordError.includes("must be between 6 and 12 characters and contain at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password validation number');
            result = false;
        }

        // Test correct error message is displaying for when password length is at least 6 and does not contain speical character
        passwordInputField.clear();
        passwordInputField.sendKeys("aaaaa1");
        
        submitBtn.click();
        
        passwordError = await driver.findElement(By.xpath('//*[@id="password-error"]/span')).getText();
        if(!passwordError.includes("must be between 6 and 12 characters and contain at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, password validation special character');
            result = false;
        }
        
        
        return result;
    }

        // Test validation error messages for passwordconfirm input field
        async passwordconfirmRuleValidation(){
            let result = true;

            const submitBtn = await driver.findElement(By.xpath('//*[@id="register_form"]/input[1]'));
    
            // Valid new password in the input field
            const passwordInputField = driver.findElement(By.xpath('//*[@id="password"]'));
            passwordInputField.sendKeys("1234a!");

            // Test if password length is less than 6
            const passwordconfirmInputField = driver.findElement(By.xpath('//*[@id="passwordconfirm"]'));
            passwordconfirmInputField.sendKeys("1234a");

            submitBtn.click();
            let passwordconfirmError = await driver.findElement(By.xpath('//*[@id="passwordconfirm-error"]/span')).getText();
            if(!passwordconfirmError.includes("Please enter the same value again.")){
                console.log('Fail, password confirm validation');
                result = false;
            }

            return result;
        }

}

module.exports = new RegistrationTests;