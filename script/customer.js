loadTable();
function loadTable() {
  fetch("http://localhost:8080/mos/customer/get-all")
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      let tblBody = document.getElementById("myCart");
      let body = ``;

      data.forEach((el) => {
        body += `
          <tr>
              <td>${el.id}</td>
              <td>${el.name}</td>
              <td>${el.contact}</td>
              <td>${el.address}</td>
              <td>
                  <button onclick="EditCustomer(${el.id})">✏️</button>
                  <button onclick="deleteCustomer(${el.id})">🗑️</button>
              </td>
          </tr>       
        `;
      });
      tblBody.innerHTML = body;
    });
}

function addCustomer() {
  let CusName = document.getElementById("Name").value.trim();
  let CusPhoneNumber = document.getElementById("PhoneNumber").value.trim();
  let CusAddress = document.getElementById("address").value.trim();

  if (!CusName || !CusPhoneNumber || !CusAddress) {
    alert("Please fill out all fields correctly.");
    return;
  }
  if (validePhoneNumber(CusPhoneNumber)) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name: CusName,
      contact: CusPhoneNumber,
      address: CusAddress,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:8080/mos/customer/add", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        loadTable();
        document.getElementById("Name").value = "";
        document.getElementById("PhoneNumber").value = "";
        document.getElementById("address").value = "";
      })
      .catch((error) => console.error(error));

    console.log("Phone number is valid.");
  } else {
    alert("Invalid phone number");
    console.log("Phone number is invalid.");

  }
}

function validePhoneNumber(phoneNumber) {
  const regex = /^0\d{9}$/;
  return regex.test(phoneNumber);
}

//  delete Customer
function deleteCustomer(index) {
  
  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/customer/delete/${index}`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((result) => {
      console.log(result);
      loadTable();
    })
    .catch((error) => {
      console.error("Error deleting customer:", error);
    });
}

// -------------Update Customer------------

function EditCustomer(index) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/customer/search-by-id/${index}`, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      data.forEach((el) => {
        document.getElementById("Name").value = el.name;
        document.getElementById("PhoneNumber").value = el.contact;
        document.getElementById("address").value = el.address;
      });
    });

  let addButton = document.getElementById("addButton");
  addButton.innerText = "Save Changes";

  addButton.onclick = function () {
    updateCustomer(index);
  };
}

function updateCustomer(index) {
  let CusName = document.getElementById("Name").value.trim();
  let CusPhoneNumber = document.getElementById("PhoneNumber").value.trim();
  let CusAddress = document.getElementById("address").value.trim();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    id: index,
    name: CusName,
    contact: CusPhoneNumber,
    address: CusAddress,
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/customer/update/${index}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      document.getElementById("Name").value = "";
      document.getElementById("PhoneNumber").value = "";
      document.getElementById("address").value = "";
      loadTable();
    })
    .catch((error) => console.error(error));
}

function searchCustomer() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#myCart tr");

  rows.forEach((row) => {
    const nameCell = row.querySelectorAll("td")[1]; // 2nd column is "Name"

    if (nameCell) {
      const name = nameCell.textContent.toLowerCase();
      if (name.includes(input)) {
        row.style.display = ""; // Show matching row
      } else {
        row.style.display = "none"; // Hide non-matching row
      }
    }
  });
}
