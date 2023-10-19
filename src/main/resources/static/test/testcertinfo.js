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

async function fetchCertificateById(certid) {
    try {
      const response = await fetch('mockedData.json')
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      // Filter the data by ID
      const item = data.find(item => item.id == certid);
  
      if (item) {
        // Do something with the item, e.g., populate a table
        certificateTextContent(item);
        console.log('Item found:', item);
      } else {
        console.error('Item with ID not found:', certid);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  
  // Usage: Call the function with the desired id (e.g., 2)
  const certificateIdFromCookie = getCookie('certId');
  fetchCertificateById(certificateIdFromCookie);

  // change text of html element with data
  function certificateTextContent(certificate){
    const certName = document.querySelector(".certName");
    const certIssuer = document.querySelector(".certIssuer");
    const certValidFrom = document.querySelector(".certValidFrom");
    const certValidTo = document.querySelector(".certValidTo");
    const pageHeading = document.querySelector("#wb-cont");

    pageHeading.textContent = "You are viewing the certificate for\n" + certificate.url;
    pageHeading.style.whiteSpace= "pre";
    pageHeading.textContent += 
    certName.textContent = certificate.name;
    certIssuer.textContent = certificate.issuer;
    certValidFrom.textContent = certificate.ValidFrom;
    certValidTo.textContent = certificate.ValidTo;

  }
  
  
  
  