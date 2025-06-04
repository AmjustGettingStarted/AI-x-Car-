# AI-x-Car

AI-x-Car is a modern car marketplace web application built with [Next.js](https://nextjs.org), leveraging server-side rendering, authentication, and a PostgreSQL database via [Prisma ORM](https://www.prisma.io/). The project is designed for scalability, maintainability, and a seamless user experience.

---

## 🚀 Core Technologies

- **Next.js**: React framework for server-side rendering, routing, and API routes.
- **React**: UI library for building interactive user interfaces.
- **Prisma ORM**: Type-safe database access for PostgreSQL.
- **PostgreSQL**: Relational database for storing users, cars, bookings, etc.
- **Clerk**: Authentication and user management.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Lucide Icons**: Icon library for modern SVG icons.
- **Sonner**: Toast notifications.
- **date-fns**: Modern JavaScript date utility library.
- **Vercel**: Deployment platform (recommended).

---

## 📁 Project Structure

📦 root/
├── 📄 .env # Environment variables (DB, API keys, etc.)
├── 📄 .gitignore # Git ignored files
├── 📄 components.json # Component registry/configuration
├── 📄 eslint.config.mjs # ESLint configuration
├── 📄 jsconfig.json # JavaScript config (paths/aliases)
├── 📄 middleware.js # Next.js middleware for request handling
├── 📄 next.config.mjs # Next.js configuration
├── 📄 package.json # Project dependencies and scripts
├── 📄 postcss.config.mjs # PostCSS configuration for Tailwind
├── 📄 tailwind.config.ts # Tailwind CSS configuration
├── 📄 README.md # Project documentation (you're here)
│
├── 📁 actions/ # Server actions (API logic)
│ ├── 📄 admin.js # Admin-related actions
│ ├── 📄 car-listings.js # Car listing CRUD & wishlist logic
│ ├── 📄 cars.js # Car data fetching & manipulation
│ ├── 📄 home.js # Homepage data logic
│ ├── 📄 settings.js # User settings actions
│ └── 📄 test-drive.js # Test drive booking logic
│
├── 📁 app/ # Next.js app directory
│ ├── 📄 favicon.ico # Favicon
│ ├── 📄 globals.css # Global CSS
│ ├── 📄 layout.js # Root layout (header, footer, providers)
│ └── 📁 (main)/ # Main app routes
│ └── 📁 cars/
│ └── 📁 [id]/ # Dynamic car details page
│ ├── 📁 \_components/
│ │ ├── 📄 car-details.jsx # Car details UI and logic
│ │ └── 📄 emi-calculator.jsx # EMI calculator component
│ └── 📄 page.jsx # Car details page
│
├── 📁 components/ # Reusable UI components
│ ├── 📄 header.jsx # App header (nav, auth, logo)
│ └── 📁 ui/ # UI primitives (Button, Card, etc.)
│
├── 📁 hooks/ # Custom React hooks (e.g., useFetch)
│
├── 📁 lib/ # Helpers, utilities, and Prisma client
│ ├── 📄 checkUser.js # User verification/creation
│ ├── 📄 helper.js # Utility functions
│ └── 📁 generated/prisma/ # Auto-generated Prisma client
│ ├── 📄 index.js
│ ├── 📄 edge.js
│ ├── 📄 client.js
│ ├── 📄 default.js
│ └── 📁 runtime/
│
├── 📁 prisma/ # Prisma schema & migrations
│ └── (not shown) # Contains schema.prisma, migrations
│
├── 📁 public/ # Static assets (images, logos, etc.)
│
└── 📁 .next/ # Auto-generated Next.js build output

---

## 📝 Key Files & Directories

- **`app/layout.js`**: Root layout, includes [`Header`](components/header.jsx), global styles, and providers.
- **`components/header.jsx`**: Navigation bar with authentication, logo, and role-based links.
- **`actions/`**: Server-side logic for cars, admin, test drives, etc.
- **`lib/generated/prisma/`**: Prisma ORM client for database access (auto-generated).
- **`app/(main)/cars/[id]/_components/car-details.jsx`**: Car detail UI, wishlist, share, and quick stats.
- **`app/(main)/cars/[id]/page.jsx`**: Fetches car data and generates metadata for SEO.
- **`hooks/use-fetch.js`**: Custom hook for data fetching (not shown, but referenced).
- **`tailwind.config.ts`**: Tailwind CSS configuration for custom styles.
- **`next.config.mjs`**: Next.js configuration, including image domains and security headers.

---

## 🛠️ Getting Started

1. **Install dependencies:**
   ```sh
   npm install --legacy-peer-deps

   ```
