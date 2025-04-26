function loadTable() {
  fetch("http://localhost:8080/mos/item/get-all", {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => response.json())
    .then((result) => {
      let tblBody = document.getElementById("tblBody");
      let body = "";

      result.forEach((element) => {
        body += `
          <tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td><img src="${element.image}" alt="${element.name}" class="item-image" width="100" height="100"></td>
            <td>
              <button class="btn btn-sm btn-outline-primary" onclick="editItem(${element.id})">✏️</button>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteItem(${element.id})">🗑️</button>
            </td>
          </tr>    
        `;
      });

      tblBody.innerHTML = body;
      console.log(result);
    })
    .catch((error) => console.log("Error fetching data:", error));
}
loadTable();

//================Add item========================
let addButton = document.getElementById("addButton");
addButton.innerText = "Save Changes";

addButton.onclick = function () {
  addItem();
};

function addItem() {
  let itemName = document.getElementById("ItemName").value;
  let itemPrice = parseFloat(document.getElementById("ItemPrice").value);
  let itemImageInput = document.getElementById("Itemimage").value;

  console.log(itemImageInput);

  if (!itemName || isNaN(itemPrice)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: itemName,
    price: itemPrice,
    image: itemImageInput,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/mos/item/add", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      loadTable();
      alert("Order placed successfully!");

      document.getElementById("ItemName").value = "";
      document.getElementById("ItemPrice").value = "";
      document.getElementById("Itemimage").value = "";
    })
    .catch((error) => console.error(error));
}

//================delete item========================

function deleteItem(index) {
  const requestOptions = {
    method: "DELETE",
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/item/delete/${index}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      loadTable();
    })
    .catch((error) => console.error(error));
}

//===============Update item=======================

function editItem(index) {

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/item/search-by-id/${index}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      loadTable();
      result.forEach((el) => {
        document.getElementById("ItemName").value = el.name;
        document.getElementById("ItemPrice").value = el.price;
        document.getElementById("Itemimage").value = el.image;
      });
    })
    .catch((error) => console.error(error));

  let addButton = document.getElementById("addButton");
  addButton.innerText = "Save Changes";

  addButton.onclick = function () {
    updateItem(index);
  };
}

function updateItem(index) {
  let itemName = document.getElementById("ItemName").value;
  let itemPrice = parseFloat(document.getElementById("ItemPrice").value);
  let itemImageInput = document.getElementById("Itemimage").value;

  if (!itemImageInput || !itemName || isNaN(itemPrice)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: itemName,
    price: itemPrice,
    image: itemImageInput
  });

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/item/update/${index}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      document.getElementById("ItemName").value = "";
      document.getElementById("ItemPrice").value = "";
      document.getElementById("Itemimage").value = "";

      loadTable();
    })
    .catch((error) => console.error(error));

  let addButton = (document.getElementById("addButton").innerText =
    "Update Item");
  addButton.onclick = addItem;
}

function searchItem() {
  const input = document.getElementById("searchInput").value.toLowerCase(); // Get search text and convert to lowercase
  const rows = document.querySelectorAll("#tblBody tr"); // Get all table rows inside tbody

  rows.forEach((row) => {
    const nameCell = row.querySelectorAll("td")[1]; // 2nd column = Item Name
    if (nameCell) {
      const name = nameCell.textContent.toLowerCase(); // Get item name and convert to lowercase
      if (name.includes(input)) {
        row.style.display = ""; // Show the row if name matches
      } else {
        row.style.display = "none"; // Hide if not match
      }
    }
  });
}
