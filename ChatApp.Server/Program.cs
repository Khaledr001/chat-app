using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using ChatApp.Server.Data;
using ChatApp.Server.Core.Interfaces;
using ChatApp.Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Register repositories  
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();

// Configure database context based on environment
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ChatAppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization(); // Add this if you have [Authorize] attributes or plan to use authentication

app.MapControllers(); // Map controller endpoints

app.Run();
