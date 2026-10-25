require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`=====================================================`);
    console.log(` Rental Portal API running in [${process.env.NODE_ENV || 'development'}] mode`);
    console.log(` Listening on: http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(`=====================================================`);
  });
});
