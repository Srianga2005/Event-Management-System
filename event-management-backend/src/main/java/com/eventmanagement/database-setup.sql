-- MySQL Database Setup for Event Management System
-- Run this script in your MySQL database before starting the application

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS EventManagement;

-- Use the database
USE EventManagement;

-- Create a user for the application (optional, you can use root if preferred)
CREATE USER IF NOT EXISTS 'eventuser'@'localhost' IDENTIFIED BY 'eventpass123';
GRANT ALL PRIVILEGES ON EventManagement.* TO 'eventuser'@'localhost';
FLUSH PRIVILEGES;

-- The application will automatically create tables when it starts
-- No need to create tables manually as JPA will handle this with ddl-auto=create-drop

-- Verify database creation
SHOW DATABASES;
SELECT 'Database setup completed successfully!' as Status;
