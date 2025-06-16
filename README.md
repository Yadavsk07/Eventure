# Eventure

A platform connecting event organizers and sponsors.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Eventure.git
cd Eventure
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd Eventure
npm install
```

3. Environment Setup:
   - Copy `.env.example` to `.env` in the server directory
   - Update the values in `.env` with your configuration:
     ```
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=your_database_name
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

4. Create required directories:
```bash
# In the server directory
mkdir uploads
```

5. Start the development servers:
```bash
# Start the backend server (from server directory)
npm run dev

# Start the frontend server (from client directory)
npm run dev
```

## Important Notes

- Never commit the `.env` file to version control
- The `uploads` directory is used for storing user-uploaded files
- Make sure your database is running and accessible
- The frontend runs on port 5173 by default
- The backend runs on port 5000 by default

## Security

- Keep your `.env` file secure and never share it
- Use strong passwords for your database
- Use a strong JWT secret
- Regularly update dependencies to patch security vulnerabilities
