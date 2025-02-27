loadMenu();
function loadMenu() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:8080/item/get-all", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Fetched menu items:", result);

      const menuContent = document.getElementById("menu-content");
      let body = "";

      result.forEach((e) => {
        body += `
            <div class="card" style="width: 300px; ">
                <img src="${e.image}" class="card-img-top" alt="${e.name}">
            <div class="card-body text-center">
            <h3 class="card-title fw-bold">${e.name}</h3>
            <h5 class="">Rs.${e.price}/=</h5>
            <button style="background-color:rgb(251, 171, 12);" class="btn btn-add-item" onclick="addCart(${e.id})">Add to Cart</button>
                </div>
            </div>
        `;
      });
      menuContent.innerHTML = body;
    })
    .catch((error) => console.error("Error loading menu:", error));
}

//===========Add cart=============
let CartArray = [];

function addCart(index) {
  console.log(index);

  const raw = "";

  const requestOptions = {
    method: "GET",
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:8080/item/search-by-id/${index}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);

      const selectItem = items[index];
      const existingItem = CartArray.find(
        (item) => item.Code === selectItem.itemCode
      );

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        CartArray.push({
          Code: selectItem.itemCode,
          Name: selectItem.itemName,
          Price: selectItem.price,
          img: selectItem.img,
          qty: 1,
        });
      }

      displayCart();
    })
    .catch((error) => console.error(error));
}

// Display Cart
function displayCart(id) {
  const raw = "";

  const requestOptions = {
    method: "GET",
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:8080/item/${id}`, requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);

      const AddCart = document.getElementById("cartboxId");
      let TempAddCart = ``;

      result.forEach((element) => {
        TempAddCart += `
      <tr>
        <td>${element.id}</td>
        <td>${element.name}</td>
        <td>Rs.${element.price}</td>
        <td><img src="${element.image}" alt="${element.name}" class="item-image" style="width: 50px; height: auto;"></td>
        <td>${element.qty}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="removeCartItem(${index})">🗑️</button>
        </td>
      </tr>
    `;
      });

      AddCart.innerHTML = TempAddCart;
    })
    .catch((error) => console.error(error));
}

// Remove  Cart
function removeCartItem(index) {
  CartArray.splice(index, 1);
  displayCart();
}
