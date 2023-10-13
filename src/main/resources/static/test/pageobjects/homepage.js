const { Builder, By, Key, until } = require('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

const mockedData = require('../mockedData.json');

class HomePage extends BasePage {

    // Test if user's input is being added to the list
    async Input_test_case(userInput) {
        let result = true;
        let found = false;
        try {
            // Locate input box and enter the URL
            await driver.findElement(By.name("userInputUrl")).sendKeys(userInput);
            // Locate the button by id and click it
            const submitButton = await driver.findElement(By.id("submitUrl"));
            await submitButton.click();

            const table = await driver.findElement(By.id("certTable"));
            const rows = await table.findElements(By.css('tbody tr'));

            for (const row of rows) {

                // Locate the URL cell in each row (assuming it's the first cell)
                const urlCell = await row.findElement(By.css('td:nth-child(1)'));

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

            await driver.findElement(By.name("userInputUrl")).clear(); // Clear the input field
            const submitButton = await driver.findElement(By.id("submitUrl"));
            await submitButton.click(); // Submit with empty input

            const table = await driver.findElement(By.id("certTable"));
            const rowsAfterEmptyInput = await table.findElements(By.css('tbody tr'));


            // Locate the last row directly
            const lastRow = await table.findElement(By.css('tbody tr:last-child'));

            const urlCell = await lastRow.findElement(By.css('td:nth-child(1)'));
            const urlText = await urlCell.getText();

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
            const table = await driver.findElement(By.id("certTable"));
            const rowsId = await table.findElements(By.css('tr[certificateid]'));
            const rows = await table.findElements(By.css('tbody tr'));

            if (rows.length != rowsId.length) {
                console.log("Fail, you have a row without certificateId attribute")
                return result = false;
            } else {
                result = true;
            }
        } catch (errors) {
            throw errors;
        }
        finally {
            if (result) {
                console.log("Success, all the rows have certificateid attribute");
            }
            return result;
        }
    }

    //Test if rows are getting deleted from the table
    async deletingRow_test() {
        try {
            let result = true;

            // deleting all the rows in the table
            const deleteBtn = await driver.findElements(By.className("deleteBtn"));
            for (const btn of deleteBtn) {
                driver.sleep(500);
                await btn.click();
            }

            const table = await driver.findElement(By.id("certTable"));
            const rows = await table.findElements(By.css('tbody tr'));

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

    //Test if user input begins with https://
    async user_InputFormat_test(userInput) {
        let result = true;
        try {
            await driver.findElement(By.name("userInputUrl")).sendKeys(userInput);

            const submitButton = await driver.findElement(By.id("submitUrl"));
            await submitButton.click();

            await driver.sleep(2000);

            const table = await driver.findElement(By.id("certTable"));
            const lastRow = await table.findElement(By.css('tbody tr:last-child'));
            const urlCell = await lastRow.findElement(By.css('td:nth-child(1)'));
            const urlText = await urlCell.getText();

            if (urlText.startsWith("https://")) {
                console.log("Success, Input begins with 'https://'");
                result = true;
            } else {
                console.log("Fail, Input does not begin with 'https://'");
                return result = false;
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
            const table = await driver.findElement(By.id("certTable"));
            const cells = await table.findElements(By.css('td'));

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
            const table = await driver.findElement(By.id("certTable"));
            const rows = await table.findElements(By.css('tbody tr'));

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
            const table = await driver.findElement(By.id("certTable"));
            const rows = await table.findElements(By.css('tbody tr'));

            for (const row of rows) {
                const rowClass = await row.getAttribute('class');
                if (rowClass.includes("expiringInTwoWeeks") || rowClass.includes("expiringInSixWeeks") || rowClass.includes("expired") || rowClass.includes("expiringGood")) {
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
            await driver.findElement(By.name("userInputUrl")).sendKeys(userInput);
            const form = await driver.findElement(By.id("urlForm"));
            form.submit();

            const table = await driver.findElement(By.id("certTable"));
            await driver.wait(until.elementIsVisible(table), 5000);
            const rows = await table.findElements(By.css('tbody tr'));

            for (const row of rows) {
                // Locate the URL cell in each row (assuming it's the first cell)
                const urlCell = await row.findElement(By.css('td:nth-child(1)'));

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

            const table = await driver.findElement(By.id("certTable"));
            const rows = await table.findElements(By.css('tbody tr'));

            for (const row of rows) {

                // Locate the URL cell in each row (assuming it's the first cell)
                const urlCell = await row.findElement(By.css('td:nth-child(1)'));

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
        const moreCertInfoIcons = await driver.findElements(By.className("moreCertInfo"));
        moreCertInfoIcons[0].click();

        //get text from additional information
        const currentUrl = await driver.getCurrentUrl();

        if (currentUrl.includes("certinfo.html")){
            console.log("Success, you are redirected to certinfo page")
            return true;
        } else {
            console.log("Fail, you are not redirected to certinfo page")
            return false;
        }
        
    }

        //Test if user can go back to the index page from certficiate page by clicking link
        async back_toIndex_test(){
            const moreCertInfoIcons = await driver.findElements(By.className("moreCertInfo"));
            moreCertInfoIcons[0].click();

            driver.sleep(10000);

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

module.exports = new HomePage;