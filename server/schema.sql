-- Create database
CREATE DATABASE IF NOT EXISTS eventure_db;
USE eventure_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('organizer', 'sponsor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Organizers table
CREATE TABLE IF NOT EXISTS organizers (
    user_id VARCHAR(36) PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    about_organization TEXT,
    organization_type VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(255),
    profile_image VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    user_id VARCHAR(36) PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(20),
    about_organization TEXT,
    organization_type VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(255),
    profile_image VARCHAR(255),
    previously_sponsored_events TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(36) PRIMARY KEY,
    author_id VARCHAR(36) NOT NULL,
    content TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
); 