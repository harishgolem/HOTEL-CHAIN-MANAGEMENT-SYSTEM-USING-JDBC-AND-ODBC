-- StaySphere Hotel Chain Management
-- MySQL 8.0+ | Run this script in MySQL Workbench or mysql CLI.
CREATE DATABASE IF NOT EXISTS staysphere;
USE staysphere;

-- DDL: master property table
CREATE TABLE IF NOT EXISTS hotels (
  hotel_id INT AUTO_INCREMENT PRIMARY KEY,
  hotel_name VARCHAR(100) NOT NULL,
  city VARCHAR(60) NOT NULL,
  property_type ENUM('Luxury','Business','Resort') NOT NULL,
  room_count INT NOT NULL CHECK (room_count > 0),
  rating DECIMAL(2,1) NOT NULL DEFAULT 4.5 CHECK (rating BETWEEN 1 AND 5),
  price_per_night DECIMAL(10,2) NOT NULL CHECK (price_per_night > 0),
  hotel_status ENUM('Active','Maintenance') NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DDL: reservations table with referential integrity
CREATE TABLE IF NOT EXISTS reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  guest_name VARCHAR(100) NOT NULL,
  hotel_id INT NOT NULL,
  room_type ENUM('Standard','Deluxe','Suite','Family') NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guest_count INT NOT NULL DEFAULT 1 CHECK (guest_count > 0),
  booking_status ENUM('Confirmed','Pending','Cancelled') NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservation_hotel FOREIGN KEY (hotel_id)
    REFERENCES hotels(hotel_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT chk_stay_dates CHECK (check_out > check_in)
);

-- DDL: application login account (demo credentials only; change for real deployment)
CREATE TABLE IF NOT EXISTS app_users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN','STAFF') NOT NULL DEFAULT 'STAFF'
);

-- DML: sample hotel data
INSERT INTO hotels (hotel_name, city, property_type, room_count, rating, price_per_night, hotel_status)
SELECT 'StaySphere Marina','Chennai','Luxury',124,4.8,6800,'Active'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_name='StaySphere Marina' AND city='Chennai');
INSERT INTO hotels (hotel_name, city, property_type, room_count, rating, price_per_night, hotel_status)
SELECT 'StaySphere Garden','Bengaluru','Business',86,4.6,4200,'Active'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_name='StaySphere Garden' AND city='Bengaluru');
INSERT INTO hotels (hotel_name, city, property_type, room_count, rating, price_per_night, hotel_status)
SELECT 'StaySphere Palace','Hyderabad','Luxury',152,4.9,7900,'Active'
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotel_name='StaySphere Palace' AND city='Hyderabad');

-- DML: sample reservation data (links to existing hotels)
INSERT INTO reservations (guest_name, hotel_id, room_type, check_in, check_out, guest_count, booking_status)
SELECT 'Aarav Sharma', hotel_id, 'Deluxe', '2026-10-18', '2026-10-21', 2, 'Confirmed'
FROM hotels WHERE hotel_name='StaySphere Marina' AND city='Chennai'
AND NOT EXISTS (SELECT 1 FROM reservations WHERE guest_name='Aarav Sharma' AND check_in='2026-10-18');

-- READ / SELECT examples
SELECT * FROM hotels ORDER BY hotel_name;
SELECT * FROM hotels WHERE city='Chennai';
SELECT * FROM hotels WHERE property_type='Luxury' AND hotel_status='Active'
  AND price_per_night <= 8000;
SELECT r.reservation_id, r.guest_name, h.hotel_name, h.city, r.room_type,
       r.check_in, r.check_out, r.booking_status
FROM reservations r JOIN hotels h ON h.hotel_id=r.hotel_id
WHERE r.booking_status <> 'Cancelled'
ORDER BY r.check_in;

-- CREATE / INSERT example
-- INSERT INTO hotels (hotel_name, city, property_type, room_count, rating, price_per_night, hotel_status)
-- VALUES ('StaySphere Lakeside','Pune','Resort',70,4.6,5700,'Active');

-- UPDATE example (DML)
-- UPDATE hotels SET price_per_night=7200, hotel_status='Active' WHERE hotel_id=1;

-- DELETE example (DML); only delete hotels with no reservations because of FK constraint
-- DELETE FROM hotels WHERE hotel_id=4;
-- DELETE FROM reservations WHERE reservation_id=1;

-- Transaction example
START TRANSACTION;
UPDATE hotels SET rating = rating WHERE hotel_id = 1;
COMMIT;
-- If a group of changes fails, use ROLLBACK before COMMIT.
