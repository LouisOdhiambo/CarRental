const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Function to execute a SQL query
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "kumiliki",
  database: "rentals",
});

async function createTables() {
  try {
    // Connect to the database
    await db.connect();

    // Query to create the Customers table
    await executeQuery(`
      CREATE TABLE Customers (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50),
        email VARCHAR(100),
        phone_number VARCHAR(20)
      );
    `);

    // Query to create the Cars table
    await executeQuery(`
      CREATE TABLE Cars (
        car_id INT AUTO_INCREMENT PRIMARY KEY,
        make VARCHAR(50),
        model VARCHAR(50),
        year INT
      );
    `);

    // Query to create the Rentals table
    await executeQuery(`
      CREATE TABLE Rentals (
        rental_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        car_id INT,
        rental_date DATE,
        return_date DATE,
        FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
        FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE
      );
    `);

    // Query to create the RentalRates table
    await executeQuery(`
      CREATE TABLE RentalRates (
        rate_id INT AUTO_INCREMENT PRIMARY KEY,
        car_id INT,
        rental_rate_per_day DECIMAL(8, 2),
        FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE
      );
    `);

    console.log('Tables created successfully.');

    // Inserting data into Customers table
    await executeQuery(`
      INSERT INTO Customers (name, email, phone_number)
      VALUES
        ('John Shaw', 'john@shaw.com', '123-456-7890'),
        ('Jane Smith', 'jane@smith.com', '987-654-3210'),
        ('Michael Johnson', 'michael@johnson.com', '555-555-5555'),
        ('Emily Brown', 'emily@brown.com', '111-222-3333'),
        ('David Lee', 'david@lee.com', '444-444-4444');
    `);

    // Inserting data into Cars table
    await executeQuery(`
      INSERT INTO Cars (make, model, year)
      VALUES
        ('Toyota', 'Camry', 2020),
        ('Honda', 'Civic', 2019),
        ('Ford', 'F-150', 2022),
        ('Chevrolet', 'Malibu', 2021),
        ('BMW', 'X5', 2023);
    `);

    // Inserting data into Rentals table
    await executeQuery(`
      INSERT INTO Rentals (customer_id, car_id, rental_date, return_date)
      VALUES
        (1, 1, '2023-07-01', '2023-07-05'),
        (2, 3, '2023-07-02', '2023-07-07'),
        (3, 2, '2023-07-03', '2023-07-06'),
        (4, 4, '2023-07-04', '2023-07-08'),
        (5, 5, '2023-07-05', '2023-07-09');
    `);

    // Inserting data into RentalRates table
    await executeQuery(`
      INSERT INTO RentalRates (car_id, rental_rate_per_day)
      VALUES
        (1, 50.00),
        (2, 45.00),
        (3, 60.00),
        (4, 55.00),
        (5, 70.00);
    `);

    console.log('Data inserted successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    // Close the database connection
    db.end();
  }
}

// Call the function to create the tables and insert data
// createTables();

// Customers CRUD
app.post("/create", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;

  db.query(
    "INSERT INTO customers (name, email, phone_number) VALUES (?,?,?)",
    [name, email, phone_number],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

// app.get("/customers", (req, res) => {
//   db.query("SELECT * FROM customers", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.get("/customers", async (req, res) => {
  try {
    // Query to fetch customers with their rental dates and return dates
    const customersWithRentalDates = await executeQuery(`
      SELECT c.*, r.rental_date, r.return_date
      FROM Customers c
      LEFT JOIN Rentals r ON c.customer_id = r.customer_id;
    `);

    res.send(customersWithRentalDates);

  } catch (err) {
    console.error("Error fetching customers with rental dates:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    
  }
});

app.put("/update", (req, res) => {
  const customer_id = req.body.customer_id;
  const phone_number = req.body.phone_number;
  db.query(
    "UPDATE customers SET phone_number = ? WHERE customer_id = ?",
    [phone_number, customer_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating customer phone number");
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:customer_id", (req, res) => {
  const customer_id = req.params.customer_id;
  db.query("DELETE FROM customers WHERE customer_id = ?", customer_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// cars CRUD
app.post("/createcar", (req, res) => {
  const make = req.body.make;
  const model = req.body.model;
  const year = req.body.year;

  db.query(
    "INSERT INTO Cars (make, model, year) VALUES (?,?,?)",
    [make, model, year],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.get("/cars", async (req, res) => {
  try {
    // Query to fetch cars with their rental rates
    const carsWithRentalRates = await executeQuery(`
      SELECT c.*, rr.rental_rate_per_day
      FROM Cars c
      LEFT JOIN RentalRates rr ON c.car_id = rr.car_id;
    `);

    res.send(carsWithRentalRates);

  } catch (err) {
    console.error("Error fetching cars with rental rates:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    
  }
});

// app.get("/cars", (req, res) => {
//   db.query("SELECT * FROM Cars", (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(result);
//     }
//   });
// });

app.put("/updatecar", (req, res) => {
  const car_id = req.body.car_id;
  const year = req.body.year;
  db.query(
    "UPDATE Cars SET year = ? WHERE car_id = ?",
    [year, car_id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating customer phone number");
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:car_id", (req, res) => {
  const car_id = req.params.car_id;
  db.query("DELETE FROM Cars WHERE car_id = ?", car_id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
