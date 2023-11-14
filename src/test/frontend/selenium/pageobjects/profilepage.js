const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

class ProfilePage extends BasePage {
    
    async clickSubmit(){
        await driver.findElement(By.xpath('//*[@id="recovery-email-form"]/input')).click();
    }

    // Test validation error messages for required input field
    async requiredInput_test(){
        let result = true;

        this.clickSubmit();
        await driver.sleep(1000);  

        let currentPasswordError = await super.getTextById('current-password-error'); 
        if(!currentPasswordError.includes("This field is required.")){
            console.log('Fail, current-password-error required input');
            result = false;
        }

        let newPasswordError = await super.getTextById('new-password-error'); 
        if(!newPasswordError.includes("Password must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, ew-password-error required input');
            result = false;
        }

        let newPasswordConfirmError = await super.getTextById('new-password-confirm-error'); 
        if(!newPasswordConfirmError.includes("This field is required.")){
            console.log('Fail, new-password-confirm-error required input');
            result = false;
        }

        return result;

    }

    // Test validation error messages for new password input field
    async new_passwordRuleValidation(){
        let result = true;

        // Test correct error message is displaying for when password length is less than 6
        super.enterInputById("new-password", "a!1aa");

        this.clickSubmit();
        await driver.sleep(500);

        let passwordError = await super.getTextById(`new-password-error`);
        if(!passwordError.includes("must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, new password validation length');
            result = false;
        }

        // Test correct error message is displaying for when password length is at least 6 and does not contain number
        super.clearsInputById("new-password")
        super.enterInputById("new-password", "aaaaa!");

        this.clickSubmit();
        await driver.sleep(500);

        passwordError = await super.getTextById(`new-password-error`);
        if(!passwordError.includes("must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, new password validation number');
            result = false;
        }

        // Test correct error message is displaying for when password length is at least 6 and does not contain speical character
        super.clearsInputById("new-password")
        super.enterInputById("new-password", "aaaaa1");
        
        this.clickSubmit();
        await driver.sleep(500);
        
        passwordError = await super.getTextById(`new-password-error`);
        if(!passwordError.includes("must be between 6 and 12 characters and contains at least 1 letter, 1 number and 1 special character.")){
            console.log('Fail, new password validation special character');
            result = false;
        }
        
        
        return result;
    }

    // Test validation error messages for new password confirm input field
    async new_passwordconfirmRuleValidation(){
        let result = true;

        // Valid new password in the input field
        super.enterInputById("new-password", "1234a!");
        
        // set different password in the password confirm field for testing purpose
        super.enterInputById("new-password-confirm", "1234a");
   
        this.clickSubmit();
        await driver.sleep(500);

        let passwordconfirmError = await super.getTextById(`new-password-confirm-error`);
        if(!passwordconfirmError.includes("Please enter the same value again.")){
            console.log('Fail, password confirm validation');
            result = false;
        }
        return result;
    }

    // Test if user can navigate to dash board page by clicking a dash board link on user overlay
    async user_button_to_dashboard_test(){
        super.clickById('open-user-overlay-btn');
        await driver.sleep(500);
        super.clickByXpath('//*[@id="user-overlay"]/ul/li[2]/a');

        await driver.sleep(500);
        
        //get text from additional information
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("index.html")){
            console.log("Success, you are redirected to dash board page")
            return true;
        } else {
            console.log("Fail, you are not redirected to dash board page")
            return false;
        }

    }
}

module.exports = new ProfilePage;