const webdriver = require('selenium-webdriver');

const chrome = require('selenium-webdriver/chrome');
const chromeOptions = new chrome.Options().addArguments('--headless');

const driver = new webdriver.Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions) // Set the Chrome options here
  .build();

// const driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().setTimeouts({implicit:(10000)});

class BasePage{
    constructor(){
        global.driver = driver;
    }

    go_to_url(baseUrl){
        driver.get(baseUrl);
    }
}

module.exports = BasePage;