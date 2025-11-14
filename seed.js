const bcrypt = require('bcryptjs');
const { create, get } = require('./utils/database');

async function seed() {
  console.log('Seeding database...');

  // Clear existing data (in production, be careful with this)
  const fs = require('fs');
  const path = require('path');
  const DB_PATH = path.join(__dirname, 'data/database.json');
  fs.writeFileSync(DB_PATH, JSON.stringify({
    users: [],
    menu: [],
    tables: [],
    orders: [],
    bills: []
  }, null, 2));

  // Create users
  const users = [
    { username: 'waiter1', password: 'waiter123', role: 'waiter', name: 'John Waiter' },
    { username: 'chef1', password: 'chef123', role: 'chef', name: 'Master Chef' },
    { username: 'customer1', password: 'customer123', role: 'customer', name: 'Customer One' },
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' }
  ];

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    create('users', {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: userData.username,
      password: hashedPassword,
      role: userData.role,
      name: userData.name,
      createdAt: new Date().toISOString()
    });
    console.log(`Created user: ${userData.username} (${userData.role})`);
  }

  // Create tables (5 tables)
  for (let i = 1; i <= 5; i++) {
    create('tables', {
      id: `table_${i}`,
      number: i,
      capacity: 4,
      status: 'available',
      createdAt: new Date().toISOString()
    });
    console.log(`Created table: ${i}`);
  }

  // Create menu items (fully vegetarian menu with INR prices)
  const menuItems = [
    {
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato, mozzarella, and basil',
      price: 259,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
    },
    {
      name: 'Paneer Tikka Pizza',
      description: 'Delicious pizza topped with marinated paneer and vegetables',
      price: 299,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400'
    },
    {
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with vegetarian Caesar dressing',
      price: 189,
      category: 'appetizer',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
    },
    {
      name: 'Veg Burger',
      description: 'Crispy vegetable patty burger with fresh vegetables',
      price: 199,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400'
    },
    {
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with frosting',
      price: 129,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'
    },
    {
      name: 'Pasta Arrabbiata',
      description: 'Spicy pasta with tomato sauce and herbs',
      price: 219,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400'
    },
    {
      name: 'Tomato Soup',
      description: 'Creamy tomato soup with herbs',
      price: 149,
      category: 'appetizer',
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400'
    },
    {
      name: 'Paneer Tikka',
      description: 'Grilled marinated paneer with vegetables',
      price: 249,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'
    },
    {
      name: 'Ice Cream',
      description: 'Vanilla ice cream with toppings',
      price: 99,
      category: 'dessert',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400'
    },
    {
      name: 'Fresh Juice',
      description: 'Freshly squeezed orange juice',
      price: 70,
      category: 'beverage',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'
    },
    {
      name: 'Dal Makhani',
      description: 'Creamy black lentils cooked with butter and spices',
      price: 179,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'
    },
    {
      name: 'Vegetable Biryani',
      description: 'Fragrant basmati rice with mixed vegetables and spices',
      price: 229,
      category: 'main',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400'
    }
  ];

  for (const item of menuItems) {
    create('menu', {
      id: `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...item,
      available: true,
      arModel: null,
      createdAt: new Date().toISOString()
    });
    console.log(`Created menu item: ${item.name}`);
  }

  console.log('Seeding completed!');
  console.log('\nDefault credentials:');
  console.log('Waiter: waiter1 / waiter123');
  console.log('Chef: chef1 / chef123');
  console.log('Customer: customer1 / customer123');
  console.log('Admin: admin / admin123');
}

seed().catch(console.error);

