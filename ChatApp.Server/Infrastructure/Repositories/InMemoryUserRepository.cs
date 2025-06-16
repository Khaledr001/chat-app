using ChatApp.Server.Domain.Models;
using ChatApp.Server.Domain.Repositories;

namespace ChatApp.Server.Infrastructure.Repositories
{
    /// <summary>
    /// In-memory implementation of the User repository for testing purposes
    /// </summary>
    public class InMemoryUserRepository : IUserRepository
    {
        private readonly List<User> _users = new List<User>();

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => u.Id == id));
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => 
                u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)));
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => 
                u.Email.Equals(email, StringComparison.OrdinalIgnoreCase)));
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await Task.FromResult(_users.AsEnumerable());
        }

        public async Task<User> CreateAsync(User user)
        {
            if (user.Id == Guid.Empty)
            {
                user.Id = Guid.NewGuid();
            }

            _users.Add(user);
            return await Task.FromResult(user);
        }

        public async Task<User> UpdateAsync(User user)
        {
            var existingUser = _users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with ID {user.Id} not found");
            }

            // Remove the existing user and add the updated one
            _users.Remove(existingUser);
            _users.Add(user);

            return await Task.FromResult(user);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user == null)
            {
                return await Task.FromResult(false);
            }

            _users.Remove(user);
            return await Task.FromResult(true);
        }
    }
}