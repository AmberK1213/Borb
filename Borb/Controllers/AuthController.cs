using Microsoft.AspNetCore.Mvc;
using src.Models;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    public AuthController(UserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] User request)
    {
        try
        {
            var user = await _userService.Register(
                request.Username,
                request.Password
                );
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] User request)
    {
        var user = await _userService.Login(
            request.Username,
            request.Password
            );
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }
        return Ok(user);
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok("Auth controller works");
    }
}
