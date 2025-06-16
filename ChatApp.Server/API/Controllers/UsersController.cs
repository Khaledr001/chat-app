using ChatApp.Server.Application.DTOs;
using ChatApp.Server.Domain.Models;
using ChatApp.Server.Domain.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            var userDtos = users.Select(MapToDto);
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(MapToDto(user));
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(CreateUserDto createUserDto)
        {
            // Validate the request
            if (createUserDto.Password != createUserDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match");
            }

            // Check if username already exists
            var existingUserByUsername = await _userService.GetUserByUsernameAsync(createUserDto.Username);
            if (existingUserByUsername != null)
            {
                return Conflict("Username already exists");
            }

            // Check if email already exists
            var existingUserByEmail = await _userService.GetUserByEmailAsync(createUserDto.Email);
            if (existingUserByEmail != null)
            {
                return Conflict("Email already exists");
            }

            // Create the user
            var user = new User
            {
                Username = createUserDto.Username,
                Email = createUserDto.Email
            };

            var createdUser = await _userService.CreateUserAsync(user, createUserDto.Password);
            return CreatedAtAction(nameof(GetUser), new { id = createdUser.Id }, MapToDto(createdUser));
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginUserDto loginUserDto)
        {
            var isValid = await _userService.ValidateUserCredentialsAsync(
                loginUserDto.UsernameOrEmail, loginUserDto.Password);

            if (!isValid)
            {
                return Unauthorized("Invalid username/email or password");
            }

            // In a real application, you would generate and return a JWT token here
            return Ok(new { message = "Login successful" });
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> UpdateUser(Guid id, UpdateUserDto updateUserDto)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Update user properties
            user.Username = updateUserDto.Username;
            user.Email = updateUserDto.Email;
            user.IsActive = updateUserDto.IsActive;

            var updatedUser = await _userService.UpdateUserAsync(user);
            return Ok(MapToDto(updatedUser));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userService.DeleteUserAsync(id);
            if (!result)
            {
                return BadRequest("Failed to delete user");
            }

            return NoContent();
        }

        #region Helper Methods

        private static UserDto MapToDto(User user)
        {
            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                IsActive = user.IsActive
            };
        }

        #endregion
    }
}