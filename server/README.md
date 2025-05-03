# Chaski Project

This document provides the necessary steps to configure and run the backend for the Chaski project, including Sequelize setup.

## Prerequisites

- Node.js installed
- npm or yarn package manager
- Database (e.g., PostgreSQL, MySQL, etc.)

## Backend Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/anne1609/Chaski.git
    cd chaski/server
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the root directory and configure the following variables:
    ```env
    POSTGRES_HOST=your_database_host
    POSTGRES_PORT=your_database_port
    POSTGRES_USER=your_database_user
    POSTGRES_PASSWORD=your_database_password
    POSTGRES_DB=your_database_name
    ```

4. Run database migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```

5. Start the server:
    ```bash
    npm start
    # or
    yarn start
    ```

## Sequelize Configuration

Sequelize is used as the ORM for database management. The configuration file is located at `config/config.js`. Update the file with your database credentials.

Example:
```javascript
module.exports = {
  development: {
     username: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     host: process.env.DB_HOST,
     dialect: 'postgres', // Change to your database dialect
  },
  // Add production and test configurations as needed
};
```

## Additional Notes

- Ensure your database is running before starting the server.
- Use `npx sequelize-cli` for additional Sequelize commands like creating models or seeds.

For further assistance, refer to the [Sequelize documentation](https://sequelize.org/).