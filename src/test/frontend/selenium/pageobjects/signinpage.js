const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

class SigninPage extends BasePage {

    
    async clickSubmit(){
        await driver.findElement(By.xpath('//*[@id="signin-form"]/input[1]')).click();
    }


       // Test validation error messages for required input field
       async requiredInput_test(){
        let result = true;

        this.clickSubmit();
        await driver.sleep(1000);

        let emailError = await super.getTextById('email-error'); 
        if(!emailError.includes("This field is required.")){
            console.log('Fail, email required input');
            result = false;
        }

        let passwordError = await super.getTextById('password-error'); 
        if(!passwordError.includes("This field is required.")){
            console.log('Fail, password required input');
            result = false;
        }

        return result;

    }

    // Test if user can go to the registration from sign in page by clicking register link
    async navigateToRegistration(){
        
        // Find link to register and click
        const toRegistration = await driver.findElement(By.xpath('//*[@id="wb-auto-4"]/p/a'));
        toRegistration.click();
        await driver.sleep(1000);
        
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

        // Test if clicking exit button will redirect user to landing page
        async exit_button_test(){
            super.clickByXpath('//*[@id="signin-form"]/a');
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

module.exports = new SigninPage;