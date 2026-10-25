require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rental_portal';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for admin provisioning...');

    const email = (process.env.ADMIN_EMAIL || 'admin@rentalportal.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const name = process.env.ADMIN_NAME || 'Platform Administrator';
    const phone = process.env.ADMIN_PHONE || '+91 9876543210';

    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`Admin account [${email}] already exists.`);
      if (admin.role !== 'admin') {
        admin.role = 'admin';
        await admin.save();
        console.log(`Updated existing user role to admin.`);
      }
    } else {
      admin = await User.create({
        name,
        email,
        phone,
        password,
        role: 'admin',
        isActive: true
      });
      console.log(`Administrator account created successfully:`);
      console.log(`Email: ${email}`);
      console.log(`Role: admin`);
    }

    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin account:', error.message);
    process.exit(1);
  }
};

createAdmin();
