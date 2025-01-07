# AlgoTrackr

AlgoTrackr is a personal LeetCode performance tracker that allows users to track their coding session timing, accuracy, and self-assessment of particular topics. It is designed for local deployment, making it easy to clone and run without external dependencies.

## Features
- **Session Tracking**: Records session time, accuracy, and mood.
- **Statistics Dashboard**: View historical performance trends.
- **Local Deployment**: Fully self-contained with local Postgres database support.
- **Customizable**: Modify and extend for personal use.

---

## Prerequisites
1. [Go](https://golang.org/dl/) (minimum version 1.18)
2. [Node.js](https://nodejs.org/) (minimum version 16)
3. [Postgres](https://www.postgresql.org/download/) (minimum version 14)

---

## Installation and Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/algotrackr.git
cd algotrackr
```

### Step 2: Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
go mod tidy
   ```

3. Configure the database connection in `main.go`:
   ```go
   db, err = sql.Open("postgres", "user=your_user password=your_password dbname=algotrackr sslmode=disable")
   ```
   Replace `your_user`, `your_password`, and `algotrackr` with your Postgres credentials and desired database name.

4. Run the backend:
   ```bash
go run main.go
   ```
   The backend will run on `http://localhost:8080` by default.

---

### Step 3: Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend/leettrack
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:8080
   ```

4. Run the frontend:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000` by default.

---

### Step 4: Set Up Postgres
1. Install Postgres:
   - **Linux**: Use your package manager (e.g., `sudo apt install postgresql`)
   - **macOS**: Use Homebrew (`brew install postgresql`)
   - **Windows**: Download the installer from the [official website](https://www.postgresql.org/download/).

2. Start the Postgres service:
   ```bash
   # For Linux/macOS
   sudo service postgresql start

   # For Windows, start from the Services app
   ```

3. Create a database:
   ```bash
   psql -U postgres
   CREATE DATABASE algotrackr;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE algotrackr TO your_user;
   \q
   ```

4. Initialize the database schema:
   ```bash
   psql -U your_user -d algotrackr -f backend/schema.sql
   ```
   Replace `your_user` with your Postgres username.

---

## Running the Application
1. Start the backend:
   ```bash
   cd backend
   go run main.go
   ```

2. Start the frontend:
   ```bash
   cd frontend/leettrack
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Customization
Feel free to modify the project to fit your needs:
- **Frontend**: Update React components in the `src` directory.
- **Backend**: Extend the API or change the logic in the `backend` folder.
- **Database**: Modify the schema to add new features.

---

## Contributing
Contributions are welcome! Please submit a pull request or open an issue if you encounter any bugs or have feature suggestions.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
