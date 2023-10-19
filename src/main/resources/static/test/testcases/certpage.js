const certpage = require('../pageobjects/certpage');
const expect = require('chai').expect

describe('This tests for certinfo.html', function(){
    beforeEach(function() {
        // Enter actions performed before test
        const baseUrl = 'http://127.0.0.1:8080/src/main/resources/static/test/certinfo.html';
        certpage.go_to_url(baseUrl);
    });

    afterEach(async function(){
    });

    after(function () {
        // Enter actions to be performed after all tests (e.g., quitting the WebDriver)
        driver.quit();
      });

    it("Test if user can go back to the index page from certficiate page by clicking link", async function(){
        // Enter test steps
        const testResult = await certpage.back_toIndex_test();
        expect(testResult).to.equal(true);
    });
})