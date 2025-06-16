using ChatApp.Server.Domain.Models;
using ChatApp.Server.Domain.Repositories;
using ChatApp.Server.Domain.Services;
using System.Security.Cryptography;
using System.Text;

namespace ChatApp.Server.Application.Services
{
    /// <summary>
    /// Implementation of the User service
    /// </summary>
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User?> GetUserByIdAsync(Guid id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetByUsernameAsync(username);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async Task<User> CreateUserAsync(User user, string password)
        {
            // Hash the password before storing
            user.PasswordHash = HashPassword(password);
            user.CreatedAt = DateTime.UtcNow;
            user.IsActive = true;
            
            return await _userRepository.CreateAsync(user);
        }

        public async Task<User> UpdateUserAsync(User user)
        {
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            return await _userRepository.DeleteAsync(id);
        }

        public async Task<bool> ValidateUserCredentialsAsync(string usernameOrEmail, string password)
        {
            // Try to find user by username or email
            var user = await _userRepository.GetByUsernameAsync(usernameOrEmail) ?? 
                       await _userRepository.GetByEmailAsync(usernameOrEmail);

            if (user == null)
                return false;

            // Verify password hash
            bool isValid = VerifyPassword(password, user.PasswordHash);
            
            if (isValid)
            {
                // Update last login timestamp
                user.LastLoginAt = DateTime.UtcNow;
                await _userRepository.UpdateAsync(user);
            }
            
            return isValid;
        }

        #region Helper Methods

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            string passwordHash = HashPassword(password);
            return passwordHash == storedHash;
        }

        #endregion
    }
}