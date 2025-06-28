# ChatApp.Server

A clean architecture ASP.NET Core Web API for a chat application with PostgreSQL and Entity Framework Core.

## Project Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-app
   ```

2. **Configure the database**
   - Update the `DefaultConnection` string in `ChatApp.Server/appsettings.Development.json` to point to your PostgreSQL instance.

3. **Restore dependencies**
   ```bash
   dotnet restore
   ```

4. **Apply database migrations**
   ```bash
   dotnet ef database update --project ChatApp.Server/ChatApp.Server.csproj --startup-project ChatApp.Server/ChatApp.Server.csproj
   ```

5. **Run the project**
   ```bash
   dotnet watch run --project ChatApp.Server/ChatApp.Server.csproj
   ```

## Migration Commands

- Add a new migration:
  ```bash
  dotnet ef migrations add <MigrationName> --project ChatApp.Server/ChatApp.Server.csproj --startup-project ChatApp.Server/ChatApp.Server.csproj
  ```
- Update the database:
  ```bash
  dotnet ef database update --project ChatApp.Server/ChatApp.Server.csproj --startup-project ChatApp.Server/ChatApp.Server.csproj
  ```

## API Documentation

### Quick Navigation
- [Get all users](#get-all-users)
- [Get user by ID](#get-user-by-id)
- [Create a new user](#create-a-new-user)
- [Update a user](#update-a-user)
- [Delete a user](#delete-a-user)

### Users

#### Get all users
- **GET** `/api/users`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "userName": "john",
      "email": "john@example.com"
    }
  ]
  ```

#### Get user by ID
- **GET** `/api/users/{id}`
- **Response:**
  ```json
  {
    "id": 1,
    "userName": "john",
    "email": "john@example.com"
  }
  ```

#### Create a new user
- **POST** `/api/users`
- **Body:**
  ```json
  {
    "userName": "john",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "userName": "john",
    "email": "john@example.com"
  }
  ```

#### Update a user
- **PUT** `/api/users/{id}`
- **Body:**
  ```json
  {
    "userName": "johnny",
    "email": "johnny@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "userName": "johnny",
    "email": "johnny@example.com"
  }
  ```

#### Delete a user
- **DELETE** `/api/users/{id}`
- **Response:**
  - `204 No Content`

## Project Structure

- `Core/Entities`      - Domain entities
- `Core/Interfaces`    - Repository interfaces
- `Infrastructure`     - Repository implementations
- `Data`               - EF Core DbContext and data models
- `API/Controllers`    - Web API controllers
- `API/DTOs`           - Data transfer objects

---
