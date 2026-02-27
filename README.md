# E-Commerce Platform

A full-stack e-commerce application built with Spring Boot and Next.js. It supports multiple user roles (Admin, Seller, Buyer) and includes features such as product management, cart, orders, wishlist, and seller inventory — secured with JWT authentication using RSA-256 key pairs.

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
  - [1. Generate RSA Keys](#1-generate-rsa-keys)
  - [2. Setup Backend (Spring Boot API)](#2-setup-backend-spring-boot-api)
  - [3. Setup Frontend (Next.js)](#3-setup-frontend-nextjs)
- [Running the Project](#-running-the-project)
- [Environment Variables](#-environment-variables)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

## 🚀 Tech Stack

### Backend

| Technology         | Details                                    |
| ------------------ | ------------------------------------------ |
| **Framework**      | Spring Boot 4.0.1                          |
| **Language**       | Java 25                                    |
| **Database**       | PostgreSQL                                 |
| **Authentication** | JWT with RSA-256 (access + refresh tokens) |
| **Build Tool**     | Maven (Maven Wrapper included)             |
| **ORM**            | Spring Data JPA / Hibernate                |
| **Object Mapping** | MapStruct 1.6.3                            |
| **Validation**     | Spring Boot Starter Validation             |
| **Utilities**      | Lombok                                     |

### Frontend

| Technology           | Details                     |
| -------------------- | --------------------------- |
| **Framework**        | Next.js 16.1.4 (App Router) |
| **Language**         | TypeScript 5                |
| **Styling**          | Tailwind CSS v4             |
| **UI Components**    | Radix UI, shadcn/ui         |
| **State / Fetching** | TanStack React Query v5     |
| **Forms**            | React Hook Form + Zod v4    |
| **Package Manager**  | pnpm                        |

## ✨ Features

### Buyer

- Browse and search products by category
- Add products to cart and wishlist
- Place and track orders
- Manage shipping addresses and profile

### Seller

- Dashboard with sales overview
- Product and inventory management
- Order management and payouts

### Admin

- User management
- Category management
- Platform-wide order and product oversight

### General

- JWT-based authentication (RSA-256, access + refresh tokens)
- Role-based access control (Admin / Seller / Buyer)
- Image upload support
- Responsive design with dark mode

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement  | Version            | Notes                                         |
| ------------ | ------------------ | --------------------------------------------- |
| **Java JDK** | 25                 | Required for Spring Boot 4                    |
| **Node.js**  | v18 or higher      |                                               |
| **pnpm**     | v8 or higher       | `npm install -g pnpm`                         |
| **Docker**   | Any recent version | Optional — for running PostgreSQL via Compose |
| **OpenSSL**  | Any recent version | Required for generating RSA keys              |

## 📁 Project Structure

```
aditi-midterm-project/
├── ecom.api/                          # Spring Boot backend
│   ├── src/main/
│   │   ├── java/aditi/wing/ecom/api/
│   │   │   ├── domain/
│   │   │   │   ├── auth/              # Authentication (register, login, refresh)
│   │   │   │   ├── product/           # Product CRUD and search
│   │   │   │   ├── cart/              # Shopping cart
│   │   │   │   ├── orders/            # Order placement and tracking
│   │   │   │   ├── wishlist/          # Wishlist
│   │   │   │   ├── seller/            # Seller-specific features
│   │   │   │   ├── admin/             # Admin-specific features
│   │   │   │   └── address/           # Shipping address management
│   │   │   ├── common/
│   │   │   │   ├── config/            # Security, CORS, JWT config
│   │   │   │   ├── middleware/        # Filters and interceptors
│   │   │   │   └── util/              # Shared utilities
│   │   │   └── Application.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       └── certs/                 # RSA key pair (gitignored)
│   ├── compose.yaml                   # Docker Compose for PostgreSQL
│   ├── run.sh                         # Startup script (Linux/macOS)
│   ├── run.ps1                        # Startup script (Windows)
│   └── pom.xml
└── web/                               # Next.js frontend
    ├── app/
    │   ├── (auth)/                    # Login and Register
    │   ├── (public)/                  # Public product listing
    │   ├── buyer/                     # Cart, checkout, orders, profile, wishlist
    │   ├── seller/                    # Dashboard, inventory, products, payouts
    │   └── admin/                     # User, category, order, product management
    ├── components/                    # Shared UI components
    ├── hooks/                         # Custom React hooks
    ├── lib/                           # API client, services, types
    ├── schemas/                       # Zod validation schemas
    └── context/                       # Context providers (cart, etc.)
```

## ⚙️ Setup Instructions

### 1. Generate RSA Keys

The application uses RSA-256 for JWT token signing. You must generate a private/public key pair and place it in the correct directory before starting the backend.

```bash
# Navigate to the certs directory
cd ecom.api/src/main/resources/certs

# Generate 2048-bit RSA private key
openssl genrsa -out private.pem 2048

# Derive the public key from the private key
openssl rsa -in private.pem -pubout -out public.pem

# Verify both files exist
ls -la
# Expected: private.pem  public.pem
```

> **Security note:** `private.pem` is already listed in `.gitignore`. Never commit it to version control.

---

### 2. Setup Backend (Spring Boot API)

#### Step 1: Start PostgreSQL

**Option A — Docker Compose (recommended):**

```bash
cd ecom.api
docker compose up -d
```

This starts PostgreSQL on port `5432` with:

- Database: `mydatabase`
- User: `myuser`
- Password: `secret`

**Option B — Local PostgreSQL:**  
Create a database manually and note the credentials for Step 2.

---

#### Step 2: Create the `.env` file

Copy the example and fill in your values:

```bash
cd ecom.api
cp ".env example" .env
```

Edit `.env`:

```env
DB_URL=jdbc:postgresql://localhost:5432/mydatabase
DB_USERNAME=myuser
DB_PASSWORD=secret
PORT=8000
JWT_SECRET=your-hex-secret-key-minimum-256-bits
ALLOWED_CORS=http://localhost:3000
```

> **Generating a JWT secret:**
>
> ```bash
> openssl rand -hex 32
> ```

**Alternative — Hardcode values directly in `application.properties`:**

Instead of using a `.env` file, you can set values directly in `ecom.api/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydatabase
spring.datasource.username=myuser
spring.datasource.password=secret
server.port=8000
jwt.secret=your-hex-secret-here
allowed.cors=http://localhost:3000
```

> This approach is simpler for local development but **do not commit credentials** to version control. Use the `.env` approach for any shared or production environment.

---

#### Step 3: Build and Run

**Linux / macOS:**

```bash
cd ecom.api
chmod +x run.sh
./run.sh
```

**Windows (PowerShell):**

```powershell
cd ecom.api
powershell -ExecutionPolicy Bypass -File run.ps1
```

**Manual (any OS):**

```bash
cd ecom.api
# Source environment variables first
set -a && source .env && set +a

./mvnw spring-boot:run \
  -Dspring-boot.run.arguments="--spring.datasource.url=$DB_URL \
  --spring.datasource.username=$DB_USERNAME \
  --spring.datasource.password=$DB_PASSWORD \
  --server.port=$PORT \
  --jwt.secret=$JWT_SECRET \
  --allowed.cors=$ALLOWED_CORS"
```

The API will be available at `http://localhost:8000`

---

### 3. Setup Frontend (Next.js)

#### Step 1: Install Dependencies

```bash
cd web
pnpm install
```

#### Step 2: Create the `.env.local` File

```bash
cd web
```

Create a file named `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> Make sure the port matches your backend `PORT` value.

#### Step 3: Run the Development Server

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## 🏃 Running the Project

### Quick Start (Development)

Open **three separate terminals** and run the following in order:

**Terminal 1 — Database:**

```bash
cd ecom.api
docker compose up -d
```

**Terminal 2 — Backend:**

```bash
cd ecom.api
./run.sh        # Linux/macOS
# or
powershell -ExecutionPolicy Bypass -File run.ps1   # Windows
```

**Terminal 3 — Frontend:**

```bash
cd web
pnpm dev
```

**Access the application:**
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |

---

### Production Build

**Backend:**

```bash
cd ecom.api
# Source your .env before building
set -a && source .env && set +a

./mvnw clean package -DskipTests
java -jar target/ecom.api-0.0.1-SNAPSHOT.jar
```

**Frontend:**

```bash
cd web
pnpm build
pnpm start
```

## 🔐 Environment Variables

### Backend (`ecom.api/.env`)

| Variable       | Description                                   | Example                                       |
| -------------- | --------------------------------------------- | --------------------------------------------- |
| `DB_URL`       | PostgreSQL JDBC connection URL                | `jdbc:postgresql://localhost:5432/mydatabase` |
| `DB_USERNAME`  | Database username                             | `myuser`                                      |
| `DB_PASSWORD`  | Database password                             | `secret`                                      |
| `PORT`         | Backend server port                           | `8000`                                        |
| `JWT_SECRET`   | Secret key for JWT signing (hex, min 256-bit) | `8fc398027b448081...`                         |
| `ALLOWED_CORS` | Allowed CORS origin for the frontend          | `http://localhost:3000`                       |

> A template is available at `ecom.api/.env example`.

### Frontend (`web/.env.local`)

| Variable              | Description                 | Example                 |
| --------------------- | --------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:8000` |

## 🔍 Troubleshooting

### "RSA key not found" error

- Ensure you generated both keys: `private.pem` and `public.pem`
- Verify they are in `ecom.api/src/main/resources/certs/`
- File names must match exactly (lowercase, `.pem` extension)

### Database connection failed

- Check that the PostgreSQL container is running: `docker ps`
- Verify the credentials in your `.env` match `compose.yaml`
- Ensure `DB_URL` uses the correct database name

### Port already in use

- Change `PORT` in `.env` and `NEXT_PUBLIC_API_URL` in `.env.local` accordingly
- Or free the port: `lsof -ti:8000 | xargs kill -9`

### `ALLOWED_CORS` error / blocked requests

- Confirm `ALLOWED_CORS` in `.env` matches exactly the origin the frontend runs on (e.g., `http://localhost:3000`)
- Do not include a trailing slash

### Frontend can't reach the backend

- Confirm `NEXT_PUBLIC_API_URL` in `web/.env.local` points to the correct backend URL and port
- Restart the Next.js dev server after changing `.env.local`

### `pnpm: command not found`

```bash
npm install -g pnpm
```

## 📄 License

This project is for educational purposes (ADITI Midterm Project).
