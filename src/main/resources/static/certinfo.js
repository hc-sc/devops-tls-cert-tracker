function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
  async function fetchCertificateById(certificateId) {
    apiUrl = `/api/certificates/get/${certificateId}`
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': "application/json"
        }
      });
      const data = await response.json();
      if(!response.ok){
        throw data;
      } else {
        console.log(data);
        populateCertInfo(data);
      }
  
    } catch (error) {
      console.error("Error fetching JSON data (get one certificate with id):", error);
    }
  }
  
  // Usage: Call the function with the desired id (e.g., 2)
  const certificateIdFromCookie = getCookie('certId');
  fetchCertificateById(certificateIdFromCookie);

  // change text of html element with data
  function populateCertInfo(certificate){
    const certName = document.querySelector(".certSubjectName");
    const certSubjectOrganization = document.querySelector(".certSubjectOrganization");
    const certSubjectOrganizationUnit = document.querySelector(".certSubjectOrganizationUnit");

    const certIssuer = document.querySelector(".certIssuerName");
    const certIssuerOrganization = document.querySelector(".certIssuerOrganization");
    const certIssuerOrganizationUnit = document.querySelector(".certIssuerOrganizationUnit");

    const certValidFrom = document.querySelector(".certValidFrom");
    const certValidTo = document.querySelector(".certValidTo");

    //parse data subject to
    const parsedSubject = parseCertificateData(certificate.subject);
    certName.textContent = parsedSubject.CN || '<Not Part Of Certificate>';
    certSubjectOrganization.textContent = parsedSubject.O || '<Not Part Of Certificate>';
    certSubjectOrganizationUnit.textContent = parsedSubject.OU || '<Not Part Of Certificate>';
    const parsedIssuer = parseCertificateData(certificate.issuer)
    certIssuer.textContent = parsedIssuer.CN || '<Not Part Of Certificate>';
    certIssuerOrganization.textContent = parsedIssuer.O || '<Not Part Of Certificate>';
    certIssuerOrganizationUnit.textContent = parsedIssuer.OU || '<Not Part Of Certificate>';

    certValidFrom.textContent = certificate.validFrom;
    certValidTo.textContent = certificate.validTo;

  }
  function parseCertificateData(certificateData) {
    const splitedData = certificateData.split(",");
    const arrayData = [];
    const parsedResult = {};

    // What needs to be value includes "," in the string (eg. xyc\\, Inc.) which cuases problem. Spliting with "," will parse Inc as a key not value. 
    // Therefore, spliting the data into array to make sure , Inc. is included as a value no as key
    // take the splited data and break each section of data to index of array eg ['CA=www.canada.ca', 'O=xyc\\, Inc.', 'OU=xyz'] in to array based on '=' symbol
    splitedData.forEach(currentData => {
        if(currentData.includes('=')) {
          arrayData.push(currentData);
        } else {
          arrayData[arrayData.length-1] += ',' + `${currentData}`;
        }
    })

    // take the array of data and parse each index of array into key and value pair based on '=' symbol
    arrayData.forEach(data => {
      const [key, value] = data.split("=");

      //remove "\"" in the value
      parsedResult[key] = value.replace('\\', "");
    })

    return parsedResult;
}


  