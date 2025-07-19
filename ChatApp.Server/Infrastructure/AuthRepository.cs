using ChatApp.Server.API.DTOs;
using ChatApp.Server.Core.Interfaces;
using ChatApp.Server.Core.Entities;

namespace ChatApp.Server.Infrastructure
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IUserRepository _userRepository;
        
        public AuthRepository(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        
        public async Task<RegisterDto> RegisterAsync(RegisterDto registerDto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email);
            
            if (existingUser != null) 
            {
                throw new Exception("User with this email already exists.");
            }

            var newUser = new User
            {
                UserName = registerDto.UserName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
            };
            
            var createdUser = await _userRepository.CreateAsync(newUser);

            return new RegisterDto
            {
                UserName = createdUser.UserName,
                Email = createdUser.Email,
                Password = string.Empty // Don't send password back
            };
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = loginDto.Id != null 
                ? (int.TryParse(loginDto.Id, out int userId) 
                    ? await _userRepository.GetByIdAsync(userId)
                    : null)
                : await _userRepository.GetByEmailAsync(loginDto.Email!);
            
            if (user == null)
            {
                throw new Exception("Invalid email or password");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password");
            }

            // TODO: Generate JWT token here
            return new LoginResponseDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Token = "TODO: Generate JWT token" // This should be replaced with actual JWT token generation
            };
        }
    }
}