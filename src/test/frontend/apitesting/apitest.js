const axios = require("axios");
const {expect} = require("chai");

describe("GET API Request test", async() => {
    it("should be able to get user list", async() => {
        
        apiUrl = "https://reqres.in/api/users?page=2"
          
        const response = await axios.get(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': "application/json"
          }
        });
        const data = response.data;
          if(!(response.statusText == 'OK')){
            throw data;
          } else {
            expect(data.page).to.equal(2);
          }
      }
    )
})

describe("GET API Request test #2", async() => {
  it("should be able to get a single user with id 2", async() => {
      
      apiUrl = "https://reqres.in/api/users/2"
        
      const response = await axios.get(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json"
        }
      });
      const data = response.data;
        if(!(response.statusText == 'OK')){
          throw data;
        } else {
          expect(data.data.id).to.equal(2);
        }
    }
  )
})

describe("DELETE API Request test", async() => {
  it("should get response 204", async() => {
      
      apiUrl = "https://reqres.in/api/users/2"
        
      const response = await axios.delete(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': "application/json"
        }
      });
        if((response.status !== 204)){
          console.log("Fail, Response is not 204");
          throw error;
        } else {
          expect(response.status).to.equal(204);
        }
    }
  )
})

describe("POST API Request test", async() => {
  it("should get name 'morpheus'", async() => {
      
      apiUrl = "https://reqres.in/api/users"
        
      const response = await axios.post(apiUrl, {
        "name": "morpheus",
        "job": "leader"
      }, {
        method: 'DELETE',
        headers: {
          'Content-Type': "application/json"
        }
      });
      const data = response.data;
        if((response.status !== 201)){
          console.log("Fail, Response is not 201");
          throw error;
        } else {
          expect(data.name).to.equal("morpheus");
        }
    }
  )
})
