using ChatApp.Server.Domain.Models;

namespace ChatApp.Server.Domain.Services
{
    /// <summary>
    /// Interface for User service operations
    /// </summary>
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(Guid id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user, string password);
        Task<User> UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(Guid id);
        Task<bool> ValidateUserCredentialsAsync(string usernameOrEmail, string password);
    }
}