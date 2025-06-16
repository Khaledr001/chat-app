using Scalar.AspNetCore;
using ChatApp.Server.Domain.Repositories;
using ChatApp.Server.Domain.Services;
using ChatApp.Server.Application.Services;
using ChatApp.Server.Infrastructure.Repositories;
using ChatApp.Server.Infrastructure.Data;
using ChatApp.Server.Infrastructure.Config;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Register environment configuration service
builder.Services.AddSingleton<EnvironmentConfig>();

// Configure database context based on environment
var isDevelopment = builder.Environment.IsDevelopment();

if (isDevelopment)
{
    // Use in-memory database for development
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("ChatAppDb"));
    
    // Use in-memory repository for development
    builder.Services.AddSingleton<IUserRepository, InMemoryUserRepository>();
}
else
{
    // Use PostgreSQL for production
    builder.Services.AddDbContext<AppDbContext>(options =>
    {
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        options.UseNpgsql(connectionString);
    });
    
    // Use PostgreSQL repository for production
    builder.Services.AddScoped<IUserRepository, PostgresUserRepository>();
}

// Register services
builder.Services.AddScoped<IUserService, UserService>();

// Add PostgreSQL configuration
builder.Services.AddSingleton(provider =>
{
    var envConfig = provider.GetRequiredService<EnvironmentConfig>();
    return envConfig.GetPostgresConfig();
});

var app = builder.Build();

// Initialize the database
if (!app.Environment.IsDevelopment())
{
    // Only run migrations in non-development environments
    // In development, we're using an in-memory database
    await DatabaseInitializer.InitializeDatabaseAsync(app);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.MapControllers();
app.MapGet("/test", () => "API is running!");

app.Run();
