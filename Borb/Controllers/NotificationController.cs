using Microsoft.AspNetCore.Mvc;
using src.Models;
using src.Services;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _service;
    public NotificationController(NotificationService service)
    {
        _service = service;
    }
    [HttpGet("{userId}")]
    public async Task<IActionResult> Get(string userId)
    {
        var result = await _service.GetByUser(userId);
        return Ok(result);
    }

}