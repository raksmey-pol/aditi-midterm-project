# E-Commerce Platform

A full-stack e-commerce application built with Spring Boot and Next.js, featuring JWT authentication with RSA encryption.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [1. Generate RSA Keys](#1-generate-rsa-keys)
  - [2. Setup Backend (Spring Boot API)](#2-setup-backend-spring-boot-api)
  - [3. Setup Frontend (Next.js)](#3-setup-frontend-nextjs)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)

## 🚀 Tech Stack

### Backend

- **Framework**: Spring Boot 3.x
- **Language**: Java 17+
- **Database**: PostgreSQL
- **Authentication**: JWT with RSA-256
- **Build Tool**: Maven

### Frontend

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Docker**: (optional, for running PostgreSQL)
- **OpenSSL**: For generating RSA keys

## 📁 Project Structure

```
aditi-midterm-project/
├── ecom.api/          # Spring Boot backend API
│   ├── src/
│   ├── pom.xml
│   └── compose.yaml   # Docker Compose for PostgreSQL
└── web/               # Next.js frontend
    ├── app/
    ├── components/
    └── lib/
```

## ⚙️ Setup Instructions

### 1. Generate RSA Keys

The application uses RSA-256 for JWT token signing. You need to generate a private and public key pair.

#### Option A: Using OpenSSL (Recommended)

```bash
# Navigate to the backend certs directory
cd ecom.api/src/main/resources/certs

# Generate private key
openssl genrsa -out private.pem 2048

# Generate public key from private key
openssl rsa -in private.pem -pubout -out public.pem

# Verify the keys were created
ls -la
```

#### Option B: Using Java keytool

```bash
# Navigate to the certs directory
cd ecom.api/src/main/resources/certs

# Generate key pair
keytool -genkeypair -alias jwt -keyalg RSA -keysize 2048 \
  -keystore keystore.jks -storepass changeit

# Export public key
keytool -exportcert -alias jwt -keystore keystore.jks \
  -storepass changeit -file public.pem

# Extract private key (requires additional conversion)
```

**Important**:

- Keep `private.pem` secure and never commit it to version control
- Add `private.pem` to `.gitignore`
- The keys should be in PEM format

### 2. Setup Backend (Spring Boot API)

#### Step 1: Start PostgreSQL Database

Using Docker Compose:

```bash
cd ecom.api
docker compose up -d
```

Or install PostgreSQL locally and create a database named `mydatabase`.

#### Step 2: Configure Environment Variables

Create a `.env` file in the `ecom.api/` directory or set environment variables:

```bash
# Database Configuration
export DB_URL=jdbc:postgresql://localhost:5432/mydatabase
export DB_USERNAME=myuser
export DB_PASSWORD=secret

# Server Configuration
export PORT=8080

# JWT Configuration
export JWT_SECRET=your-secret-key-here-minimum-256-bits
```

**For development**, you can also create `application-dev.properties` in `src/main/resources/`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/mydatabase
spring.datasource.username=myuser
spring.datasource.password=secret
server.port=8080
jwt.secret=your-secret-key-here-minimum-256-bits
```

#### Step 3: Build and Run

```bash
# Using Maven Wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run

# Or using the run script
chmod +x run.sh
./run.sh

# Or using installed Maven
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### 3. Setup Frontend (Next.js)

#### Step 1: Install Dependencies

```bash
cd web
npm install
```

#### Step 2: Configure Environment Variables

Create a `.env.local` file in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

#### Step 3: Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🏃 Running the Project

### Quick Start (Development)

1. **Start the database**:

   ```bash
   cd ecom.api
   docker compose up -d
   ```

2. **Start the backend** (in a new terminal):

   ```bash
   cd ecom.api
   export DB_URL=jdbc:postgresql://localhost:5432/mydatabase
   export DB_USERNAME=myuser
   export DB_PASSWORD=secret
   export PORT=8080
   export JWT_SECRET=your-secret-key-here
   ./mvnw spring-boot:run
   ```

3. **Start the frontend** (in a new terminal):

   ```bash
   cd web
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

### Production Build

#### Backend:

```bash
cd ecom.api
./mvnw clean package
java -jar target/ecom.api-*.jar
```

#### Frontend:

```bash
cd web
npm run build
npm start
```

## 🔐 Environment Variables

### Backend (`ecom.api`)

| Variable      | Description                | Example                                       |
| ------------- | -------------------------- | --------------------------------------------- |
| `DB_URL`      | PostgreSQL connection URL  | `jdbc:postgresql://localhost:5432/mydatabase` |
| `DB_USERNAME` | Database username          | `myuser`                                      |
| `DB_PASSWORD` | Database password          | `secret`                                      |
| `PORT`        | Server port                | `8080`                                        |
| `JWT_SECRET`  | Secret key for JWT signing | `your-secret-key-256-bits`                    |

### Frontend (`web`)

| Variable              | Description     | Example                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` |

## 📝 Additional Notes

- **RSA Keys Location**: The RSA keys must be placed in `ecom.api/src/main/resources/certs/`
- **Database Migrations**: The application uses Hibernate with `ddl-auto=update`. In production, consider using a proper migration tool like Flyway or Liquibase.
- **CORS**: Make sure to configure CORS in the backend to allow requests from the frontend origin.

## 🔍 Troubleshooting

### "RSA key not found" error

- Ensure you've generated the RSA keys in the correct location
- Verify the file names are exactly `private.pem` and `public.pem`

### Database connection failed

- Check if PostgreSQL is running: `docker ps`
- Verify environment variables are set correctly
- Ensure the database exists

### Port already in use

- Change the port in environment variables
- Kill the process using the port: `lsof -ti:8080 | xargs kill -9`

## 📄 License

This project is for educational purposes (ADITI Midterm Project).
