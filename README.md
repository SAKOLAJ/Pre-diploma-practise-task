Setup Guide
Prerequisites
Before running the server, ensure you have the following installed:
•	Node.js: Download and install from Node.js official website
•	MySQL: Download and install from MySQL official website
MySQL Setup
1.	During the installation of MySQL, set the root password to root (or another password of your choice).
2.	If you choose a different password, update it in the index.js file accordingly.
3.	Open the command prompt and access MySQL:
mysql -u root -p
4.	Enter the password you set during installation.
5.	Execute the SQL commands provided during the MySQL installation to set up the database.
Project Setup
1.	Move the index.js file to the user directory:
C:\Users\User\
2.	Install the required Node.js dependencies:
npm install express mysql2 cors moment-timezone
This will install all necessary packages.
3.	Add the domain configuration inside index.js to specify allowed origins for CORS. 
app.use(cors({
origin: '*', 
methods: ['GET', 'POST'], 
allowedHeaders: ['Content-Type']
}));
4.	Add the code from schema.sql into database through command prompt (add insert section only after creating tables).
Running the Server
1.	Open the command prompt and navigate to the directory containing index.js.
2.	Start the server using the following command:
node index.js
Or, if the file is inside a subdirectory, use the appropriate path:
node server\index.js
The server should now be running and connected to the MySQL database.
