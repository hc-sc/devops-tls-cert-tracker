const homepage = require('../pageobjects/homepage');
const expect = require('chai').expect

describe('This tests for index.html', function(){
    beforeEach(async function() {
        // Enter actions performed before test
        const baseUrl = 'http://127.0.0.1:8080/src/test/frontend/';
        homepage.go_to_url(baseUrl);
        await driver.sleep(1000);
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
    
    it("Test if empty input is entered into the table", async function(){
        // Enter test steps
        const testResult = await homepage.empty_input_test();
        expect(testResult).to.equal(true);
    });

    it("Test if rows have certificateid as its attribute", async function(){
        // Enter test steps
        const testResult = await homepage.deletion_requirement_test();
        expect(testResult).to.equal(true);
    });

    it("Test if user input begins with https:// added to the table", async function(){
        // Enter test steps
        const testResult = await homepage.user_InputFormat_test("https://thestar.com");
        expect(testResult).to.equal(true);
    });

    it("Test if invalid url submission will display correct error message", async function(){
        // Enter test steps
        const testResult = await homepage.urlFormatValidation_test("http://invalidURL.test");
        expect(testResult).to.equal(true);
    });
    
    // Temporarily commented due to the test taking to long time to run in the workflow
    it("Test if dynamically generated table contains any empty cell", async function(){
        // Enter test steps
        const testResult = await homepage.cellValue_test();
        expect(testResult).to.equal(true);
    });

    it("Test if table is dynamically generated with data inside", async function(){
        // Enter test steps
        const testResult = await homepage.row_counting_test();
        expect(testResult).to.equal(true);
    });

    it("Test if the table is visually alerting the users with correct css class name", async function(){
        // Enter test steps
        const testResult = await homepage.visual_alert_test();
        expect(testResult).to.equal(true);
    });

    it("Test if rows are getting deleted from the table", async function(){
        // Enter test steps
        const testResult = await homepage.deletingRow_test();
        expect(testResult).to.equal(true);
    });

    // it("Test if default submission of the form is prevented with pressing enter", async function(){
    //     // Enter test steps
    //     const testResult = await homepage.default_formPrevention_test("form submission");
    //     expect(testResult).to.equal(true);
    // });

    // it("Test if pressing enter the input to table triggering the correct button", async function(){
    //     // Enter test steps
    //     const testResult = await homepage.add_UrlWithEnterKey_test("test input");
    //     expect(testResult).to.equal(true);
    // });

    it("Test if user is sent to view additional information about certificate by clicking icon", async function(){
        // Enter test steps
        const testResult = await homepage.more_infoPage_test();
        expect(testResult).to.equal(true);
    });

    it("Test if user can navigate to profile page by clicking a profile link on user overlay", async function(){
        // Enter test steps
        const testResult = await homepage.user_button_to_profile_test();
        expect(testResult).to.equal(true);
    });

    it("Test if user is sent to view additional information about certificate by clicking icon", async function(){
        // Enter test steps
        const testResult = await homepage.more_infoPage_test();
        expect(testResult).to.equal(true);
    });
})