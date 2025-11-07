# MySQL Database Setup for Event Management System

This guide will help you set up MySQL database for the Event Management System.

## Prerequisites

1. **MySQL Server** installed and running
2. **MySQL Workbench** or **MySQL Command Line Client** for database management

## Step 1: Install MySQL (if not already installed)

### Windows:
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer and follow the setup wizard
3. Remember the root password you set during installation

### macOS:
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Step 2: Start MySQL Service

### Windows:
- MySQL service should start automatically
- You can also start it from Services.msc

### macOS:
```bash
brew services start mysql
```

### Linux:
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

## Step 3: Create Database and User

1. **Connect to MySQL** using MySQL Workbench or command line:
   ```bash
   mysql -u root -p
   ```

2. **Run the database setup script**:
   ```sql
   -- Create the database
   CREATE DATABASE IF NOT EXISTS EventManagement;
   
   -- Use the database
   USE EventManagement;
   
   -- Create application user (optional)
   CREATE USER IF NOT EXISTS 'eventuser'@'localhost' IDENTIFIED BY 'eventpass123';
   GRANT ALL PRIVILEGES ON EventManagement.* TO 'eventuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

   Or run the provided script:
   ```bash
   mysql -u root -p < database-setup.sql
   ```

## Step 4: Update Application Configuration

The application is already configured to use MySQL. Check your `application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/EventManagement
spring.datasource.username=root
spring.datasource.password=Deban@23
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

**Important**: Make sure your MySQL password matches what's in the configuration file.

## Step 5: Install MySQL JDBC Driver

The MySQL JDBC driver has been added to the `pom.xml` file. Clean and rebuild the project:

```bash
cd event-management-backend
mvn clean install
```

## Step 6: Start the Application

```bash
mvn spring-boot:run
```

## Troubleshooting

### Common Issues:

1. **"Cannot load driver class: com.mysql.cj.jdbc.Driver"**
   - Solution: Make sure MySQL connector is in `pom.xml` and run `mvn clean install`

2. **"Access denied for user 'root'@'localhost'"**
   - Solution: Check your MySQL password in `application.properties`
   - Reset MySQL root password if needed

3. **"Unknown database 'EventManagement'"**
   - Solution: Create the database using the SQL script above

4. **"Connection refused"**
   - Solution: Make sure MySQL service is running
   - Check if MySQL is listening on port 3306

### Reset MySQL Root Password (if needed):

1. Stop MySQL service
2. Start MySQL in safe mode:
   ```bash
   mysqld --skip-grant-tables
   ```
3. Connect without password:
   ```bash
   mysql -u root
   ```
4. Reset password:
   ```sql
   USE mysql;
   UPDATE user SET authentication_string = PASSWORD('your_new_password') WHERE User = 'root';
   FLUSH PRIVILEGES;
   EXIT;
   ```
5. Restart MySQL service normally

## Database Management

### View Tables:
```sql
USE EventManagement;
SHOW TABLES;
```

### View Data:
```sql
SELECT * FROM users;
SELECT * FROM events;
SELECT * FROM categories;
SELECT * FROM bookings;
```

### Backup Database:
```bash
mysqldump -u root -p EventManagement > event_management_backup.sql
```

### Restore Database:
```bash
mysql -u root -p EventManagement < event_management_backup.sql
```

## Alternative: Use Different Database User

If you prefer not to use the root user, update `application.properties`:

```properties
spring.datasource.username=eventuser
spring.datasource.password=eventpass123
```

## Verification

After starting the application, you should see:
1. Tables created automatically (users, events, categories, bookings)
2. Sample data inserted
3. Application running on http://localhost:8080

Check the console logs for any database connection messages or errors.
