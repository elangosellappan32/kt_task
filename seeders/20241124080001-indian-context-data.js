'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // ---------------------------
    // 1️⃣ ASSET CATEGORIES (Indian Business Context)
    // ---------------------------
    const categories = await queryInterface.bulkInsert(
      'asset_categories',
      [
        {
          name: 'Laptop',
          description: 'Company laptops for employees - Dell, HP, Lenovo',
          expected_lifespan_months: 36,
          depreciation_rate: 33.33,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Mobile Phone',
          description: 'Company mobile phones - iPhone, Android devices',
          expected_lifespan_months: 24,
          depreciation_rate: 50.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Desktop Computer',
          description: 'Desktop computers for office use',
          expected_lifespan_months: 48,
          depreciation_rate: 25.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Monitor',
          description: 'Computer monitors - Dell, LG, Samsung',
          expected_lifespan_months: 60,
          depreciation_rate: 20.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Printer',
          description: 'Office printers - HP, Canon, Epson',
          expected_lifespan_months: 48,
          depreciation_rate: 25.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Server',
          description: 'Network servers for IT infrastructure',
          expected_lifespan_months: 60,
          depreciation_rate: 20.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Network Equipment',
          description: 'Routers, switches, access points',
          expected_lifespan_months: 60,
          depreciation_rate: 20.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'UPS',
          description: 'Uninterruptible Power Supply units',
          expected_lifespan_months: 36,
          depreciation_rate: 33.33,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Air Conditioner',
          description: 'Office air conditioning units',
          expected_lifespan_months: 84,
          depreciation_rate: 14.29,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'CCTV Camera',
          description: 'Security surveillance cameras',
          expected_lifespan_months: 60,
          depreciation_rate: 20.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Biometric Device',
          description: 'Attendance and access control systems',
          expected_lifespan_months: 60,
          depreciation_rate: 20.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Projector',
          description: 'Meeting room projectors',
          expected_lifespan_months: 48,
          depreciation_rate: 25.00,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // ---------------------------
    // 2️⃣ SUPPLIERS (Indian Companies)
    // ---------------------------
    const suppliers = await queryInterface.bulkInsert(
      'suppliers',
      [
        {
          name: 'Ingram Micro India',
          contact_person: 'Rajesh Kumar',
          email: 'rajesh.kumar@ingrammicro.in',
          phone: '+91-80-12345678',
          address: '123, Electronic City, Bangalore, Karnataka - 560100',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Redington India Ltd',
          contact_person: 'Priya Sharma',
          email: 'priya.sharma@redington.co.in',
          phone: '+91-22-87654321',
          address: '456, Andheri Kurla Road, Mumbai, Maharashtra - 400053',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Tech Data India',
          contact_person: 'Amit Patel',
          email: 'amit.patel@techdata.in',
          phone: '+91-40-98765432',
          address: '789, HITEC City, Hyderabad, Telangana - 500081',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Dell India Pvt Ltd',
          contact_person: 'Suresh Nair',
          email: 'suresh.nair@dell.com',
          phone: '+91-80-67894321',
          address: 'Dell International Services, Bangalore, Karnataka - 560071',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'HP India Sales Pvt Ltd',
          contact_person: 'Anita Desai',
          email: 'anita.desai@hp.com',
          phone: '+91-120-43215678',
          address: 'HP India, Noida, Uttar Pradesh - 201301',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // ---------------------------
    // 3️⃣ EMPLOYEES (Indian Names & Departments)
    // ---------------------------
    const employees = await queryInterface.bulkInsert(
      'employees',
      [
        {
          employee_id: 'EMP0001',
          first_name: 'Rahul',
          last_name: 'Sharma',
          email: 'rahul.sharma@company.com',
          phone: '+91-9876543210',
          department: 'IT',
          position: 'Software Engineer',
          hire_date: new Date('2022-01-15'),
          status: 'active',
          branch: 'Bangalore',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0002',
          first_name: 'Priya',
          last_name: 'Nair',
          email: 'priya.nair@company.com',
          phone: '+91-9876543211',
          department: 'HR',
          position: 'HR Manager',
          hire_date: new Date('2021-06-10'),
          status: 'active',
          branch: 'Mumbai',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0003',
          first_name: 'Amit',
          last_name: 'Patel',
          email: 'amit.patel@company.com',
          phone: '+91-9876543212',
          department: 'Finance',
          position: 'Accountant',
          hire_date: new Date('2021-03-20'),
          status: 'active',
          branch: 'Delhi',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0004',
          first_name: 'Sneha',
          last_name: 'Reddy',
          email: 'sneha.reddy@company.com',
          phone: '+91-9876543213',
          department: 'Marketing',
          position: 'Marketing Executive',
          hire_date: new Date('2022-09-05'),
          status: 'active',
          branch: 'Hyderabad',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0005',
          first_name: 'Vikram',
          last_name: 'Singh',
          email: 'vikram.singh@company.com',
          phone: '+91-9876543214',
          department: 'Operations',
          position: 'Operations Manager',
          hire_date: new Date('2020-12-01'),
          status: 'active',
          branch: 'Chennai',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0006',
          first_name: 'Anjali',
          last_name: 'Kumar',
          email: 'anjali.kumar@company.com',
          phone: '+91-9876543215',
          department: 'IT',
          position: 'System Administrator',
          hire_date: new Date('2021-08-15'),
          status: 'active',
          branch: 'Bangalore',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0007',
          first_name: 'Rohit',
          last_name: 'Verma',
          email: 'rohit.verma@company.com',
          phone: '+91-9876543216',
          department: 'Sales',
          position: 'Sales Executive',
          hire_date: new Date('2022-04-10'),
          status: 'active',
          branch: 'Pune',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          employee_id: 'EMP0008',
          first_name: 'Kavita',
          last_name: 'Mishra',
          email: 'kavita.mishra@company.com',
          phone: '+91-9876543217',
          department: 'Admin',
          position: 'Admin Assistant',
          hire_date: new Date('2023-01-20'),
          status: 'active',
          branch: 'Kolkata',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // ---------------------------
    // 4️⃣ ASSETS (Indian Pricing in ₹)
    // ---------------------------
    const assets = await queryInterface.bulkInsert(
      'assets',
      [
        // Laptops
        {
          asset_tag: 'LAP001',
          serial_number: 'DL123456789',
          name: 'Dell Latitude 5420',
          model: 'Latitude 5420',
          manufacturer: 'Dell',
          category_id: 1, // Laptop
          supplier_id: 4, // Dell India
          purchase_date: new Date('2023-01-15'),
          purchase_cost: 75000.00,
          current_value: 60000.00,
          warranty_months: 36,
          status: 'available',
          branch: 'Bangalore',
          location: 'IT Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_tag: 'LAP002',
          serial_number: 'HP987654321',
          name: 'HP EliteBook 840 G8',
          model: 'EliteBook 840 G8',
          manufacturer: 'HP',
          category_id: 1, // Laptop
          supplier_id: 5, // HP India
          purchase_date: new Date('2023-02-20'),
          purchase_cost: 85000.00,
          current_value: 68000.00,
          warranty_months: 36,
          status: 'assigned',
          branch: 'Mumbai',
          location: 'HR Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_tag: 'LAP003',
          serial_number: 'LN456789123',
          name: 'Lenovo ThinkPad T14',
          model: 'ThinkPad T14',
          manufacturer: 'Lenovo',
          category_id: 1, // Laptop
          supplier_id: 1, // Ingram Micro
          purchase_date: new Date('2023-03-10'),
          purchase_cost: 92000.00,
          current_value: 73600.00,
          warranty_months: 36,
          status: 'assigned',
          branch: 'Delhi',
          location: 'Finance Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        
        // Mobile Phones
        {
          asset_tag: 'MOB001',
          serial_number: 'IP1234567890',
          name: 'iPhone 13',
          model: 'iPhone 13',
          manufacturer: 'Apple',
          category_id: 2, // Mobile Phone
          supplier_id: 1, // Ingram Micro
          purchase_date: new Date('2023-04-05'),
          purchase_cost: 65000.00,
          current_value: 52000.00,
          warranty_months: 24,
          status: 'available',
          branch: 'Bangalore',
          location: 'IT Store',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_tag: 'MOB002',
          serial_number: 'SG9876543210',
          name: 'Samsung Galaxy S23',
          model: 'Galaxy S23',
          manufacturer: 'Samsung',
          category_id: 2, // Mobile Phone
          supplier_id: 2, // Redington
          purchase_date: new Date('2023-05-12'),
          purchase_cost: 55000.00,
          current_value: 44000.00,
          warranty_months: 24,
          status: 'assigned',
          branch: 'Hyderabad',
          location: 'Marketing Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },

        // Desktop Computers
        {
          asset_tag: 'DT001',
          serial_number: 'DT111222333',
          name: 'Dell OptiPlex 7090',
          model: 'OptiPlex 7090',
          manufacturer: 'Dell',
          category_id: 3, // Desktop Computer
          supplier_id: 4, // Dell India
          purchase_date: new Date('2023-01-25'),
          purchase_cost: 45000.00,
          current_value: 36000.00,
          warranty_months: 48,
          status: 'available',
          branch: 'Bangalore',
          location: 'IT Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },

        // Monitors
        {
          asset_tag: 'MON001',
          serial_number: 'LG123456789',
          name: 'Dell UltraSharp 24"',
          model: 'U2422H',
          manufacturer: 'Dell',
          category_id: 4, // Monitor
          supplier_id: 4, // Dell India
          purchase_date: new Date('2023-02-15'),
          purchase_cost: 18000.00,
          current_value: 16200.00,
          warranty_months: 60,
          status: 'available',
          branch: 'Bangalore',
          location: 'IT Store',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_tag: 'MON002',
          serial_number: 'SN987654321',
          name: 'LG 27" Monitor',
          model: '27MP68VQ',
          manufacturer: 'LG',
          category_id: 4, // Monitor
          supplier_id: 1, // Ingram Micro
          purchase_date: new Date('2023-03-20'),
          purchase_cost: 22000.00,
          current_value: 19800.00,
          warranty_months: 60,
          status: 'assigned',
          branch: 'Mumbai',
          location: 'HR Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },

        // Printers
        {
          asset_tag: 'PRN001',
          serial_number: 'HP123456789',
          name: 'HP LaserJet Pro M404n',
          model: 'LaserJet Pro M404n',
          manufacturer: 'HP',
          category_id: 5, // Printer
          supplier_id: 5, // HP India
          purchase_date: new Date('2023-01-10'),
          purchase_cost: 28000.00,
          current_value: 25200.00,
          warranty_months: 48,
          status: 'available',
          branch: 'Bangalore',
          location: 'Admin Office',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },

        // Network Equipment
        {
          asset_tag: 'NET001',
          serial_number: 'TP123456789',
          name: 'TP-Link WiFi Router',
          model: 'Archer C6',
          manufacturer: 'TP-Link',
          category_id: 6, // Network Equipment
          supplier_id: 1, // Ingram Micro
          purchase_date: new Date('2023-02-28'),
          purchase_cost: 3500.00,
          current_value: 3150.00,
          warranty_months: 60,
          status: 'available',
          branch: 'Bangalore',
          location: 'IT Department',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },

        // UPS
        {
          asset_tag: 'UPS001',
          serial_number: 'APC123456789',
          name: 'APC Back-UPS 600VA',
          model: 'BE600M1',
          manufacturer: 'APC',
          category_id: 7, // UPS
          supplier_id: 1, // Ingram Micro
          purchase_date: new Date('2023-01-20'),
          purchase_cost: 4500.00,
          current_value: 4050.00,
          warranty_months: 36,
          status: 'available',
          branch: 'Bangalore',
          location: 'Server Room',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // ---------------------------
    // 5️⃣ ASSET ASSIGNMENTS
    // ---------------------------
    await queryInterface.bulkInsert(
      'asset_assignments',
      [
        {
          asset_id: 2, // HP EliteBook assigned to Priya
          employee_id: 2, // Priya Nair
          assigned_by: 1, // Rahul Sharma (IT)
          assigned_date: new Date('2023-03-01'),
          expected_return_date: new Date('2024-03-01'),
          status: 'assigned',
          notes: 'Assigned for official work',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_id: 3, // Lenovo ThinkPad assigned to Amit
          employee_id: 3, // Amit Patel
          assigned_by: 1, // Rahul Sharma (IT)
          assigned_date: new Date('2023-04-01'),
          expected_return_date: new Date('2024-04-01'),
          status: 'assigned',
          notes: 'Finance department laptop',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_id: 5, // Samsung Galaxy assigned to Sneha
          employee_id: 4, // Sneha Reddy
          assigned_by: 1, // Rahul Sharma (IT)
          assigned_date: new Date('2023-06-01'),
          expected_return_date: new Date('2024-06-01'),
          status: 'assigned',
          notes: 'Marketing team mobile',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          asset_id: 7, // LG Monitor assigned to Priya
          employee_id: 2, // Priya Nair
          assigned_by: 1, // Rahul Sharma (IT)
          assigned_date: new Date('2023-03-15'),
          expected_return_date: new Date('2024-03-15'),
          status: 'assigned',
          notes: 'Dual monitor setup',
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );

    // ---------------------------
    // 6️⃣ USERS (Admin Accounts)
    // ---------------------------
    const hashedPassword = await bcrypt.hash('admin123', 12);
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'admin',
          email: 'admin@company.com',
          password: hashedPassword,
          role: 'admin',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'manager',
          email: 'manager@company.com',
          password: await bcrypt.hash('manager123', 12),
          role: 'manager',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ],
      { returning: true }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Remove data in reverse order due to foreign key constraints
    await queryInterface.bulkDelete('asset_assignments', {}, {});
    await queryInterface.bulkDelete('assets', {}, {});
    await queryInterface.bulkDelete('employees', {}, {});
    await queryInterface.bulkDelete('suppliers', {}, {});
    await queryInterface.bulkDelete('asset_categories', {}, {});
    await queryInterface.bulkDelete('users', {}, {});
  }
};
