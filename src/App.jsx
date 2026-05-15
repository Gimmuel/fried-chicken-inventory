import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    supplier: "",
  });

  const loadItems = () => {
    fetch("http://localhost:5000/api/inventory")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setFormData({
      itemName: "",
      category: "",
      quantity: "",
      unit: "",
      supplier: "",
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:5000/api/inventory/${editId}`
      : "http://localhost:5000/api/inventory";

    fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        quantity: Number(formData.quantity),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        loadItems();
        clearForm();
      });
  };

  const editItem = (item) => {
    setEditId(item._id);
    setFormData({
      itemName: item.itemName,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      supplier: item.supplier,
    });
  };

  const deleteItem = (id) => {
    fetch(`http://localhost:5000/api/inventory/${id}`, {
      method: "DELETE",
    }).then(() => loadItems());
  };

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Fried Chicken Store Inventory</h1>
        <p style={styles.subtitle}>Database Report and Inventory Management</p>
      </div>

      <div style={styles.layout}>
        <div style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Schema Overview</h2>
          <div style={styles.schemaBox}>
            <h3>Database: inventoryDB</h3>
            <p>Collection: items</p>
          </div>

          <h3 style={styles.menuTitle}>Inventory Fields</h3>
          <ul style={styles.menuList}>
            <li>itemName</li>
            <li>category</li>
            <li>quantity</li>
            <li>unit</li>
            <li>supplier</li>
          </ul>
        </div>

        <div style={styles.content}>
          <div style={styles.orangeBar}>Table: items ({filteredItems.length})</div>

          <input
            placeholder="Search item, category, or supplier"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.search}
          />

          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required />
            <input style={styles.input} name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
            <input style={styles.input} name="quantity" type="number" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
            <input style={styles.input} name="unit" placeholder="Unit" value={formData.unit} onChange={handleChange} required />
            <input style={styles.input} name="supplier" placeholder="Supplier" value={formData.supplier} onChange={handleChange} required />

            <button style={styles.addBtn} type="submit">
              {editId ? "Update Item" : "Add Item"}
            </button>

            {editId && (
              <button style={styles.cancelBtn} type="button" onClick={clearForm}>
                Cancel
              </button>
            )}
          </form>

          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Item Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Supplier</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td style={styles.td} colSpan="7">No inventory items found.</td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item._id}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.itemName}</td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>{item.unit}</td>
                    <td style={styles.td}>{item.supplier}</td>
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => editItem(item)}>Edit</button>
                      <button style={styles.deleteBtn} onClick={() => deleteItem(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#f4f4f4",
    minHeight: "100vh",
  },
  header: {
    background: "white",
    padding: "25px",
    borderBottom: "5px solid #ff7a00",
  },
  title: {
    margin: 0,
    color: "#111",
    fontSize: "42px",
  },
  subtitle: {
    margin: 0,
    color: "#555",
    fontSize: "18px",
  },
  layout: {
    display: "flex",
  },
  sidebar: {
    width: "260px",
    background: "#39a800",
    minHeight: "85vh",
    color: "white",
    padding: "20px",
  },
  sidebarTitle: {
    textAlign: "center",
    background: "#0077b6",
    padding: "12px",
    margin: "-20px -20px 20px -20px",
  },
  schemaBox: {
    background: "#2d8f00",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center",
  },
  menuTitle: {
    background: "#1b6e00",
    padding: "10px",
    marginTop: "20px",
  },
  menuList: {
    background: "#d9ffd0",
    color: "#111",
    padding: "15px 30px",
    lineHeight: "28px",
  },
  content: {
    flex: 1,
    padding: "25px",
  },
  orangeBar: {
    background: "linear-gradient(to right, #ff6600, #ff9900)",
    color: "white",
    padding: "14px",
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "20px",
  },
  search: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    fontSize: "16px",
  },
  form: {
    background: "white",
    padding: "15px",
    marginBottom: "20px",
    border: "1px solid #ddd",
  },
  input: {
    padding: "10px",
    margin: "5px",
    width: "180px",
  },
  addBtn: {
    padding: "10px 18px",
    background: "#ff7a00",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cancelBtn: {
    padding: "10px 18px",
    marginLeft: "8px",
    background: "#555",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
  },
  th: {
    background: "#ff6600",
    color: "white",
    padding: "12px",
    border: "1px solid white",
  },
  td: {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
  },
  editBtn: {
    background: "#0077b6",
    color: "white",
    border: "none",
    padding: "7px 12px",
    marginRight: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#d62828",
    color: "white",
    border: "none",
    padding: "7px 12px",
    cursor: "pointer",
  },
};

export default App;