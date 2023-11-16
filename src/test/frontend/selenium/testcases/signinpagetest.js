const signinpage = require('../pageobjects/signinpage');
const expect = require('chai').expect

describe('This tests for signin.html', function(){
  beforeEach(async function() {
    // Enter actions performed before test
    const baseUrl = 'http://127.0.0.1:8080/src/test/frontend/signin.html';
    signinpage.go_to_url(baseUrl);
    // Give browser time to load all the plug ins
    await driver.sleep(1000);
  });

  afterEach(async function(){
  });

  after(function () {
    // Enter actions to be performed after all tests (e.g., quitting the WebDriver)
    driver.quit();
  });

  it("Test validation error messages for required input field", async function(){
    const testResult = await signinpage.requiredInput_test();
    expect(testResult).to.equal(true);
  });

  it("Test if user can go to the registration from sign in page by clicking register link", async function(){
    const testResult = await signinpage.navigateToRegistration();
    expect(testResult).to.equal(true);
  });

  it("Test if clicking exit button will redirect user to landing page", async function(){
    const testResult = await signinpage.exit_button_test();
    expect(testResult).to.equal(true);
  });
})