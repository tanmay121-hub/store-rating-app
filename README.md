# 🏪 Store Rating System (Full-Stack Application)

A **Full-Stack Web Application** built with React.js, Node.js, Express.js, and Sequelize that provides a comprehensive store rating platform with role-based access control.

> - Multi-Role Authentication System
> - Store & Rating Management
> - Real-time Dashboard Analytics  
> - Responsive UI with Smooth Animations

---

## ✨ Features
- Three-tier Role System (Admin, User, Store Owner)
- User signup & login with `JWT` authentication
- 5-star rating system with user reviews
- Analytics dashboard for admins and store owners
- Modern UI with Tailwind CSS & Framer Motion
- Secure password hashing with `bcrypt`

---

## 🧑‍💻 Tech Stack
| Technology | Usage |
|------------|--------|
| ⚛️ React.js | Front End |
| 🎨 Tailwind CSS |	Utility-first CSS |
| 🧪 Express.js | HTTP framework |
| 🎭 Framer Motion |	Animations
| 🐬 MySQL2 | MySQL client |
| 🚀 React Router | Navigation |
| 🛠 Sequelize | ORM and migrations |
| 🔐 JWT | Authentication tokens |
| 🔐 bcryptjs | Password hashing |
| 🛠 nodemon | Auto-reload during dev |

---

## 📂 Project Structure
store-rating-app/  
├── backend/  
│   ├── config/           ← Database configuration  
│   ├── controllers/      ← Business logic  
│   ├── middleware/       ← Auth & validation  
│   ├── models/          ← Sequelize models  
│   ├── routes/          ← API endpoints  
│   ├── scripts/         ← DB initialization  
│   ├── .env             ← Environment variables  
│   ├── server.js        ← Entry point  
│   └── package.json  
├── frontend/  
│   ├── public/  
│   ├── src/  
│   │   ├── components/  ← React components  
│   │   │   ├── Auth/  
│   │   │   ├── Dashboard/  
│   │   │   ├── Layout/  
│   │   │   ├── Store/  
│   │   │   └── User/  
│   │   ├── contexts/    ← Auth context  
│   │   ├── services/    ← API services  
│   │   └── App.js  
│   ├── tailwind.config.js  
│   └── package.json  
└── README.md  

---

## ⚙️ Getting Started

###  Step 1: Clone & Install
```bash
git clone https://github.com/tanmay121-hub/store-rating-app
cd store-rating-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

```
### Step 2: Setup MySQL
Create a MySQL database:
```bash
CREATE DATABASE store_rating_db;
```
Add credentials to .env:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=your_secret_key_here
PORT=5000
```
### Step 3: Initialize Database
```bash
cd backend
npm run dev
# In another terminal
node scripts/init.js
```
###  Step 4: Run Application
Start Backend:

```bash
cd backend
npm run dev
```
Start Frontend:

```bash
cd frontend
npm start
```  
Access the application at `http://localhost:3000`


---


## 🔮 Future Improvements  
- Review comments with ratings  
- Email notifications  
- Advanced analytics charts  
- Geolocation-based search  
- Mobile app development  
- Real-time updates with WebSockets  
- Store image uploads  
- Premium store features  

---
Admin Account
```text
Email: admin@example.com
Password: Admin@123
```
---
## 🤝 Contributing  
Contributions are welcome! Feel free to:

1. Fork the repo

2. Create a new branch ('git checkout -b feature-xyz')

3. Commit your changes ('git commit -m 'Add feature xyz'')

4. Push to branch ('git push origin feature-xyz')

5. Create a pull request

---

## 🧑‍💻 Author
Tanmay Patil — Full Stack Developer  
[GitHub](https://github.com/tanmay121-hub) - [LinkedIn](https://www.linkedin.com/in/tanmay-patil-10997a259/)
