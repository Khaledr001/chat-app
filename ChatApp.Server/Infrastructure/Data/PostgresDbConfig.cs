namespace ChatApp.Server.Infrastructure.Data
{
    /// <summary>
    /// Configuration class for PostgreSQL database connection
    /// </summary>
    public class PostgresDbConfig
    {
        public string Host { get; set; } = string.Empty;
        public int Port { get; set; } = 5432; // Default PostgreSQL port
        public string Database { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        
        /// <summary>
        /// Gets the connection string for PostgreSQL
        /// </summary>
        public string GetConnectionString()
        {
            return $"Host={Host};Port={Port};Database={Database};Username={Username};Password={Password}";
        }
    }
}