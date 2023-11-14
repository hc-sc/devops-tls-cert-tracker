const profilepage = require('../pageobjects/profilepage');
const expect = require('chai').expect

describe('This tests for profile.html', function(){
  beforeEach(async function() {
    // Enter actions performed before test
    const baseUrl = 'http://127.0.0.1:8080/src/test/frontend/profile.html';
    profilepage.go_to_url(baseUrl);
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
    const testResult = await profilepage.requiredInput_test();
    expect(testResult).to.equal(true);
  });

  it("Test validation error messages for new password input field", async function(){
    const testResult = await profilepage.new_passwordRuleValidation();
    expect(testResult).to.equal(true);
  });

  it("Test validation error messages for new password confirm input field", async function(){
      const testResult = await profilepage.new_passwordconfirmRuleValidation();
      expect(testResult).to.equal(true);
  });

  it("Test if user can navigate to dash board page by clicking a dash board link on user overlay", async function(){
    const testResult = await profilepage.user_button_to_dashboard_test();
    expect(testResult).to.equal(true);
  });

})