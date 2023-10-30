const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

const mockedData = require('../mockedData.json');

class SigninPage extends BasePage {
       // Test validation error messages for required input field
       async requiredInput_test(){
        let result = true;

        const submitBtn = await driver.findElement(By.xpath('//*[@id="signin_form"]/input[1]'));
        submitBtn.click();

        let emailError = await driver.findElement(By.xpath('//*[@id="email-error"]/span')).getText();
        if(!emailError.includes("This field is required.")){
            console.log('Fail, fname required input');
            result = false;
        }

        let passwordError = await driver.findElement(By.xpath('//*[@id="password-error"]/span')).getText();
        if(!passwordError.includes("This field is required.")){
            console.log('Fail, lname required input');
            result = false;
        }

        return result;

    }

    // Test if user can go to the registration from sign in page by clicking register link
    async navigateToRegistration(){

        const toRegistration = await driver.findElement(By.xpath('//*[@id="wb-auto-5"]/p/a'));
        toRegistration.click();
        
        //get the current url and see if it's registration page
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("registration.html")){
            console.log("Success, you are redirected to registration page")
            return true;
        } else {
            console.log("Fail, you are not redirected to registration page")
            return false;
        }
    }
}

module.exports = new SigninPage;