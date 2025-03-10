CREATE DATABASE room_reservation;

USE room_reservation;

CREATE TABLE `rooms` (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO rooms (id, name, capacity) VALUES 
(1, 'Lab 101', 30),
(2, 'Seminar Hall', 50),
(3, 'Meeting Room', 10);

CREATE TABLE `reservations` (
  id INT NOT NULL AUTO_INCREMENT,
  room_id INT DEFAULT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose VARCHAR(255) DEFAULT NULL,
  attendees INT DEFAULT NULL,
  PRIMARY KEY (id),
  KEY room_id (room_id),
  CONSTRAINT reservations_ibfk_1 FOREIGN KEY (room_id) REFERENCES rooms (id)
);
