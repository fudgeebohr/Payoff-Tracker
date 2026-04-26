<div align="center">
  
  <div align="center">  
    <img src="https://iili.io/BgjZDb4.md.png" alt="Homepage" width="320">  
  </div>
  
  #### **Personal and Group BNPLs & PayLaters Tracker**

  **Payoff Tracker** is a comprehensive full-stack financial management tool designed to simplify the tracking of installment-based purchases. Built with the MERN stack, the application allows users to monitor monthly amortizations across various payment platforms and payers in real-time.

[![GitHub issues](https://img.shields.io/github/issues/fudgeebohr/Payoff-Tracker?style=flat-square&logo=github&color=orange)](https://github.com/fudgeebohr/Payoff-Tracker/issues) [![Feature Requests](https://img.shields.io/github/issues/fudgeebohr/Payoff-Tracker/feature%20request?label=feature%20requests&style=flat-square&logo=github&color=brightgreen)](https://github.com/fudgeebohr/Payoff-Tracker/issues?q=is%3Aopen+is%3Aissue+label%3A%22feature+request%22)

</div>

---

## **Preview**
<div align="center">

<a href="https://ibb.co/QvBG9Vn0"><img src="https://i.ibb.co/XxBTXPpH/Screenshot-2026-04-26-101800.png" alt="Screenshot-2026-04-26-101800" border="0"></a>

<a href="https://ibb.co/SwCr2qV8"><img src="https://i.ibb.co/zVvJ1KPY/image.png" alt="image" border="0"></a> 

</div>

---

## **Tech Stack**

This project follows the **MERN (subset)** architecture, utilizing modern JavaScript tools for both the client and the server.

| Component | Technology | Description |
| ----- | ----- | ----- |
| Frontend | ![React.js](https://img.shields.io/badge/react.js-%2320232a.svg?style=for-the-badge\&logo=react\&logoColor=%2361DAFB) | For building a dynamic, component-based user interface. |
|  | ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge\&logo=css3\&logoColor=white) | Custom styles with a "Glassmorphism" inspired design, featuring distinct purple and soft-white color palettes. |
|  | ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge\&logo=vite\&logoColor=white) | Used as the build tool for high-performance development and bundling. |
| Backend | ![NodeJS](https://img.shields.io/badge/node.js-6DA55F.svg?style=for-the-badge\&logo=node.js\&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge\&logo=express\&logoColor=%2361DAFB) | A lightweight and flexible framework for handling API requests and routing. |
|  | ![Mongoose](https://img.shields.io/badge/-Mongoose-000?\&logo=MongoDB\&logoColor=white\&s) | An ODM (Object Data Modeling) library for MongoDB to handle data validation and schema management. |
| Database | ![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-%234ea94b.svg?style=for-the-badge\&logo=mongodb\&logoColor=white) | A cloud-hosted NoSQL database used to store records, users, and dynamic dropdown options. |
| Authentication & Security | ![bcrypt.js](https://img.shields.io/badge/Bcrypt-Password\_Hashing-red?style=for-the-badge\&logo=letsencrypt\&logoColor=white) | For hashing passwords before storing them in the database. |
|  | ![CORS](https://img.shields.io/badge/CORS-Configured-339933?style=flat-square\&logo=nodedotjs\&logoColor=white) | To securely allow the frontend to communicate with the Render-hosted API.  |
| Deployment | ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge\&logo=render\&logoColor=white) | Used for hosting both the live API and the static frontend build. |

---

## **Key Features**

* **User Authentication:** Secure Login and Logout system that protects the dashboard using `localStorage`.  
* **Dynamic Installment Tracker:**  
  * **Real-time Calculations:** Automatically calculates "Remaining Balance" per item and "Total Monthly Due" for all active records.  
  * **Progress Tracking:** Visual representation of `paidMonths` vs `totalMonths`.  
* **Soft-Delete (Archiving):** Items are never permanently erased; instead, they are flagged as `archived` so they can be kept for historical records while being hidden from the active list.  
* **Automated Payment Logic:** A "Pay 1 Month" feature that increments progress and automatically archives the item once the final month is paid.  
* **Dynamic Select Menus:** Ability to add new **Payers** and **Platforms** on the fly via modals, which instantly update the dropdown menus across the app without a page reload.  
* **Responsive Selection UI:** Interactive table where users click rows to select them for editing, paying, or archiving.

---

## **Project Structure**

#### **Backend [(expressNodeApp)](https://github.com/fudgeebohr/expressNodeApp)**

```text
/  
├── API/  
│   ├── auth.js          # Logic for User Login/Registration  
│   ├── save_record.js   # CRUD operations for the Tracker records  
│   └── options.js       # Routes for adding/fetching Payers and Platforms  
├── models/  
│   ├── User.js          # MongoDB Schema for users  
│   ├── Tracker.js       # MongoDB Schema for active/archived records  
│   └── Options.js       # MongoDB Schemas for Payer and Platform strings  
├── .env                 # Environment variables (MONGO_URI, PORT)  
├── index.js             # Main server entry point and middleware config  
└── package.json         # Backend dependencies  
```

#### **Frontend [(Payoff-Tracker)](https://github.com/fudgeebohr/Payoff-Tracker)**

```text  
/src/  
├── components/  
│   ├── Login.jsx        # Login screen component  
│   ├── Login.css        # Styles for the entry screen  
│   ├── Tracker.jsx      # Main Dashboard logic and state management  
│   └── Tracker.css      # Complex styles for the table, sidebar, and modals  
├── App.jsx              # Main App wrapper handling auth state switching  
├── main.jsx             # React entry point  
└── assets/              # Logos and background images  
``` 
