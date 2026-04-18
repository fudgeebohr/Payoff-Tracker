import "./Tracker.css";
import React, { useState } from "react";

const Tracker = () => {
  const [formData, setFormData] = useState({
    itemName: "",
    amount: "",
    category: "General",
    status: "Pending"
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
    
    if (!formData.itemName || !formData.amount) {
      alert("Please enter the item name and amount.");
      return;
    }

    console.log("Form Submitted Successfully (Dummy Mode):", formData);
    
    alert(`Success! Tracked: ${formData.itemName} for ₱${formData.amount}`);

    setFormData({ itemName: "", amount: "", category: "General", status: "Pending" });
  };

  return (
    <div className="tracker-container">
      <h2>Payoff Entry</h2>
      <form onSubmit={handleSubmit} className="tracker-form">
        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            placeholder="e.g., Monthly Rent"
          />
        </div>

        <div className="form-group">
          <label>Amount (PHP):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="General">General</option>
            <option value="Bills">Bills</option>
            <option value="Education">Education</option>
            <option value="Leisure">Leisure</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Save Record</button>
      </form>
    </div>
  );
};

export default Tracker;