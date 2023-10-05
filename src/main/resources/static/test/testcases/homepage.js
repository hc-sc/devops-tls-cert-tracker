const homepage = require('../pageobjects/homepage');
const expect = require('chai').expect

describe('This tests for index.html', function(){
    beforeEach(function() {
        // Enter actions performed before test
        const baseUrl = 'http://127.0.0.1:8080/src/main/resources/static/test/';
        homepage.go_to_url(baseUrl);
    });

    afterEach(async function(){
        // Enter actions to be performed after test
        // await driver.quit();
    });

    after(function () {
        // Enter actions to be performed after all tests (e.g., quitting the WebDriver)
        driver.quit(); // Define a method to quit the WebDriver in your homepage object
      });

    it("Test if user's input is being added to the list", async function(){
        // Enter test steps
        const testResult = await homepage.Input_test_case("https://thestar.com");
        expect(testResult).to.equal(true);
    });

    it("Test if rows have certificateid as its attribute", async function(){
        // Enter test steps
        const testResult = await homepage.deletion_requirement_test();
        expect(testResult).to.equal(true);
    });

    it("Test if empty input is entered into the table", async function(){
        // Enter test steps
        const testResult = await homepage.empty_input_test();
        expect(testResult).to.equal(true);
    });

    it("Test if user input begins with https://", async function(){
        // Enter test steps
        const testResult = await homepage.userInputFormat("https://thestar.com");
        expect(testResult).to.equal(true);
    });

    it("Test if dynamically generated table contains any empty cell", async function(){
        // Enter test steps
        const testResult = await homepage.cellValue_test();
        expect(testResult).to.equal(true);
    });

    it("Test is table is dynamically generated with data inside", async function(){
        // Enter test steps
        const testResult = await homepage.row_counting_test();
        expect(testResult).to.equal(true);
    });

    it("Test if the table is visually alerting the users with correct css Id", async function(){
        // Enter test steps
        const testResult = await homepage.visual_alert_test();
        expect(testResult).to.equal(true);
    });

})