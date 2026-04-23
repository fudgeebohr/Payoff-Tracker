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
  const [isPayConfirmOpen, setIsPayConfirmOpen] = useState(false);

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
    const response = await fetch(`${API_BASE}/save_record/update/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editData,
        amount: Number(editData.amount),
        totalMonths: Number(editData.totalMonths),
        paidMonths: Number(editData.paidMonths)
      })
    });

    if (response.ok) {
      // 1. Close the modal
      setIsEditing(false);
      
      // 2. Refresh the table data from the database
      await fetchRecords();
      
      // 3. Clear the selection
      setSelectedId(null);
      
      alert("Record updated successfully!");
    } else {
      const errorData = await response.json();
      alert(`Update failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Update error:", error);
    alert("An error occurred while updating the record.");
  }
  };

  const handlePayClick = () => {
    if (!selectedId) return alert("Please select an item from the table first!");
    setIsPayConfirmOpen(true);
  };

  const confirmPayment = async () => {
    setIsPayConfirmOpen(false); // Close modal immediately
    try {
      const response = await fetch(`${API_BASE}/save_record/pay/${selectedId}`, {
        method: "PUT",
      });

      if (response.ok) {
        const updatedData = await response.json();
        await fetchRecords();

        if (updatedData.archived) {
          alert(`${updatedData.itemName} has been fully paid and archived!`);
          setSelectedId(null);
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
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
            <button className="btn-action pay" onClick={handlePayClick}>Pay 1 Month</button>
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

      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="modal-title" style={{ textAlign: 'center', color: '#9b6d9b', marginBottom: '20px' }}>
              Edit Record
            </h2>
            
            <form onSubmit={handleUpdate} className="tracker-form">
              <input 
                type="text" 
                name="itemName" 
                value={editData.itemName} 
                onChange={handleEditChange} 
                placeholder="Item Name" 
                required 
              />
              <input 
                type="number" 
                name="amount" 
                value={editData.amount} 
                onChange={handleEditChange} 
                placeholder="Monthly Amortization" 
                required 
              />
              <input 
                type="number" 
                name="totalMonths" 
                value={editData.totalMonths} 
                onChange={handleEditChange} 
                placeholder="Total Months" 
                required 
              />
              <input 
                type="number" 
                name="paidMonths" 
                value={editData.paidMonths} 
                onChange={handleEditChange} 
                placeholder="Months Paid" 
                required 
              />
              
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

              <div className="modal-footer">
                <button type="submit" className="add-record-btn">Save Changes</button>
                <button type="button" className="logout-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPayConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="modal-title">Confirm Payment</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#5a4a5a' }}>
              Are you sure you want to add 1 month of progress to 
              <strong> {records.find(r => r._id === selectedId)?.itemName}</strong>?
            </p>
            
            <div className="modal-footer">
              <button className="add-record-btn" onClick={confirmPayment}>
                Yes, Confirm Payment
              </button>
              <button className="logout-btn" onClick={() => setIsPayConfirmOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tracker;