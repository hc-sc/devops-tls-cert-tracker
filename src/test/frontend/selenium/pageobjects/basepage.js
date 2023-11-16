const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options()
.addArguments('--headless');

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions) // Set the Chrome options here
  .build();

// const driver = new webdriver.Builder().forBrowser('chrome').build();
// driver.manage().setTimeouts({implicit:(10000)});

class BasePage{
    constructor(){
        global.driver = driver;
    }

    go_to_url(baseUrl){
        driver.get(baseUrl);
    }

    async clickByXpath(xpath){
        await driver.findElement(By.xpath(xpath)).click();
    }

    async enterInputById(id, text){
        await driver.findElement(By.id(id)).sendKeys(text);
    }

    async clearsInputById(id){
        await driver.findElement(By.id(id)).clear();
    }

    async clickById(id){
        await driver.findElement(By.id(id)).click();
    }

     findElementsByClassName(className){
        return  driver.findElements(By.className(className));
    }

    getTextById(id){
        return driver.findElement(By.id(id)).getText();
    }
}

module.exports = BasePage;