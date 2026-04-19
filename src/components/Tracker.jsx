import "./Tracker.css";
import React, { useState, useEffect } from "react";
import logo from "./assets/logo.png";

const Tracker = () => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    itemName: "",
    amount: "",
    totalMonths: "",
    paidMonths: "",
    platform: "SPayLater",
    payer: "Kenneth"
  });

  const API_BASE = "https://payofftrackerapi.onrender.com";

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE}/save_record`);
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/save_record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          totalMonths: Number(formData.totalMonths),
          paidMonths: Number(formData.paidMonths)
        })
      });

      if (response.ok) {
        setFormData({ 
          itemName: "", amount: "", totalMonths: "", 
          paidMonths: "", platform: "SPayLater", payer: "Kenneth" 
        });
        await fetchRecords();
        alert("Record Added!");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const calculateTotalDue = () => {
    return records.reduce((sum, rec) => sum + rec.amount, 0).toLocaleString();
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Payoff Tracker Logo" className="sidebar-logo" />
          <p className="sub-logo">by fudgeebohr</p>
        </div>

        <form onSubmit={handleSubmit} className="tracker-form">
          <label>Item Name</label>
          <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} placeholder="e.g. iPhone 13" />

          <label>Monthly Amortization</label>
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" />

          <label>Total Months (Duration)</label>
          <input type="number" name="totalMonths" value={formData.totalMonths} onChange={handleChange} placeholder="e.g. 12" />

          <label>Months Already Paid</label>
          <input type="number" name="paidMonths" value={formData.paidMonths} onChange={handleChange} placeholder="e.g. 5" />

          <label>Platform</label>
          <select name="platform" value={formData.platform} onChange={handleChange}>
            <option value="SPayLater">SPayLater</option>
            <option value="TikTok PayLater">TikTok PayLater</option>
            <option value="GLoan">GLoan</option>
          </select>

          <label>Who is Paying?</label>
          <select name="payer" value={formData.payer} onChange={handleChange}>
            <option value="Kenneth">Kenneth</option>
            <option value="Joy">Joy</option>
            <option value="Shane">Shane</option>
            <option value="Group (Thesis)">Group (Thesis)</option>
          </select>

          <button type="submit" className="add-record-btn">+ Add Record</button>
        </form>
      </aside>

      <main className="main-content">
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Platform</th>
                <th>Payer</th>
                <th>Monthly</th>
                <th>Progress</th>
                <th>Rem. Balance</th>
              </tr>
            </thead>
            <tbody>
              {records.map((rec) => (
                <tr key={rec._id}>
                  <td>{rec.itemName}</td>
                  <td>{rec.platform}</td>
                  <td>{rec.payer}</td>
                  <td>₱{rec.amount.toLocaleString()}</td>
                  <td>{rec.paidMonths}/{rec.totalMonths}</td>
                  <td className="balance">
                    ₱{(rec.amount * (rec.totalMonths - rec.paidMonths)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="summary-footer">
          <span className="total-label">₱ {calculateTotalDue()}</span>
          <span className="total-text">TOTAL MONTHLY DUE:</span>
        </div>
      </main>
    </div>
  );
};

export default Tracker;