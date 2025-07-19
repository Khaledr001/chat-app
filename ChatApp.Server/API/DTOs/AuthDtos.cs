using ChatApp.Server.Core.Entities;

namespace ChatApp.Server.API.DTOs;

public class RegisterDto
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class LoginDto
{
    public string? Id { get; set; }
    public string? Email { get; set; }
    public required string Password { get; set; }
}

public class LoginResponseDto: UserDto
{
    public string? Token { get; set; }
}
