using ChatApp.Server.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Server.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public AuthController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }


    }
}