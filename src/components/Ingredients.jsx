import "./Ingredients.css";
import React, { useState } from "react";

const Ingredients = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    unit: "",
    supplier: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category before submitting!");
      return;
    }

    console.log("Inventory Data Submitted:", formData);

    setFormData({
      itemName: "",
      category: "",
      quantity: "",
      unit: "",
      supplier: "",
    });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h1>Fried Chicken Store Inventory</h1>
        <p>Fill out the ingredient details below</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="itemName">Ingredient Name</label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              placeholder="Example: Chicken, Flour, Oil"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="unit">Unit</label>
            <input
              type="text"
              id="unit"
              name="unit"
              placeholder="kg, pcs, liters, packs"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="supplier">Supplier</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              placeholder="Enter supplier name"
              value={formData.supplier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Meat">Meat</option>
              <option value="Seasoning">Seasoning</option>
              <option value="Cooking Oil">Cooking Oil</option>
              <option value="Packaging">Packaging</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            Add Inventory Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Ingredients;