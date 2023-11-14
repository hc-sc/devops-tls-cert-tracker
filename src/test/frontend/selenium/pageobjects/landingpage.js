const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

class LandingPage extends BasePage {
    async clickByXpath(xpath){
        await driver.findElement(By.xpath(xpath)).click();
    }

    // Test if user can navigate to sign in page by clicking a sign in link on user overlay
    async go_to_signin_test(){
        this.clickByXpath('//*[@id="wb-so"]/div/div/a');

        await driver.sleep(500);
        
        //get text from additional information
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("signin.html")){
            console.log("Success, you are redirected to sign in page")
            return true;
        } else {
            console.log("Fail, you are not redirected to sign in page")
            return false;
        }
    }
}

module.exports = new LandingPage;