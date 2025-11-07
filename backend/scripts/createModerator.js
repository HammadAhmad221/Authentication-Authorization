import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const createModerator = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auth_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected successfully');

    // Check if moderator already exists
    const existingModerator = await User.findOne({ email: 'moderator@test.com' });
    if (existingModerator) {
      console.log('Moderator user already exists!');
      console.log('Email:', existingModerator.email);
      console.log('Username:', existingModerator.username);
      console.log('Role:', existingModerator.role);
      await mongoose.connection.close();
      return;
    }

    // Create moderator user
    const moderator = new User({
      username: 'moderator',
      email: 'moderator@test.com',
      password: 'Moderator123',
      role: 'moderator',
      isVerified: true // Auto-verify for testing
    });

    await moderator.save();
    console.log('Moderator user created successfully!');
    console.log('Email: moderator@test.com');
    console.log('Password: Moderator123');
    console.log('Role: moderator');
    console.log('\nYou can now login with these credentials.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating moderator user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createModerator();

