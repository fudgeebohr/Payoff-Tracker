import "./Tracker.css";
import React, { useState, useEffect } from "react";

const Tracker = ({ onLogout }) => {
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  // Lists for dynamic dropdowns
  const [payers, setPayers] = useState([]);
  const [platforms, setPlatforms] = useState([]);

  // Modal visibility states
  const [isEditing, setIsEditing] = useState(false);
  const [isPayConfirmOpen, setIsPayConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isPayerModalOpen, setIsPayerModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);

  // Form states
  const [editData, setEditData] = useState(null);
  const [newOption, setNewOption] = useState("");
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
    fetchOptions();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_BASE}/save_record`);
      const data = await response.json();
      setRecords(data.filter(r => !r.archived));
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const fetchOptions = async () => {
    try {
      const pRes = await fetch(`${API_BASE}/options/payers`);
      const plRes = await fetch(`${API_BASE}/options/platforms`);
      if (pRes.ok) setPayers(await pRes.json());
      if (plRes.ok) setPlatforms(await plRes.json());
    } catch (err) {
      console.error("Error fetching options:", err);
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
        setIsEditing(false);
        setSelectedId(null);
        await fetchRecords();
        alert("Record Updated!");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const confirmPayment = async () => {
    setIsPayConfirmOpen(false);
    try {
      const response = await fetch(`${API_BASE}/save_record/pay/${selectedId}`, {
        method: "PUT",
      });
      if (response.ok) {
        const updatedData = await response.json();
        await fetchRecords();
        if (updatedData.archived) {
          alert(`${updatedData.itemName} is now fully paid and archived!`);
          setSelectedId(null);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const confirmDelete = async () => {
    setIsDeleteConfirmOpen(false);
    try {
      const response = await fetch(`${API_BASE}/save_record/archive/${selectedId}`, {
        method: "PUT",
      });
      if (response.ok) {
        await fetchRecords();
        setSelectedId(null);
        alert("Record has been deleted.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleAddOption = async (type) => {
    if (!newOption.trim()) return alert("Please enter a name");
    const endpoint = type === 'payer' ? 'payers' : 'platforms';
    try {
      const res = await fetch(`${API_BASE}/options/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newOption })
      });
      if (res.ok) {
        setNewOption("");
        setIsPayerModalOpen(false);
        setIsPlatformModalOpen(false);
        await fetchOptions(); // Re-fetch to sync dropdowns immediately
        alert(`New ${type} added!`);
      }
    } catch (err) {
      console.error("Option add error:", err);
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
            {platforms.map(p => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <select name="payer" value={formData.payer} onChange={handleChange} required>
            <option value="" disabled hidden>Who is Paying?</option>
            {payers.map(p => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>

          <button type="submit" className="add-record-btn">+ Add Record</button>
          
          <div className="option-buttons-row">
            <button type="button" className="btn-action edit" onClick={() => setIsPayerModalOpen(true)}>+ Add Payer</button>
            <button type="button" className="btn-action edit" onClick={() => setIsPlatformModalOpen(true)}>+ Add Platform</button>
          </div>
        </form>

        <button onClick={() => { localStorage.removeItem("isLoggedIn"); onLogout(); }} className="logout-btn">Logout</button>
      </aside>

      <main className="main-content">
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Item</th><th>Platform</th><th>Payer</th><th>Monthly</th><th>Progress</th><th>Rem. Balance</th>
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
            <button className="btn-action pay" onClick={() => selectedId ? setIsPayConfirmOpen(true) : alert("Select item first")}>Pay 1 Month</button>
            <button className="btn-action edit" onClick={() => {
              const item = records.find(r => r._id === selectedId);
              if (item) { setEditData(item); setIsEditing(true); }
              else alert("Select item first");
            }}>Edit Selected</button>
            <button className="btn-action delete" onClick={() => selectedId ? setIsDeleteConfirmOpen(true) : alert("Select item first")}>Delete</button>
          </div>
          <div className="total-group">
            <span className="total-text">TOTAL MONTHLY DUE: </span>
            <span className="total-label"> ₱ {calculateTotalDue()}</span>
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="modal-title">Edit Record</h2>
            <form onSubmit={handleUpdate} className="tracker-form">
              <input type="text" name="itemName" value={editData.itemName} onChange={handleEditChange} required />
              <input type="number" name="amount" value={editData.amount} onChange={handleEditChange} required />
              <input type="number" name="totalMonths" value={editData.totalMonths} onChange={handleEditChange} required />
              <input type="number" name="paidMonths" value={editData.paidMonths} onChange={handleEditChange} required />
              
              <select name="platform" value={editData.platform} onChange={handleEditChange}>
                {platforms.map(p => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>

              <select name="payer" value={editData.payer} onChange={handleEditChange}>
                {payers.map(p => (
                  <option key={p._id} value={p.name}>{p.name}</option>
                ))}
              </select>

              <div className="modal-footer">
                <button type="submit" className="add-record-btn">Save Changes</button>
                <button type="button" className="logout-btn" onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAY CONFIRM MODAL */}
      {isPayConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="modal-title">Confirm Payment</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              Add 1 month of progress to <strong>{records.find(r => r._id === selectedId)?.itemName}</strong>?
            </p>
            <div className="modal-footer">
              <button className="add-record-btn" onClick={confirmPayment}>Confirm</button>
              <button className="logout-btn" onClick={() => setIsPayConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteConfirmOpen && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="modal-title" style={{color: '#ff6b6b'}}>Delete Record</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              Are you sure you want to delete <strong>{records.find(r => r._id === selectedId)?.itemName}</strong>?
            </p>
            <div className="modal-footer">
              <button className="add-record-btn" style={{backgroundColor: '#ff6b6b'}} onClick={confirmDelete}>Archive</button>
              <button className="logout-btn" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PAYER/PLATFORM MODALS */}
      {(isPayerModalOpen || isPlatformModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h2 className="modal-title">Add New {isPayerModalOpen ? "Payer" : "Platform"}</h2>
            <div className="tracker-form">
              <input 
                type="text" 
                placeholder={isPayerModalOpen ? "Enter Payer Name" : "Enter Platform Name"} 
                value={newOption} 
                onChange={(e) => setNewOption(e.target.value)} 
              />
              <div className="modal-footer">
                <button className="add-record-btn" onClick={() => handleAddOption(isPayerModalOpen ? 'payer' : 'platform')}>Save</button>
                <button className="logout-btn" onClick={() => {setIsPayerModalOpen(false); setIsPlatformModalOpen(false); setNewOption("");}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;