const {Builder, Browser, By, Key, until} = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

const mockedData = require('../../mockedData.json');

class HomePageTests extends BasePage {

    async displayedElementByClassName(className){
        return await driver.findElement(By.className(className)).isDisplayed();
    }

    async submitUrl(){
        await driver.findElement(By.id("submitUrl")).click();
    }

    findTable(){
        return driver.findElement(By.id("certTable"));
    }

    findRows(table){
        return table.findElements(By.css('tbody tr'));
    }
    findLastRow(table){
        return table.findElement(By.css('tbody tr:last-child'));
    }

    findAllCells(table){
        return table.findElements(By.css('td'));
    }

    findUrlCell(row){
        return row.findElement(By.css('td:nth-child(2)'));
    }

    // Test if user can navigate to profile page by clicking a profile link on user overlay
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

    // Test if user's input is being added to the list
    async Input_test_case(userInput) {
        let result = true;
        let found = false;
        try {
            super.clickByXpath('//*[@id="wb-auto-4"]');
            // Locate input box and enter the URL
            super.enterInputById('userInputUrl', userInput);
            // Locate the button by id and click it
            this.submitUrl();
            await driver.sleep(1000);
            super.clickById('close-url-form');
            await driver.sleep(1000);

            // const table = await driver.findElement(By.id("certTable"));
            const table = await this.findTable();
            const rows = await this.findRows(table);

            for (const row of rows) {

                // Locate the URL cell in each row (assuming it's the first cell)
                const urlCell = this.findUrlCell(row);

                // Get the text content of the URL cell
                const urlText = await urlCell.getText();

                // Check if the text content matches the user input
                if (urlText == userInput) {
                    found = true;
                    break; // URL found, no need to continue searching
                }
            }
        } catch (errors) {
            throw errors;
        }

        if (found) {
            console.log("Success, Input is added to the table")
            return result;
        } else {
            console.log("Fail, Input is not found in the table")
            return result = false;
        }
    }


    //Test if empty input is entered into the table
    async empty_input_test() {
        let result = true;
        try {
            super.clickByXpath('//*[@id="wb-auto-4"]');

            super.clearsInputById("userInputUrl");

            this.submitUrl();

            super.clickById('close-url-form');
            await driver.sleep(500);

            

            const table = await this.findTable();

            // Locate the last row directly
            const lastRow = await this.findLastRow(table);
            const lastUrlCell = await this.findUrlCell(lastRow);
            const urlText = await lastUrlCell.getText();

            if (urlText === "") {
                console.log("Fail, Empty input is added to the last row");
                return result = false;
            } else {
                console.log("Success, Empty input is not found in the last row");
            }

        } catch (errors) {
            throw errors;
        }

        return result;

    }

    //Test if rows have certificateid as its attribute
    async deletion_requirement_test() {
        let result = true;
        
        try {
            const table = await this.findTable();
            const rowsId = await table.findElements(By.css('tr[certificateid]'));
            const rows = await this.findRows(table);
            if (rows.length == rowsId.length) {
                console.log("Success, all the rows have certificateid attribute");
                result = true;
            } else {
                console.log("Fail, you have a row without certificateId attribute")
                return result = false;
            }
        } catch (errors) {
            throw errors;
        }
        finally {
            return result;
        }
    }

    //Test if rows are getting deleted from the table
    async deletingRow_test() {
        try {
            let result = true;

            // deleting all the rows in the table
            const deleteBtn = await super.findElementsByClassName("deleteBtn")
            for (const btn of deleteBtn) {
                await btn.click();
            }

            const table = await this.findTable();
            const rows = await this.findRows(table);

            if (rows.length === 0) {
                console.log("Success, all the rows are deleted");
                return result;
            } else {
                console.log("Fail, rows are not deleted");
                return result = false;
            }

        } catch (errors) {
            throw errors;
        }


    }

    //Test if user input begins with https:// added to the table
    async user_InputFormat_test(userInput) {
        let result = true;
        try {
            super.clickByXpath('//*[@id="wb-auto-4"]');
            // Locate input box and enter the URL
            super.enterInputById('userInputUrl', userInput);
            // Locate the button by id and click it
            this.submitUrl();
            await driver.sleep(500);
            super.clickById('close-url-form');
            await driver.sleep(500);

            const table = await this.findTable();
            const lastRow = await this.findLastRow(table);
            const lastUrlCell = await this.findUrlCell(lastRow);
            const urlText = await lastUrlCell.getText();

            if (urlText == userInput && urlText.startsWith("https://")) {
                console.log("Success, Input begins with 'https://' is in the table");
                result = true;
            } else {
                console.log("Fail, Input is not found in the table");
                return result = false;
            }
        } catch (errors) {
            throw errors;
        }

        return result;

    }

    // Test if invalid url submission will display correct error message
    async urlFormatValidation_test(userInput) {
        let result = true;
        try {
            super.clickByXpath('//*[@id="wb-auto-4"]');
            // Locate input box and enter the URL
            super.enterInputById('userInputUrl', userInput);
            // Locate the button by id and click it
            this.submitUrl();
            await driver.sleep(500);

            let urlInputError = await driver.findElement(By.xpath('//*[@id="errors-url-form"]/ul/li/a')).getText();
            console.log(urlInputError);
            if(!urlInputError.includes("Invalid format.")){
                console.log('Fail, invalid url format is not validated');
                result = false;
            } else {
                console.log("Success, correct error message is displayed");
                result = true;
            }

        } catch (errors) {
            throw errors;
        }

        return result;

    }

    //Test if dynamically generated table contains any empty cell
    async cellValue_test() {
        let result = true;
        try {
            
            const table = await this.findTable();
            const cells = await this.findAllCells(table);

            await driver.sleep(1000);

            for (const cell of cells) {
                const cellValue = await cell.getText();
                const cellElements = await cell.findElements(By.css("span"));
                if (cellValue.trim() == "" && cellElements.length == 0) {
                    console.log("Fail, there is empty cell in the table")
                    return result = false;
                }
            }

        } catch (errors) {
            throw errors;
        }
        if (result) {
            console.log("Success, there are no empty cell in the table")
        }
        return result;
    }

    //Test is table is dynamically generated with data inside
    async row_counting_test() {
        let result = true;
        try {
            const table = await this.findTable();
            const rows = await this.findRows(table);

            let rowsLength = rows.length;
            let certCount = mockedData.length;

            if (rowsLength == certCount) {
                console.log("Success, counts matches");
            } else {
                console.log("Fail, counts don't match");
                return result = false;
            }

        } catch (errors) {
            throw errors;
        }
        return result;
    }

    //Test if the table is visually alerting the users with correct css class name
    async visual_alert_test() {
        let result = true;

        try {
            const table = await this.findTable();
            const rows = await this.findRows(table);

            for (const row of rows) {
                const statusCell = row.findElement(By.css('td:nth-child(1)'));
                const cellElement = await statusCell.findElement(By.css("span"));
                const statusSpan = await cellElement.getAttribute('class');
                if (statusSpan.includes("expiringInTwoWeeks") || statusSpan.includes("expiringInSixWeeks") || statusSpan.includes("expired") || statusSpan.includes("expiringGood")) {
                    result = true;
                } else {
                    console.log("Fail, some rows are not visually alerting the users")
                    return result = false;
                }
            }
        } catch (errors) {
            throw errors;
        }
        if (result) {
            console.log("Success, table is visually alerting the users");
            return result;
        }
    }

    // Test if default submission of the form is prevented with pressing enter
    async default_formPrevention_test(userInput) {
        let result = true;
        let found = false;
        try {
            super.enterInputById("userInputUrl", userInput);

            this.submitUrl

            const table = await this.findTable();
            await driver.wait(until.elementIsVisible(table), 5000);
            const rows = await this.findRows(table);

            for (const row of rows) {
                // Locate the URL cell in each row (assuming it's the first cell)
                const urlCell = await this.findUrlCell(row);

                // Get the text content of the URL cell
                const urlText = await urlCell.getText();

                // Check if the text content matches the user input
                if (urlText == userInput) {
                    found = true;
                    break; // URL found, no need to continue searching
                }
            }
        } catch (errors) {
            throw errors;
        }
        if (found) {
            console.log(found);
            console.log("Fail, form submission is not prevented");
            return result = false;
        } else {
            console.log("Success, form submission is prevented");
            return result;
        }
    }

    // Test if pressing enter the input to table triggering the correct button
    async add_UrlWithEnterKey_test(userInput) {
        let result = true;
        let found = false;
        try {
            // Locate input box and enter the URL, and press enter
            await driver.findElement(By.name("userInputUrl")).sendKeys(userInput, Key.RETURN);

            const table = await this.findTable();
            const rows = await this.findRows(table);

            for (const row of rows) {

                // Locate the URL cell in each row (assuming it's the first cell)
                const urlCell = await this.findUrlCell(row);

                // Get the text content of the URL cell
                const urlText = await urlCell.getText();

                // Check if the text content matches the user input
                if (urlText == userInput) {
                    found = true;
                    break; // URL found, no need to continue searching
                }
            }
        } catch (errors) {
            throw errors;
        }
        if (found) {
            console.log("Success, Input is added to the table")
            return result;
        } else {
            console.log("Fail, Input is not found in the table")
            return result = false;
        }
    }

    //Test if user is sent to view additional information about certificate by clicking icon
    async more_infoPage_test(){

        let result = true;
        
        let certficateDetailHeader = await this.displayedElementByClassName("certInfo-header")
        let certficateDetailBody = await this.displayedElementByClassName("certInfo")

        if (certficateDetailHeader && certficateDetailBody) {
            result = false;
            console.log("Fail, certificate detail should be invisible until the corresponding button in clicked");
        }
        
        const moreCertInfoIcons = await this.findElementsByClassName("moreCertInfo");
        moreCertInfoIcons[0].click();

        await driver.sleep(500);

        certficateDetailHeader = await this.displayedElementByClassName("certInfo-header")
        certficateDetailBody = await this.displayedElementByClassName("certInfo")


        if (!certficateDetailHeader && !certficateDetailBody){
            result = false;
            console.log("Fail, certificate detail should be visible after the button is clicked")
        } else {
            super.clickByXpath('//*[@id="certinfo-popup"]/div[2]/button');
            await driver.sleep(500);
            
            certficateDetailHeader = await this.displayedElementByClassName("certInfo-header")
            certficateDetailBody = await this.displayedElementByClassName("certInfo")
            if (certficateDetailHeader && certficateDetailBody) {
                result = false;
                console.log("Fail, certificate detail did not properly close");
            }
        }
        
        return result;
    }
}

module.exports = new HomePageTests;