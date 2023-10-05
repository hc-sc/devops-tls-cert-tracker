const{Builder, By, Key, until} = require ('selenium-webdriver');

const BasePage = require('./basepage');
const webdriver = require('selenium-webdriver');

const mockedData = require('../mockedData.json');

class HomePage extends BasePage{

  // Test if user's input is being added to the list
  async Input_test_case(userInput) {    
    let result = true;
    try{
        // Locate input box and enter the URL
        await driver.findElement(By.name("userInputUrl")).sendKeys(userInput);
        // Locate the button by id and click it
        const submitButton = await driver.findElement(By.id("submitUrl"));
        await submitButton.click();
    
        const table = await driver.findElement(By.id("certTable"));
        const rows = await table.findElements(By.css('tbody tr'));
    
        let found = false;
    
        for(const row of rows) {
    
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
    
        if(found){
            console.log("Success, Input is added to the table")
            return result;
          } else {
            console.log("Fail, Input is not found in the table")
            return result = false;
          }
    } catch(errors){
        console.log(errors, "error in the test");
    }
}

  //Test if empty input is entered into the table
  async empty_input_test() {
      let result = true;
        try{
    
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
                result = true;
            }
    
        } catch(errors) {
    
            console.log(errors, "error in the test");
    
        } 
        finally {
            return result;
        }
  }

  //Test if rows have certificateid as its attribute
  async deletion_requirement_test() {
        let result = true;
        try{
            const table = await driver.findElement(By.id("certTable"));
            const rowsId = await table.findElements(By.css('tr[certificateid]'));
            const rows = await table.findElements(By.css('tbody tr'));
    
            if (rows.length != rowsId.length){
                console.log("Fail, you have a row without certificateId attribute")
                return result = false;
            } else {
                result = true;
            }
            // else {
            //     // when user click delete button row length should reduce by 1
            //     const deleteBtn = await driver.findElements(By.className("deleteBtn"));
    
            //     for (const btn of deleteBtn){
            //         driver.sleep(1000);
            //         await btn.click();
    
            //         const updatedRows = await getRows();
            //         if (updatedRows.length == (rows.length-1)){
            //             result = true;
                        
            //         } else {
            //             console.log("Fail, delete button is not correctly working");
            //             return result = false;
            //         }
            //     }
            // }
    
        } catch(errors){
            console.log(errors, "failed test");
        } 
        finally {
            if (result) {
                console.log("Success, all the rows have certificateid attribute");
            }
            return result;
        }
  }

  //Test if user input begins with https://
  async userInputFormat(userInput) {
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
        } catch(errors) {
            console.log(errors, "error in the test");
        } 
        finally {
          return result;
      }
  }

  //Test if dynamically generated table contains any empty cell
  async cellValue_test() {
      let result = true;
      try{
          const table = await driver.findElement(By.id("certTable"));
          const rows = await table.findElements(By.css('tbody tr'));

          for(const row of rows) {
              const cells = await row.findElements(By.css('td'));
  
              for (const cell of cells){
                  const cellValue = await cell.getText();
                  if (cellValue.trim() === ""){
                      console.log("Fail, the table contains invalid data");
                      return result = false;
                  } else {
                      result = true;
                  }
              }
          }
  
      }catch(errors){
          console.log(errors, "error in the test");
      } 
      finally {
          if (result) {
              console.log("Success, the table looks good");
          }
          return result;
      }
  }

  //Test is table is dynamically generated with data inside
  async row_counting_test() {
    let result = true;
    try{
        const table = await driver.findElement(By.id("certTable"));
        const rows = await table.findElements(By.css('tbody tr'));
    
        // let initialRowsLength = rows.length;
        
        // //refreshing the page
        // driver.navigate().refresh();

        // let refreshedRowsLength = rows.length;

        // if (initialRowsLength == refreshedRowsLength){
        //     console.log("Success, counts matches");
        //     result = true;
        // } else {
        //     console.log("Fail, counts don't match");
        //     return result = false;
        // }

        let rowsLength = rows.length;
        console.log(rowsLength);
        let certCount = mockedData.length;
        console.log(certCount);

        if (rowsLength == certCount){
            console.log("Success, counts matches");
        } else {
            console.log("Fail, counts don't match");
        }

    }catch(errors){
        console.log(errors, "failed test");
    } 
    finally {
      return result;
  }
  }

  //Test if the table is visually alerting the users with correct css Id
  async visual_alert_test() {
  let result = true;

  try{          
      const table = await driver.findElement(By.id("certTable"));
      const rows = await table.findElements(By.css('tbody tr'));

      for(const row of rows) {
          const rowId = await row.getAttribute('id');
          if (rowId === "expiringInTwoWeeks" || rowId === "expiringInSixWeeks" || rowId === "expired" || rowId === "expiringGood") {
              result = true;
          } else {
              console.log("Fail, some rows are not visually alerting the users")
              result = false;
              break;
          }
      }
  }catch(errors){

      console.log(errors, "failed test");

  } 
  finally {
      if (result) {
          console.log("Success, table is visually alerting the users");
      }
      return result;
  }
  }



}

module.exports = new HomePage;