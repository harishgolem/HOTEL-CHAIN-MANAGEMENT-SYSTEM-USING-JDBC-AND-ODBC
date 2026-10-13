# StaySphere — Hotel Chain Management (PAT 4)

A responsive hotel-chain dashboard built with **HTML, CSS, JavaScript and Vite**. It includes a login screen, property directory, filters/search, reservation management, and create/read/update/delete actions. The demo stores changes in the browser's `localStorage`, so it works without configuring a database. MySQL DDL/DML for the database portion is provided in `database/schema.sql`.

## Demo login
- Email: `admin@staysphere.com`
- Password: `admin123`

This is a classroom demo login, not production authentication. Do not use these credentials for a real service.

## Run in the lab

Install Node.js LTS from https://nodejs.org/ (npm is included). Then open a terminal in this project folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Keep the terminal open while using the app. Stop the server with `Ctrl+C`.

### Windows shortcut
Double-click `run.bat`. It opens a terminal, installs dependencies if needed, and runs `npm run dev`.

### Build a static production bundle
```bash
npm run build
npm run preview
```

## Features
- Login page with demo credentials.
- Dashboard summary cards and hotel portfolio.
- Hotel directory search across hotel name, city, type and status.
- Filters for city, property type and status; reset filters.
- Add, edit and delete hotels with validation and reservation safety check.
- Create, edit and delete reservations; check-out must be after check-in.
- Search reservations by guest, property, room or status.
- Browser persistence through `localStorage`.

## Database setup (MySQL)
1. Install MySQL Community Server 8.0+ and MySQL Workbench (or use the MySQL installation provided by your lab).
2. Open Workbench and connect to your local MySQL server.
3. Open `database/schema.sql`, execute the script, then run `USE staysphere;` and `SELECT * FROM hotels;` to verify.
4. The SQL file demonstrates DDL (`CREATE DATABASE`, `CREATE TABLE`, constraints) and DML (`INSERT`, `SELECT`, `UPDATE`, `DELETE`, `COMMIT`).
5. The current front end uses browser storage and does **not** connect to MySQL directly. A browser must not connect straight to a database. For a live database-backed version, add a Node/Express backend and a MySQL driver such as `mysql2`; never put DB passwords in front-end JavaScript.

## Notes for assessment
- `npm run dev` is the normal executable run command for this web project; it is not a standalone Windows `.exe`.
- If your instructor literally requires a Windows `.exe`, that needs a desktop wrapper such as Electron and a Windows build environment.
- Data stored in `localStorage` is local to that browser profile. Use the SQL file to demonstrate the database DDL/DML separately.
