# PostgreSQL Database Setup for Chat Application

## Prerequisites

- PostgreSQL installed and running
- .NET 9.0 SDK installed

## Configuration

### Environment Variables

The application supports configuration through environment variables. Copy the `.env.example` file to create a `.env` file:

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL credentials:

```
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=chatapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
```

### Application Settings

Alternatively, you can configure the database connection in `appsettings.json`. The application will check environment variables first, then fall back to `appsettings.json`.

```json
{
  "PostgreSQL": {
    "Host": "localhost",
    "Port": 5432,
    "Database": "chatapp",
    "Username": "postgres",
    "Password": "your_secure_password"
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=chatapp;Username=postgres;Password=your_secure_password"
  }
}
```

## Database Creation

1. Create a new PostgreSQL database:

```sql
CREATE DATABASE chatapp;
```

2. Create a user (if not using the default postgres user):

```sql
CREATE USER chatapp_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE chatapp TO chatapp_user;
```

## Running Migrations

The application will automatically apply migrations when it starts in non-development environments. In development mode, an in-memory database is used by default.

To manually create and apply migrations:

1. Install the EF Core tools if you haven't already:

```bash
dotnet tool install --global dotnet-ef
```

2. Create a migration:

```bash
dotnet ef migrations add InitialCreate --project ChatApp.Server
```

3. Apply migrations:

```bash
dotnet ef database update --project ChatApp.Server
```

## Switching Between Database Providers

The application is configured to use:

- In-memory database for development
- PostgreSQL for production

To use PostgreSQL in development mode, modify the `Program.cs` file to use PostgreSQL regardless of environment.

## Database Initialization

The `DatabaseInitializer` class handles:

1. Applying pending migrations
2. Seeding initial data (if needed)

You can modify the `SeedDataAsync` method in `DatabaseInitializer.cs` to add initial data to your database.