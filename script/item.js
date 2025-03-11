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

function addItemCart() {
  let itemName = document.getElementById("ItemName").value;
  let itemPrice = parseFloat(document.getElementById("ItemPrice").value);
  let itemImageInput = document.getElementById("Itemimage").files[0];
  let imageUrl = URL.createObjectURL(itemImageInput);

  console.log(imageUrl);
  

  if (!itemName || isNaN(itemPrice)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: itemName,
    price: itemPrice,
    image: imageUrl,
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
  const raw = "";

  const requestOptions = {
    method: "GET",
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/item/search-by-id/${index}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

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
  let itemName = document.getElementById("ItemName").value.trim();
  let itemPrice = parseFloat(document.getElementById("ItemPrice").value);
  let itemImageInput = document.getElementById("Itemimage").files[0];

  if (!itemId || !itemName || isNaN(itemPrice)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  const raw = JSON.stringify({
    "name": "Dayya Burgers",
    "price": 7800
  });
  
  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  fetch("http://localhost:8080/mos/item/update/11", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);
      document.getElementById("ItemId").value = "";
      document.getElementById("ItemName").value = "";
      document.getElementById("ItemPrice").value = "";
      document.getElementById("Itemimage").value = "";
    
      loadTable();

    })
    .catch((error) => console.error(error));  



  let itemImage = itemImageInput
    ? URL.createObjectURL(itemImageInput)
    : items[index].img;

  // Update array
  items[index] = {
    itemCode: itemId,
    itemName: itemName,
    price: itemPrice,
    discount: 0,
    img: itemImage,
  };

  let addButton = (document.getElementById("addButton").innerText =
    "Update Item");
  addButton.onclick = addItemCart;


}
