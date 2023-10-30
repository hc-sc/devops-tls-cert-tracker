const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

const mockedData = require('../mockedData.json');

class CertPageTests extends BasePage {
    // Test if user can go back to the index page from certficiate page by clicking link
    async back_toIndex_test(){

        const goingBackBtn = await driver.findElement(By.id("toHomeBtn"));
        goingBackBtn.click();
        //get text from additional information
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("index.html")){
            console.log("Success, you are redirected to index page")
            return true;
        } else {
            console.log("Fail, you are not redirected to index page")
            return false;
        }
        
    }

}

module.exports = new CertPageTests;