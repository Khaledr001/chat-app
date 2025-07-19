using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatApp.Server.Core.Interfaces
{
    public interface IAuthRepository
    {
        // Interface for authentication repository
        Task<bool> RegisterAsync(string username, string email, string password);
        Task<string?> LoginAsync(string email, string password);
        Task<bool> ChangePasswordAsync(int userId, string oldPassword, string newPassword);
        

    }
}