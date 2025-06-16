using ChatApp.Server.Infrastructure.Data;
using Microsoft.Extensions.Configuration;

namespace ChatApp.Server.Infrastructure.Config
{
    /// <summary>
    /// Service for loading environment configuration
    /// </summary>
    public class EnvironmentConfig
    {
        private readonly IConfiguration _configuration;

        public EnvironmentConfig(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Gets PostgreSQL database configuration from environment variables or appsettings.json
        /// </summary>
        public PostgresDbConfig GetPostgresConfig()
        {
            // Try to get configuration from environment variables first
            var host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
            var portStr = Environment.GetEnvironmentVariable("POSTGRES_PORT");
            var database = Environment.GetEnvironmentVariable("POSTGRES_DB");
            var username = Environment.GetEnvironmentVariable("POSTGRES_USER");
            var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");

            // If environment variables are not set, try to get from appsettings.json
            if (string.IsNullOrEmpty(host))
            {
                host = _configuration["PostgreSQL:Host"];
            }

            if (string.IsNullOrEmpty(portStr))
            {
                portStr = _configuration["PostgreSQL:Port"];
            }

            if (string.IsNullOrEmpty(database))
            {
                database = _configuration["PostgreSQL:Database"];
            }

            if (string.IsNullOrEmpty(username))
            {
                username = _configuration["PostgreSQL:Username"];
            }

            if (string.IsNullOrEmpty(password))
            {
                password = _configuration["PostgreSQL:Password"];
            }

            // Parse port or use default
            int port = 5432;
            if (!string.IsNullOrEmpty(portStr) && int.TryParse(portStr, out int parsedPort))
            {
                port = parsedPort;
            }

            return new PostgresDbConfig
            {
                Host = host ?? string.Empty,
                Port = port,
                Database = database ?? string.Empty,
                Username = username ?? string.Empty,
                Password = password ?? string.Empty
            };
        }
    }
}