loadMenu();

async function CustomerSelection() {
  try {
    const response = await fetch("http://localhost:8080/mos/customer/get-all");
    const customers = await response.json();
    const selectElement = document.getElementById("existingCustomer");

    customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = customer.name;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
  }
}
window.addEventListener("DOMContentLoaded", CustomerSelection);

function loadMenu() {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch("http://localhost:8080/mos/item/get-all", requestOptions)
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
             <h7>#${e.id}</h7>
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
  console.log("Adding item to cart:", index);

  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(`http://localhost:8080/mos/item/search-by-id/${index}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log("Fetched item:", result);

      const existingItem = CartArray.find((item) => item.Code === result.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        CartArray.push({
          Code: result.id,
          name: result.name,
          Price: result.price,
          img: result.image,
          qty: 1,
        });
      }

      displayCart();
    })
    .catch((error) => console.error("Error fetching item:", error));
}

// Display Cart
function displayCart() {
  let cartTable = document.getElementById("cartboxId");
  let TempAddCart = "";

  CartArray.forEach(element => {
    TempAddCart += `
  <tr>
    <td>${element.Code}</td>
    <td>${element.name}</td>
    <td>Rs.${element.Price}</td>
    <td><img src="${element.img}" alt="${element.name}" class="item-image" style="width: 50px; height: auto;"></td>
    <td>${element.qty}</td>
    <td>
      <button class="btn btn-sm btn-outline-danger" onclick="removeCartItem(${CartArray.indexOf(element)})">🗑️</button>
    </td>
  </tr>
`;
  });
  cartTable.innerHTML = TempAddCart;
}

// Remove  Cart
function removeCartItem(index) {
  CartArray.splice(index, 1);
  displayCart();
}

// oder place

let Oderarray = [];

function OderPlace() {
  const name = document.getElementById("existingCustomer").value;
  const number = document.getElementById("contact").value;
  const discount = parseFloat(document.getElementById("discount").value || 0);

  if (!name || !number || isNaN(discount)) {
    alert("Please fill out all fields correctly.");
    return;
  }

  let total = 0;
  CartArray.forEach((item) => {
    total += item.Price * item.qty;
  });

  const discountedTotal =
    discount !== 0 ? total - total * (discount / 100) : total;

  Oderarray.push({
    Name: name,
    Number: number,
    Items: CartArray,
    Discount: discount,
    Total: discountedTotal,
  });

  // 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    customerName: name,
    contact: number,
    itemID: 1,
    qty: 6,
    price: 4500,
    discount: discount,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:8080/mos/order/add", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      console.log(result);

      alert("Order placed successfully!");
      // Clear the cart and fields
      CartArray = [];
      displayCart();

      document.getElementById("name").value = "";
      document.getElementById("contact").value = "";
      document.getElementById("discount").value = "";
    })
    .catch((error) => console.error(error));
}
