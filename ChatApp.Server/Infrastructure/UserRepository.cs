using Microsoft.EntityFrameworkCore;
using User = ChatApp.Server.Core.Entities.User;
using ChatApp.Server.Core.Interfaces;
using ChatApp.Server.Data;

namespace ChatApp.Server.Infrastructure
{
    public class UserRepository : IUserRepository
    {
        private readonly ChatAppDbContext _context;

        public UserRepository(ChatAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            
            return await _context.Users.Select(u => new User
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                PasswordHash = u.PasswordHash
            }).ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            var u = await _context.Users.FindAsync(id);
            if (u == null) return null;
            return new User
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                PasswordHash = u.PasswordHash
            };
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            var u = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
            if (u == null) return null;
            return new User
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                PasswordHash = u.PasswordHash
            };
        }

        public async Task<User> CreateAsync(User user)
        {
            var dbUser = new User
            {
                UserName = user.UserName,
                Email = user.Email,
                PasswordHash = user.PasswordHash
            };
            _context.Users.Add(dbUser);
            await _context.SaveChangesAsync();
            user.Id = dbUser.Id;
            return user;
        }

        public async Task<User?> UpdateAsync(User user)
        {
            var dbUser = await _context.Users.FindAsync(user.Id);
            if (dbUser == null) return null;
            dbUser.UserName = user.UserName;
            dbUser.Email = user.Email;
            dbUser.PasswordHash = user.PasswordHash;
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dbUser = await _context.Users.FindAsync(id);
            if (dbUser == null) return false;
            _context.Users.Remove(dbUser);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
