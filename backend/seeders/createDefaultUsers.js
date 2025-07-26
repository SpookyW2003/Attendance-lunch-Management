const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    department: 'Administration',
    employeeId: 'ADM001'
  },
  {
    name: 'John Employee',
    email: 'employee@demo.com', 
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    employeeId: 'EMP001'
  },
  {
    name: 'Chef Mike',
    email: 'chef@demo.com',
    password: 'password123', 
    role: 'chef',
    department: 'Kitchen',
    employeeId: 'CHF001'
  }
];

async function createDefaultUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if users already exist
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        console.log(`Creating user: ${userData.email}`);
        const user = new User(userData);
        await user.save();
        console.log(`✓ Created user: ${userData.name} (${userData.role})`);
      } else {
        console.log(`User already exists: ${userData.email}`);
      }
    }

    console.log('\n✓ Default users setup complete!');
    console.log('\nDemo Login Credentials:');
    console.log('Admin: admin@demo.com / password123');
    console.log('Employee: employee@demo.com / password123');  
    console.log('Chef: chef@demo.com / password123');
    
  } catch (error) {
    console.error('Error creating default users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
if (require.main === module) {
  createDefaultUsers();
}

module.exports = createDefaultUsers;
