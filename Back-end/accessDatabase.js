
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

// Connect to the SQLite database
const db = new sqlite3.Database('data.db');

// Create the products table if it doesn't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price REAL,
      description TEXT,
      category TEXT,
      image TEXT,
      sold INTEGER,
      dateOfSale TEXT
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      return;
    }

    console.log('Table created or already exists.');

    // URL of the JSON data
    const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';

    // Fetch JSON data from the URL
    axios.get(url)
      .then(response => {
        const jsonData = response.data;

        // Insert the data into the SQLite database
        const insertStatement = db.prepare(
          'INSERT INTO products (title, price, description, category, image, sold, dateOfSale) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        db.serialize(() => {
          jsonData.forEach((product) => {
            insertStatement.run(
              product.title,
              product.price,
              product.description,
              product.category,
              product.image,
              product.sold,
              product.dateOfSale
            );
          });

          // Finalize the statement to close it
          insertStatement.finalize(err => {
            if (err) {
              console.error('Error finalizing statement:', err.message);
            } else {
              console.log('Data inserted successfully.');

              // Now, query the database to verify the insertion
              db.all('SELECT * FROM products LIMIT 10', [], (err, rows) => {
                if (err) {
                  console.error('Error querying the database:', err.message);
                } else {
                  console.log('Sample data:', rows);
                }

               // Close the database connection after all operations are complete
                db.close(err => {
                  if (err) {
                    console.error('Error closing the database:', err.message);
                  } else {
                    console.log('Database connection closed.');
                  }
                });
              });
            }
          });
        });
      })
      .catch(error => {
        console.error('Error fetching data from the URL:', error.message);
      });
  });
});
