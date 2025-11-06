import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Username:', existingAdmin.username);
      console.log('Role:', existingAdmin.role);
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@test.com',
      password: 'Admin123',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@test.com');
    console.log('Password: Admin123');
    console.log('Role: admin');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();

