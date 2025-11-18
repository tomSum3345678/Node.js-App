use('supermarket_db');

// ============================================
// 1. USERS COLLECTION
// 用於：所有角色的帳號管理
// ============================================
db.users.insertMany([
  {
    userId: "USER001",
    username: "john_doe",
    email: "john@example.com",
    password: "USER",
    role: "end-user", // end-user, staff, storage, manager
    profile: {
      firstName: "John",
      lastName: "Doe",
      phone: "+852 9123 4567",
      address: {
        street: "123 Main Street",
        district: "Central",
        city: "Hong Kong",
        postalCode: "000000"
      }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date()
  },
  {
    userId: "STAFF001",
    username: "staff_alice",
    email: "alice@supermarket.com",
    password: "STAFF",
    role: "staff",
    profile: {
      firstName: "Alice",
      lastName: "Wong",
      phone: "+852 9234 5678",
      employeeId: "EMP001"
    },
    permissions: ["product_management", "order_processing"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "STORAGE001",
    username: "storage_bob",
    email: "bob@supermarket.com",
    password: "STORAGE",
    role: "storage",
    profile: {
      firstName: "Bob",
      lastName: "Chan",
      phone: "+852 9345 6789",
      employeeId: "EMP002"
    },
    permissions: ["inventory_management", "logistics"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    userId: "MANAGER001",
    username: "manager_carol",
    email: "carol@supermarket.com",
    password: "MANAGER",
    role: "manager",
    profile: {
      firstName: "Carol",
      lastName: "Lee",
      phone: "+852 9456 7890",
      employeeId: "EMP003"
    },
    permissions: ["all"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// ============================================
// 2. PRODUCTS COLLECTION
// 用於：Staff (商品管理CRUD), End-user (瀏覽/搜尋), Manager (監控庫存)
// ============================================
db.products.insertMany([ // All products have their own productImage, but the base64 is too long, I will not write this on the insert command, the add image operation will be handled in code. You can assume that we have a field called "productImage"
  {
    productId: "PROD001",
    productName: "Apple",
    category: "Food",
    price: 2.50,
    stock: 100,
    description: "Fresh red apples",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD002",
    productName: "Milk",
    category: "Beverages",
    price: 3.20,
    stock: 50,
    description: "Fresh whole milk 1L",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD003",
    productName: "Toothpaste",
    category: "Daily Necessities",
    price: 4.50,
    stock: 75,
    description: "Fluoride toothpaste 100ml",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD004",
    productName: "Laundry Detergent",
    category: "Cleaning Supplies",
    price: 12.99,
    stock: 30,
    description: "Concentrated laundry detergent 2L",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD005",
    productName: "Notebook",
    category: "Stationery",
    price: 3.75,
    stock: 200,
    description: "A4 size 100-page notebook",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD006",
    productName: "Orange Juice",
    category: "Beverages",
    price: 5.40,
    stock: 40,
    description: "Fresh orange juice 1L",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD007",
    productName: "Bread",
    category: "Food",
    price: 4.20,
    stock: 60,
    description: "Whole wheat bread 500g",
    lowStockThreshold: 20, // default, no need to change this number
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// ============================================
// 3. CARTS COLLECTION
// 用於：End-user (購物車管理)
// ============================================
db.carts.insertMany([
  {
    cartId: "CART001",
    userId: "USER001",
    items: [
      {
        productId: "PROD004",
        productName: "Laundry Detergent",
        quantity: 1,
        unitPrice: 12.99,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        addedAt: new Date()
      },
      {
        productId: "PROD005",
        productName: "Notebook",
        quantity: 3,
        unitPrice: 3.75,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        addedAt: new Date()
      }
    ],
    totalAmount: 24.24,
    updatedAt: new Date()
  }
])


// ============================================
// 8. PERMISSIONS COLLECTION
// 用於：Manager (管理員工權限)
// ============================================
db.permissions.insertMany([
  {
    permissionId: "PERM001",
    role: "staff",
    permissions: {
      products: { create: true, read: true, update: true, delete: false },
      orders: { create: false, read: true, update: true, delete: false }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    permissionId: "PERM002",
    role: "storage",
    permissions: {
      products: { create: false, read: true, update: false, delete: false },
      inventory: { create: true, read: true, update: true, delete: false },
      logistics: { create: true, read: true, update: true, delete: false }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    permissionId: "PERM003",
    role: "manager",
    permissions: {
      products: { create: true, read: true, update: true, delete: true },
      orders: { create: true, read: true, update: true, delete: true },
      inventory: { create: true, read: true, update: true, delete: true },
      logistics: { create: true, read: true, update: true, delete: true },
      users: { create: true, read: true, update: true, delete: true },
      suppliers: { create: true, read: true, update: true, delete: true },
      permissions: { create: true, read: true, update: true, delete: true }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    permissionId: "PERM004",
    role: "end-user",
    permissions: {
      products: { create: false, read: true, update: false, delete: false },
      orders: { create: true, read: true, update: false, delete: false },
      cart: { create: true, read: true, update: true, delete: true },
      profile: { create: false, read: true, update: true, delete: false }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// ============================================
// INDEXES FOR PERFORMANCE
// ============================================

// Users indexes
db.users.createIndex({ userId: 1 }, { unique: true })
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
db.users.createIndex({ role: 1 })

// Products indexes
db.products.createIndex({ productId: 1 }, { unique: true })
db.products.createIndex({ category: 1 })
db.products.createIndex({ status: 1 })
db.products.createIndex({ barcode: 1 })
db.products.createIndex({ productName: "text", description: "text" })

// Carts indexes
db.carts.createIndex({ cartId: 1 }, { unique: true })
db.carts.createIndex({ userId: 1 }, { unique: true })

// Permissions indexes
db.permissions.createIndex({ permissionId: 1 }, { unique: true })
db.permissions.createIndex({ role: 1 }, { unique: true })