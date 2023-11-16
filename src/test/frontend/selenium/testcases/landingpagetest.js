const landingpage = require('../pageobjects/landingpage');
const expect = require('chai').expect

describe('This tests for profile.html', function(){
    beforeEach(async function() {
        // Enter actions performed before test
        const baseUrl = 'http://127.0.0.1:8080/src/test/frontend/certificate-tracker.html';
        landingpage.go_to_url(baseUrl);
        // Give browser time to load all the plug ins
        await driver.sleep(1000);
    });

    afterEach(async function(){

    });

    after(function () {
        // Enter actions to be performed after all tests (e.g., quitting the WebDriver)
        driver.quit();
    });

    it("Test if user can navigate to sign in page by clicking a sign in link on user overlay", async function(){
        // Enter test steps
        const testResult = await landingpage.go_to_signin_test();
        expect(testResult).to.equal(true);
    });
})