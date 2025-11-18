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
db.products.insertMany([
  {
    productId: "PROD001",
    productName: "Apple",
    category: "Food",
    subCategory: "Fruits",
    price: 2.50,
    stock: 100,
    description: "Fresh red apples",
    specifications: {
      weight: "200g per piece",
      origin: "China"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock", // in-stock, out-of-stock, discontinued
    barcode: "1234567890123",
    supplierId: "SUP001",
    lowStockThreshold: 20,
    createdBy: "STAFF001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD002",
    productName: "Milk",
    category: "Beverages",
    subCategory: "Dairy",
    price: 3.20,
    stock: 50,
    description: "Fresh whole milk 1L",
    specifications: {
      volume: "1L",
      fatContent: "3.5%"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock",
    barcode: "2345678901234",
    supplierId: "SUP002",
    lowStockThreshold: 15,
    createdBy: "STAFF001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD003",
    productName: "Toothpaste",
    category: "Daily Necessities",
    subCategory: "Personal Care",
    price: 4.50,
    stock: 75,
    description: "Fluoride toothpaste 100ml",
    specifications: {
      volume: "100ml",
      flavor: "Mint"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock",
    barcode: "3456789012345",
    supplierId: "SUP003",
    lowStockThreshold: 25,
    createdBy: "STAFF001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD004",
    productName: "Laundry Detergent",
    category: "Cleaning Supplies",
    subCategory: "Laundry",
    price: 12.99,
    stock: 30,
    description: "Concentrated laundry detergent 2L",
    specifications: {
      volume: "2L",
      type: "Concentrated"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock",
    barcode: "4567890123456",
    supplierId: "SUP003",
    lowStockThreshold: 10,
    createdBy: "STAFF001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD005",
    productName: "Notebook",
    category: "Stationery",
    subCategory: "Paper Products",
    price: 3.75,
    stock: 200,
    description: "A4 size 100-page notebook",
    specifications: {
      size: "A4",
      pages: "100"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock",
    barcode: "5678901234567",
    supplierId: "SUP004",
    lowStockThreshold: 50,
    createdBy: "STAFF001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD006",
    productName: "Orange Juice",
    category: "Beverages",
    subCategory: "Juice",
    price: 5.40,
    stock: 40,
    description: "Fresh orange juice 1L",
    specifications: {
      volume: "1L",
      type: "100% Pure"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock",
    barcode: "6789012345678",
    supplierId: "SUP002",
    lowStockThreshold: 15,
    createdBy: "STAFF001",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: "PROD007",
    productName: "Bread",
    category: "Food",
    subCategory: "Bakery",
    price: 4.20,
    stock: 60,
    description: "Whole wheat bread 500g",
    specifications: {
      weight: "500g",
      type: "Whole Wheat"
    },
    images: {
      main: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      gallery: []
    },
    status: "in-stock",
    barcode: "7890123456789",
    supplierId: "SUP005",
    lowStockThreshold: 20,
    createdBy: "STAFF001",
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
// 4. ORDERS COLLECTION
// 用於：End-user (結帳/追蹤訂單/訂單歷史), Staff (訂單處理CRUD)
// ============================================
db.orders.insertMany([
  {
    orderId: "ORD001",
    userId: "USER001",
    orderStatus: "preparing", // pending, preparing, shipped, completed, cancelled
    items: [
      {
        productId: "PROD001",
        productName: "Apple",
        quantity: 5,
        unitPrice: 2.50,
        subtotal: 12.50,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      },
      {
        productId: "PROD002",
        productName: "Milk",
        quantity: 2,
        unitPrice: 3.20,
        subtotal: 6.40,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    totalAmount: 18.90,
    shippingAddress: {
      street: "123 Main Street",
      district: "Central",
      city: "Hong Kong",
      postalCode: "000000",
      recipientName: "John Doe",
      recipientPhone: "+852 9123 4567"
    },
    paymentMethod: "credit-card", // credit-card, debit-card, e-wallet
    paymentStatus: "paid", // pending, paid, failed
    deliveryStatus: "pending", // pending, in-transit, delivered
    trackingNumber: "TRK987654321",
    estimatedDeliveryDate: new Date("2025-11-15"),
    notes: "Please call before delivery",
    processedBy: "STAFF001",
    createdAt: new Date("2025-11-11T10:30:00"),
    updatedAt: new Date("2025-11-11T11:00:00")
  },
  {
    orderId: "ORD002",
    userId: "USER001",
    orderStatus: "completed",
    items: [
      {
        productId: "PROD003",
        productName: "Toothpaste",
        quantity: 1,
        unitPrice: 4.50,
        subtotal: 4.50,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    totalAmount: 4.50,
    shippingAddress: {
      street: "123 Main Street",
      district: "Central",
      city: "Hong Kong",
      postalCode: "000000",
      recipientName: "John Doe",
      recipientPhone: "+852 9123 4567"
    },
    paymentMethod: "e-wallet",
    paymentStatus: "paid",
    deliveryStatus: "delivered",
    trackingNumber: "TRK123456789",
    estimatedDeliveryDate: new Date("2025-11-08"),
    actualDeliveryDate: new Date("2025-11-08T14:20:00"),
    notes: null,
    processedBy: "STAFF001",
    createdAt: new Date("2025-11-05T09:15:00"),
    updatedAt: new Date("2025-11-08T14:20:00")
  },
  {
    orderId: "ORD003",
    userId: "USER001",
    orderStatus: "pending",
    items: [
      {
        productId: "PROD006",
        productName: "Orange Juice",
        quantity: 2,
        unitPrice: 5.40,
        subtotal: 10.80,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    totalAmount: 10.80,
    shippingAddress: {
      street: "123 Main Street",
      district: "Central",
      city: "Hong Kong",
      postalCode: "000000",
      recipientName: "John Doe",
      recipientPhone: "+852 9123 4567"
    },
    paymentMethod: "credit-card",
    paymentStatus: "paid",
    deliveryStatus: "pending",
    trackingNumber: null,
    estimatedDeliveryDate: new Date("2025-11-16"),
    notes: null,
    processedBy: null,
    createdAt: new Date("2025-11-11T16:00:00"),
    updatedAt: new Date("2025-11-11T16:00:00")
  }
])

// ============================================
// 5. INVENTORY_LOGS COLLECTION
// 用於：Storage (庫存管理 - 更新數量/掃描條碼/記錄進貨), Manager (監控庫存)
// ============================================
db.inventory_logs.insertMany([
  {
    logId: "LOG001",
    productId: "PROD001",
    productName: "Apple",
    operationType: "inbound", // inbound (進貨), outbound (出貨), adjustment (調整)
    quantityChange: 100,
    previousStock: 50,
    newStock: 150,
    batchNumber: "BATCH20251110001",
    barcode: "1234567890123",
    reason: "New stock arrival from supplier",
    supplierId: "SUP001",
    operatedBy: "STORAGE001",
    operatedAt: new Date("2025-11-10T08:00:00")
  },
  {
    logId: "LOG002",
    productId: "PROD001",
    productName: "Apple",
    operationType: "outbound",
    quantityChange: -5,
    previousStock: 150,
    newStock: 145,
    batchNumber: null,
    barcode: "1234567890123",
    reason: "Order fulfillment - ORD001",
    orderId: "ORD001",
    operatedBy: "STORAGE001",
    operatedAt: new Date("2025-11-11T11:00:00")
  },
  {
    logId: "LOG003",
    productId: "PROD002",
    productName: "Milk",
    operationType: "outbound",
    quantityChange: -2,
    previousStock: 52,
    newStock: 50,
    batchNumber: null,
    barcode: "2345678901234",
    reason: "Order fulfillment - ORD001",
    orderId: "ORD001",
    operatedBy: "STORAGE001",
    operatedAt: new Date("2025-11-11T11:00:00")
  },
  {
    logId: "LOG004",
    productId: "PROD002",
    productName: "Milk",
    operationType: "adjustment",
    quantityChange: -2,
    previousStock: 52,
    newStock: 50,
    batchNumber: "BATCH20251110002",
    barcode: "2345678901234",
    reason: "Damaged items removed",
    operatedBy: "STORAGE001",
    operatedAt: new Date("2025-11-11T15:30:00")
  },
  {
    logId: "LOG005",
    productId: "PROD003",
    productName: "Toothpaste",
    operationType: "inbound",
    quantityChange: 75,
    previousStock: 0,
    newStock: 75,
    batchNumber: "BATCH20251109001",
    barcode: "3456789012345",
    reason: "New stock arrival from supplier",
    supplierId: "SUP003",
    operatedBy: "STORAGE001",
    operatedAt: new Date("2025-11-09T08:00:00")
  }
])

// ============================================
// 6. LOGISTICS COLLECTION
// 用於：Storage (物流操作 - 處理入庫/出庫/安排配送)
// ============================================
db.logistics.insertMany([
  {
    logisticsId: "LOGI001",
    type: "inbound", // inbound (入庫), outbound (出庫), delivery (配送)
    status: "completed", // pending, in-progress, completed, cancelled
    orderId: null,
    supplierId: "SUP001",
    supplierName: "Fresh Fruits Co.",
    products: [
      {
        productId: "PROD001",
        productName: "Apple",
        quantity: 100,
        batchNumber: "BATCH20251110001",
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    warehouseLocation: "A-01-05",
    scheduledDate: new Date("2025-11-10T08:00:00"),
    completedDate: new Date("2025-11-10T09:30:00"),
    assignedTo: "STORAGE001",
    notes: "Quality check passed",
    createdAt: new Date("2025-11-09T10:00:00"),
    updatedAt: new Date("2025-11-10T09:30:00")
  },
  {
    logisticsId: "LOGI002",
    type: "outbound",
    status: "completed",
    orderId: "ORD001",
    supplierId: null,
    products: [
      {
        productId: "PROD001",
        productName: "Apple",
        quantity: 5,
        batchNumber: null,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      },
      {
        productId: "PROD002",
        productName: "Milk",
        quantity: 2,
        batchNumber: null,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    warehouseLocation: "Picking Area",
    scheduledDate: new Date("2025-11-11T11:00:00"),
    completedDate: new Date("2025-11-11T11:45:00"),
    assignedTo: "STORAGE001",
    notes: "Picked and packed for delivery",
    createdAt: new Date("2025-11-11T10:30:00"),
    updatedAt: new Date("2025-11-11T11:45:00")
  },
  {
    logisticsId: "LOGI003",
    type: "delivery",
    status: "in-progress",
    orderId: "ORD001",
    supplierId: null,
    products: [
      {
        productId: "PROD001",
        productName: "Apple",
        quantity: 5,
        batchNumber: null,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      },
      {
        productId: "PROD002",
        productName: "Milk",
        quantity: 2,
        batchNumber: null,
        productImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      }
    ],
    deliveryAddress: {
      street: "123 Main Street",
      district: "Central",
      city: "Hong Kong",
      postalCode: "000000",
      recipientName: "John Doe",
      recipientPhone: "+852 9123 4567"
    },
    deliveryRoute: "Route A",
    trackingNumber: "TRK987654321",
    scheduledDate: new Date("2025-11-15T14:00:00"),
    completedDate: null,
    assignedTo: "STORAGE001",
    driverContact: "+852 9999 8888",
    notes: "Delivery in progress",
    createdAt: new Date("2025-11-11T12:00:00"),
    updatedAt: new Date("2025-11-11T12:00:00")
  }
])

// ============================================
// 7. SUPPLIERS COLLECTION
// 用於：Manager (管理供應商資訊)
// ============================================
db.suppliers.insertMany([
  {
    supplierId: "SUP001",
    supplierName: "Fresh Fruits Co.",
    category: "Food",
    contactPerson: "David Wong",
    email: "david@freshfruits.com",
    phone: "+852 2345 6789",
    address: {
      street: "456 Supply Road",
      district: "Kwun Tong",
      city: "Hong Kong",
      postalCode: "100000"
    },
    productsSupplied: ["PROD001", "PROD007"],
    paymentTerms: "Net 30",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierId: "SUP002",
    supplierName: "Dairy Fresh Ltd.",
    category: "Beverages",
    contactPerson: "Emily Chan",
    email: "emily@dairyfresh.com",
    phone: "+852 2456 7890",
    address: {
      street: "789 Dairy Lane",
      district: "Sha Tin",
      city: "Hong Kong",
      postalCode: "200000"
    },
    productsSupplied: ["PROD002", "PROD006"],
    paymentTerms: "Net 15",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierId: "SUP003",
    supplierName: "Home Essentials Inc.",
    category: "Daily Necessities",
    contactPerson: "Frank Lee",
    email: "frank@homeessentials.com",
    phone: "+852 2567 8901",
    address: {
      street: "321 Essential Street",
      district: "Tsuen Wan",
      city: "Hong Kong",
      postalCode: "300000"
    },
    productsSupplied: ["PROD003", "PROD004"],
    paymentTerms: "Net 45",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierId: "SUP004",
    supplierName: "Stationery World",
    category: "Stationery",
    contactPerson: "Grace Ng",
    email: "grace@stationeryworld.com",
    phone: "+852 2678 9012",
    address: {
      street: "654 Paper Avenue",
      district: "Mong Kok",
      city: "Hong Kong",
      postalCode: "400000"
    },
    productsSupplied: ["PROD005"],
    paymentTerms: "Net 30",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    supplierId: "SUP005",
    supplierName: "Golden Bakery Supply",
    category: "Food",
    contactPerson: "Henry Lam",
    email: "henry@goldenbakery.com",
    phone: "+852 2789 0123",
    address: {
      street: "987 Bakery Road",
      district: "Yuen Long",
      city: "Hong Kong",
      postalCode: "500000"
    },
    productsSupplied: ["PROD007"],
    paymentTerms: "Net 7",
    status: "active",
    createdAt: new Date(),
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
db.users.createIndex({ username: 1 })
db.users.createIndex({ role: 1 })

// Products indexes
db.products.createIndex({ productId: 1 }, { unique: true })
db.products.createIndex({ category: 1 })
db.products.createIndex({ status: 1 })
db.products.createIndex({ barcode: 1 })
db.products.createIndex({ productName: "text", description: "text" })

// Orders indexes
db.orders.createIndex({ orderId: 1 }, { unique: true })
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ orderStatus: 1 })
db.orders.createIndex({ createdAt: -1 })

// Carts indexes
db.carts.createIndex({ cartId: 1 }, { unique: true })
db.carts.createIndex({ userId: 1 }, { unique: true })

// Inventory Logs indexes
db.inventory_logs.createIndex({ logId: 1 }, { unique: true })
db.inventory_logs.createIndex({ productId: 1 })
db.inventory_logs.createIndex({ operatedAt: -1 })
db.inventory_logs.createIndex({ operationType: 1 })

// Logistics indexes
db.logistics.createIndex({ logisticsId: 1 }, { unique: true })
db.logistics.createIndex({ orderId: 1 })
db.logistics.createIndex({ type: 1 })
db.logistics.createIndex({ status: 1 })

// Suppliers indexes
db.suppliers.createIndex({ supplierId: 1 }, { unique: true })
db.suppliers.createIndex({ category: 1 })
db.suppliers.createIndex({ status: 1 })

// Permissions indexes
db.permissions.createIndex({ permissionId: 1 }, { unique: true })
db.permissions.createIndex({ role: 1 } )