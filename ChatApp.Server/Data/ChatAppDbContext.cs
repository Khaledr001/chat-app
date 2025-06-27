using Microsoft.EntityFrameworkCore;

namespace ChatApp.Server.Data
{
    public class ChatAppDbContext : DbContext
    {
        public ChatAppDbContext(DbContextOptions<ChatAppDbContext> options)
            : base(options)
        {
        }

        // Define your DbSets here, e.g.:
        public DbSet<User> Users { get; set; }
        // public DbSet<Message> Messages { get; set; }
    }
}
