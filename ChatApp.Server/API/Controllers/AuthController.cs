using ChatApp.Server.API.DTOs;
using ChatApp.Server.Core.Interfaces;
using ChatApp.Server.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace ChatApp.Server.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IHubContext<ChatHub> _chatHub;

        public AuthController(IAuthRepository authRepository, IHubContext<ChatHub> chatHub)
        {
            _authRepository = authRepository;
            _chatHub = chatHub;
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
                await _chatHub.Clients.All.SendAsync("UserLoggedIn", loginResponse.UserName);
                return Ok(loginResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}