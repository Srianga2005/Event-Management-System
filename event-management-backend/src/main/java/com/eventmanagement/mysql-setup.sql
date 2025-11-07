-- MySQL Database Setup for Event Management System
-- Run this script in MySQL Workbench or command line

-- Create database
CREATE DATABASE IF NOT EXISTS event_management_db;
USE event_management_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN', 'ORGANIZER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date_time DATETIME NOT NULL,
    end_date_time DATETIME NOT NULL,
    location VARCHAR(200),
    max_attendees INT,
    ticket_price DECIMAL(10,2),
    image_url VARCHAR(500),
    status ENUM('ACTIVE', 'CANCELLED', 'COMPLETED') DEFAULT 'ACTIVE',
    organizer_id BIGINT NOT NULL,
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    number_of_tickets INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED') DEFAULT 'PENDING',
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Technology', 'Tech conferences, workshops, and meetups'),
('Business', 'Business seminars, networking events, and conferences'),
('Education', 'Educational workshops, training sessions, and courses'),
('Entertainment', 'Concerts, shows, and entertainment events'),
('Sports', 'Sports events, tournaments, and competitions'),
('Health & Wellness', 'Health seminars, fitness events, and wellness workshops');

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@eventhub.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin', 'User', 'ADMIN');

-- Insert sample regular user (password: user123)
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('user', 'user@eventhub.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Regular', 'User', 'USER');

-- Insert sample organizer (password: organizer123)
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('organizer', 'organizer@eventhub.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Event', 'Organizer', 'ORGANIZER');

-- Insert sample events
INSERT INTO events (title, description, start_date_time, end_date_time, location, max_attendees, ticket_price, organizer_id, category_id) VALUES
('Tech Conference 2024', 'Annual technology conference featuring the latest innovations', '2024-12-25 10:00:00', '2024-12-25 18:00:00', 'Convention Center', 500, 99.99, 3, 1),
('Business Networking Event', 'Connect with industry professionals and expand your network', '2024-12-20 18:00:00', '2024-12-20 21:00:00', 'Business Center', 200, 49.99, 3, 2),
('Web Development Workshop', 'Hands-on workshop on modern web development techniques', '2024-12-22 09:00:00', '2024-12-22 17:00:00', 'Tech Hub', 50, 149.99, 3, 1);

-- Show tables
SHOW TABLES;

-- Show sample data
SELECT 'Users:' as Table_Name;
SELECT * FROM users;

SELECT 'Categories:' as Table_Name;
SELECT * FROM categories;

SELECT 'Events:' as Table_Name;
SELECT * FROM events;
