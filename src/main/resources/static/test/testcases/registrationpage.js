const registrationpage = require('../pageobjects/registrationpagetests');
const expect = require('chai').expect

describe('This tests for registration.html', function(){
    beforeEach(function() {
        // Enter actions performed before test
        const baseUrl = 'http://127.0.0.1:8080/src/main/resources/static/test/registration.html';
        registrationpage.go_to_url(baseUrl);
        // Give browser time to load all the plug ins
        driver.sleep(500);
    });

    afterEach(function(){
    });

    after(function () {
        // Enter actions to be performed after all tests (e.g., quitting the WebDriver)
        driver.quit();
      });


    it("Test validation error messages for required input field", async function(){
        const testResult = await registrationpage.requiredInput_test();
        expect(testResult).to.equal(true);
    });
    
    it("Test validation error messages for first name input field", async function(){
        const testResult = await registrationpage.fnameRuleValidation();
        expect(testResult).to.equal(true);
    });

    it("Test validation error messages for tel input field", async function(){
        const testResult = await registrationpage.telRuleValidation();
        expect(testResult).to.equal(true);
    });

    it("Test validation error messages for email input field", async function(){
        const testResult = await registrationpage.emailRuleValidation();
        expect(testResult).to.equal(true);
    });

    it("Test validation error messages for new password input field", async function(){
        const testResult = await registrationpage.passwordRuleValidation();
        expect(testResult).to.equal(true);
    });

    it("Test validation error messages for passwordconfirm input field", async function(){
        const testResult = await registrationpage.passwordconfirmRuleValidation();
        expect(testResult).to.equal(true);
    });

})