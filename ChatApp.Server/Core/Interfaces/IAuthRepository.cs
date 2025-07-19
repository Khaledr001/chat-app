using ChatApp.Server.API.DTOs;
using ChatApp.Server.Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.Core.Interfaces
{
    public interface IAuthRepository
    {
        Task<RegisterDto> RegisterAsync(RegisterDto registerDto);
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
    }
}