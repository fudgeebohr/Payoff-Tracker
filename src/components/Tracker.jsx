import "./Tracker.css";
import React, { useState, useEffect } from "react";

const Tracker = ({ onLogout }) => {
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    amount: "",
    totalMonths: "",
    paidMonths: "",
    platform: "",
    payer: ""
  });

  const API_BASE = "https://payofftrackerapi.onrender.com";

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE}/save_record`);
      const data = await response.json();
      // Only show items that are not archived
      setRecords(data.filter(r => !r.archived));
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.platform || !formData.payer) {
      alert("Please select a Platform and Payer.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/save_record`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          totalMonths: Number(formData.totalMonths),
          paidMonths: Number(formData.paidMonths) || 0,
          archived: false
        })
      });
      if (response.ok) {
        setFormData({ itemName: "", amount: "", totalMonths: "", paidMonths: "", platform: "", payer: "" });
        await fetchRecords();
        alert("Record Added!");
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/save_record/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });
      if (response.ok) {
        setIsEditing(false);
        await fetchRecords();
        alert("Record Updated!");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handlePayMonth = async () => {
    if (!selectedId) return alert("Please select an item from the table first!");
    const item = records.find(r => r._id === selectedId);
    const newPaidMonths = item.paidMonths + 1;
    const shouldArchive = newPaidMonths >= item.totalMonths;

    try {
      const response = await fetch(`${API_BASE}/save_record/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          paidMonths: newPaidMonths,
          archived: shouldArchive 
        })
      });
      if (response.ok) {
        await fetchRecords();
        if (shouldArchive) alert(`${item.itemName} is fully paid and archived!`);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return alert("Please select an item first!");
    const item = records.find(r => r._id === selectedId);
    if (window.confirm(`Are you sure you want to archive "${item.itemName}"?`)) {
      try {
        const response = await fetch(`${API_BASE}/save_record/${selectedId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ archived: true })
        });
        if (response.ok) {
          setSelectedId(null);
          await fetchRecords();
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const calculateTotalDue = () => {
    return records.reduce((sum, rec) => sum + rec.amount, 0).toLocaleString();
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="logo-container">
          <img src="https://iili.io/BgjZDb4.md.png" alt="Logo" className="sidebar-logo" />
        </div>

        <form onSubmit={handleSubmit} className="tracker-form">
          <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} placeholder="Item Name" required />
          <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Monthly Amortization" required />
          <input type="number" name="totalMonths" value={formData.totalMonths} onChange={handleChange} placeholder="Total Months" required />
          <input type="number" name="paidMonths" value={formData.paidMonths} onChange={handleChange} placeholder="Months Already Paid" />
          
          <select name="platform" value={formData.platform} onChange={handleChange} required>
            <option value="" disabled hidden>Select Platform</option>
            <option value="SPayLater">SPayLater</option>
            <option value="TikTok PayLater">TikTok PayLater</option>
            <option value="GLoan">GLoan</option>
          </select>

          <select name="payer" value={formData.payer} onChange={handleChange} required>
            <option value="" disabled hidden>Who is Paying?</option>
            <option value="Kenneth">Kenneth</option>
            <option value="Joy">Joy</option>
            <option value="Shane">Shane</option>
            <option value="Group (Thesis)">Group (Thesis)</option>
          </select>

          <button type="submit" className="add-record-btn">+ Add Record</button>
        </form>

        <button onClick={() => { localStorage.removeItem("isLoggedIn"); onLogout(); }} className="logout-btn">Logout</button>
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
                <tr 
                  key={rec._id} 
                  onClick={() => setSelectedId(rec._id)}
                  className={selectedId === rec._id ? "selected-row" : ""}
                >
                  <td>{rec.itemName}</td>
                  <td>{rec.platform}</td>
                  <td>{rec.payer}</td>
                  <td>₱{rec.amount.toLocaleString()}</td>
                  <td>{rec.paidMonths}/{rec.totalMonths}</td>
                  <td className="balance">₱{(rec.amount * (rec.totalMonths - rec.paidMonths)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="summary-footer">
          <div className="action-buttons">
            <button className="btn-action pay" onClick={handlePayMonth}>Pay 1 Month</button>
            <button className="btn-action edit" onClick={() => {
              const item = records.find(r => r._id === selectedId);
              if (item) { setEditData(item); setIsEditing(true); }
              else { alert("Select an item first!"); }
            }}>Edit Selected</button>
            <button className="btn-action delete" onClick={handleDelete}>Delete</button>
          </div>
          <div className="total-group">
            <span className="total-text">TOTAL MONTHLY DUE: </span>
            <span className="total-label"> ₱ {calculateTotalDue()}</span>
          </div>
        </div>
      </main>

      {/* Edit Modal Overlay */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="login-title">Edit Record</h2>
            <form onSubmit={handleUpdate} className="tracker-form">
              <input type="text" name="itemName" value={editData.itemName} onChange={handleEditChange} placeholder="Item Name" required />
              <input type="number" name="amount" value={editData.amount} onChange={handleEditChange} placeholder="Monthly Amortization" required />
              <input type="number" name="totalMonths" value={editData.totalMonths} onChange={handleEditChange} placeholder="Total Months" required />
              <input type="number" name="paidMonths" value={editData.paidMonths} onChange={handleEditChange} placeholder="Months Paid" required />
              
              <select name="platform" value={editData.platform} onChange={handleEditChange}>
                <option value="SPayLater">SPayLater</option>
                <option value="TikTok PayLater">TikTok PayLater</option>
                <option value="GLoan">GLoan</option>
              </select>

              <select name="payer" value={editData.payer} onChange={handleEditChange}>
                <option value="Kenneth">Kenneth</option>
                <option value="Joy">Joy</option>
                <option value="Shane">Shane</option>
                <option value="Group (Thesis)">Group (Thesis)</option>
              </select>

              <button type="submit" className="add-record-btn">Save Changes</button>
              <button type="button" className="logout-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;