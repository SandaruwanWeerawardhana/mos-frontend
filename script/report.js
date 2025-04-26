function showReport(type) {
    document.getElementById("customerReport").classList.remove("active");
    document.getElementById("itemReport").classList.remove("active");

    if (type === "customer") {
      document.getElementById("customerReport").classList.add("active");
      loadCustomerReport();
    } else if (type === "item") {
      document.getElementById("itemReport").classList.add("active");
      loadItemReport();
    }
  }

  function loadCustomerReport() {
    fetch("http://localhost:8080/mos/customer/get-all")
      .then(res => res.json())
      .then(data => {
        let body = "";
        data.forEach(el => {
          body += `
            <tr>
              <td>${el.id}</td>
              <td>${el.name}</td>
              <td>${el.contact}</td>
              <td>${el.address}</td>
            </tr>
          `;
        });
        document.getElementById("customerBody").innerHTML = body;
      });
  }

  function loadItemReport() {
    fetch("http://localhost:8080/mos/item/get-all")
      .then(res => res.json())
      .then(data => {
        let body = "";
        data.forEach(el => {
          body += `
            <tr>
              <td>${el.id}</td>
              <td>${el.name}</td>
              <td>${el.qtyOnHand}</td>
              <td>${el.price}</td>
            </tr>
          `;
        });
        document.getElementById("itemBody").innerHTML = body;
      });
  }

  loadItemReport();
  function filterCustomerTable() {
    const search = document.getElementById("customerSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#customerBody tr");
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(search) ? "" : "none";
    });
  }

  function filterItemTable() {
    const search = document.getElementById("itemSearch").value.toLowerCase();
    const rows = document.querySelectorAll("#itemBody tr");
    rows.forEach(row => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(search) ? "" : "none";
    });
  }


  function printBill() {
    let billContent = `
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Customer Bill</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Item Name</th>
                <th>QTY</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${document.getElementById("itemBody").innerHTML}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    let printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  }
  
  function printCustomerBill() {
    let billContent = `
      <html>
        <head>
          <title>Customer Bill</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Customer Report<br><small>${new Date().toLocaleString()}</small></h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              ${document.getElementById("customerBody").innerHTML}
            </tbody>
          </table>
        </body>
      </html>
    `;
  
    let printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(billContent);
    printWindow.document.close();
    printWindow.print();
  }
  
