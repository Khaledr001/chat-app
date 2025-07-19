using ChatApp.Server.API.DTOs;
using ChatApp.Server.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterDto>> RegisterAsync([FromBody] RegisterDto registerDto)
        {
            var newUser = await _authRepository.RegisterAsync(registerDto);
            
            if (newUser == null)
            {
                return BadRequest("User registration failed.");
            }

            return Ok(newUser);
        }
        
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDto>> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var loginResponse = await _authRepository.LoginAsync(loginDto);
                return Ok(loginResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}