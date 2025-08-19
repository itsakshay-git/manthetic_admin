# Manthetic Admin Dashboard

A modern, feature-rich admin dashboard built with React, Vite, and Tailwind CSS for managing e-commerce operations including products, variants, categories, customers, orders, and reviews.

![Manthetic Admin](https://img.shields.io/badge/React-18.0.0-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0.0-cyan)
![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Components](#-components)
- [Hooks](#-hooks)
- [Validation](#-validation)
- [Styling](#-styling)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Protected routes** for admin-only access
- **Role-based access control** (Admin/Staff)
- **Session management** with automatic token refresh

### 📊 Dashboard & Analytics
- **Real-time statistics** (Revenue, Orders, Customers)
- **Interactive charts** using Recharts
- **Monthly and daily sales** analytics
- **Performance metrics** and insights

### 🛍️ Product Management
- **Product CRUD operations** with image uploads
- **Category management** with hierarchical organization
- **Variant management** with size, price, and stock tracking
- **Bulk operations** for efficient management
- **Advanced search and filtering** capabilities

### 👥 Customer Management
- **Customer database** with detailed profiles
- **Order history** tracking
- **Customer analytics** and insights
- **Search and filter** functionality

### 📦 Order Management
- **Order lifecycle** management (Pending → Confirmed → Shipped → Delivered)
- **Payment status** tracking
- **Order details** with item breakdowns
- **Status updates** with notifications

### ⭐ Review Management
- **Product review** moderation
- **Rating management** and analytics
- **Review approval** workflow
- **Customer feedback** insights

### 🔍 Advanced Features
- **Real-time search** across all entities
- **Responsive design** for mobile and desktop

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form management with validation
- **Zod** - TypeScript-first schema validation

### State Management
- **TanStack Query** - Server state management and caching
- **React Context** - Local state management
- **Zustand** - Lightweight state management

### UI Components
- **Shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant forms with validation
- **Sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher (or **yarn** 1.22.0+)
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/manthetic-admin.git
cd manthetic-admin
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying from `env.example`:

```bash
# Option 1: Use the setup script (recommended)
npm run setup

# Option 2: Manual copy
cp env.example .env
```

Then customize the `.env` file with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_TOKEN_KEY=manthetic_token

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🔧 Environment Setup

### Development Environment

```bash

# Start development server with hot reload
npm run dev
```

### Production Build

```bash
# Build for production
npm run build
```

## 📁 Project Structure

```
manthetic-admin/
├── public/                 # Static assets
│   ├── menthetic.png      # Brand logo
│   └── vite.svg           # Vite logo
├── src/                   # Source code
│   ├── app/              # Application state
│   │   └── store.js      # Global state management
│   ├── assets/           # Images and static files
│   ├── components/       # Reusable UI components
│   │   ├── category/     # Category management
│   │   ├── customers/    # Customer management
│   │   ├── layout/       # Layout components
│   │   ├── orders/       # Order management
│   │   ├── product/      # Product management
│   │   ├── review/       # Review management
│   │   ├── shared/       # Shared components
│   │   └── ui/           # Base UI components
│   ├── features/         # Feature-specific logic
│   │   └── auth/         # Authentication
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── validation/   # Validation schemas
│   │   ├── axios.js      # HTTP client
│   │   ├── constants.js  # Application constants
│   │   └── utils.js      # Utility functions
│   ├── layout/           # Layout components
│   ├── pages/            # Page components
│   └── routes/           # Routing configuration
├── .eslintrc.js          # ESLint configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🎯 Usage

### Authentication

```jsx
import { useAuth } from '@/hooks/auth/useAuth';

function LoginPage() {
  const { login, isLoading } = useAuth();
  
  const handleSubmit = async (credentials) => {
    await login(credentials);
  };
  
  return (
    // Login form implementation
  );
}
```

### Product Management

```jsx
import { useAddProduct } from '@/hooks/product/useProduct';

function AddProductForm() {
  const { mutate: addProduct, isLoading } = useAddProduct();
  
  const handleSubmit = (productData) => {
    addProduct(productData, {
      onSuccess: () => {
        // Handle success
      },
      onError: (error) => {
        // Handle error
      }
    });
  };
  
  return (
    // Product form implementation
  );
}
```

### Data Fetching

```jsx
import { useGetAllProducts } from '@/hooks/product/useProduct';

function ProductsPage() {
  const { data: products, isLoading, error } = useGetAllProducts({
    page: 1,
    limit: 10,
    category: 'electronics'
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🔌 API Integration

### Base Configuration

```javascript
// src/lib/axios.js
import axios from 'axios';
import { API_CONFIG } from './config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem(API_CONFIG.TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Configuration Management

The application uses a centralized configuration system in `src/lib/config.js`:

```javascript
// src/lib/config.js
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  TOKEN_KEY: import.meta.env.VITE_TOKEN_KEY || 'manthetic_token',
};

export const FEATURE_FLAGS = {
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
};

export const VALIDATION_CONFIG = {
  PRODUCT: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 1000,
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  },
  // ... more validation rules
};
```

### API Endpoints

```javascript
// Product endpoints
GET    /api/products           # Get all products
POST   /api/products           # Create product
GET    /api/products/:id       # Get product by ID
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product

// Category endpoints
GET    /api/categories         # Get all categories
POST   /api/categories         # Create category
PUT    /api/categories/:id     # Update category
DELETE /api/categories/:id     # Delete category

// Customer endpoints
GET    /api/customers          # Get all customers
GET    /api/customers/:id      # Get customer by ID
DELETE /api/customers/:id      # Delete customer

// Order endpoints
GET    /api/orders             # Get all orders
PUT    /api/orders/:id/status  # Update order status
```

## 🧩 Components

### Core Components

- **Layout Components**: `AdminLayout`, `Navbar`, `Sidebar`
- **Form Components**: `ProductForm`, `CategoryForm`, `VariantForm`
- **Table Components**: `ProductTable`, `CustomerTable`, `OrderTable`
- **Modal Components**: `EditProductModal`, `AddCategoryModal`
- **UI Components**: `Button`, `Input`, `Select`, `Badge`

### Component Example

```jsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );
}
```

## 🪝 Custom Hooks

### Authentication Hooks

```javascript
// useAuth.js
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = async (credentials) => {
    // Login logic
  };
  
  const logout = () => {
    // Logout logic
  };
  
  return { user, isAuthenticated, login, logout };
};
```

### Data Hooks

```javascript
// useProduct.js
export const useGetAllProducts = (params) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## ✅ Validation

### Zod Schemas

```javascript
// productSchema.js
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  category_id: z.string().min(1, 'Category is required'),
  main_image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, 'Image is required')
    .refine(
      (files) => files[0]?.type.startsWith('image/'),
      'File must be an image'
    ),
});
```

### Form Integration

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('name')} />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
    </form>
  );
}
```

## 🎨 Styling

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### Component Styling

```jsx
// Using Tailwind CSS classes
<div className="p-6 bg-white shadow-md rounded-md space-y-4">
  <h2 className="text-xl font-semibold text-gray-900">Add Product</h2>
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">Product Name</label>
    <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
  </div>
</div>
```

### Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Vite** team for the fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **React Query** for efficient data fetching
- **Zod** for runtime type validation

## 📞 Support

If you have any questions or need help:
- **Email**: support@manthetic.com

## 🔄 Changelog

### Version 1.0.0 (Current)
- ✨ Initial release with full admin dashboard
- 🔐 JWT authentication system
- 📊 Real-time analytics and charts
- 🛍️ Complete product management
- 👥 Customer and order management
- ⭐ Review moderation system
- 🔍 Advanced search and filtering
- 📱 Responsive design for all devices

---

**Built with ❤️ by the Manthetic Team**

For more information, visit [manthetic.com](https://manthetic.com)
