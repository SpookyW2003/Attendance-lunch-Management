const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function updateEmployeeName() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Update the employee user name from "John Employee" to "DDp"
    const result = await User.updateOne(
      { email: 'employee@demo.com' },
      { 
        $set: { 
          name: 'DDp',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount > 0) {
      console.log('✓ Successfully updated employee name to "DDp"');
      
      // Verify the update
      const updatedUser = await User.findOne({ email: 'employee@demo.com' });
      console.log(`✓ Verified: Employee name is now "${updatedUser.name}"`);
    } else {
      console.log('⚠ No employee user found with email employee@demo.com');
      console.log('Creating new employee user...');
      
      // Create the employee user if it doesn't exist
      const newEmployee = new User({
        name: 'DDp',
        email: 'employee@demo.com',
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        employeeId: 'EMP001'
      });
      
      await newEmployee.save();
      console.log('✓ Created new employee user: DDp');
    }

    console.log('\n✓ Employee name update complete!');
    console.log('\nUpdated Demo Login Credentials:');
    console.log('Admin: admin@demo.com / password123');
    console.log('Employee (DDp): employee@demo.com / password123');
    console.log('Chef: chef@demo.com / password123');
    
  } catch (error) {
    console.error('Error updating employee name:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
updateEmployeeName();
