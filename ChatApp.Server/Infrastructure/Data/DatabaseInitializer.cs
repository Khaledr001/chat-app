using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ChatApp.Server.Infrastructure.Data
{
    /// <summary>
    /// Service for initializing the database
    /// </summary>
    public static class DatabaseInitializer
    {
        /// <summary>
        /// Initialize the database (apply migrations, seed data)
        /// </summary>
        public static async Task InitializeDatabaseAsync(IHost host)
        {
            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<AppDbContext>>();

            try
            {
                var context = services.GetRequiredService<AppDbContext>();
                
                // Apply migrations if using a real database
                if (context.Database.ProviderName != "Microsoft.EntityFrameworkCore.InMemory")
                {
                    logger.LogInformation("Applying migrations...");
                    await context.Database.MigrateAsync();
                }
                
                // Seed data if needed
                await SeedDataAsync(context, logger);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while initializing the database.");
                throw;
            }
        }

        /// <summary>
        /// Seed initial data into the database
        /// </summary>
        private static async Task SeedDataAsync(AppDbContext context, ILogger logger)
        {
            // Check if we need to seed data
            if (!await context.Users.AnyAsync())
            {
                logger.LogInformation("Seeding database...");
                
                // Add seed data here if needed
                // Example:
                // await context.Users.AddRangeAsync(new List<User> { ... });
                // await context.SaveChangesAsync();
            }
        }
    }
}