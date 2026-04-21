using Microsoft.AspNetCore.Mvc;
using src.Services;
using src.Models;


namespace src.Controllers;

[ApiController]
[Route("api/subscriptions")]
public class SubscriptionsController: ControllerBase
{
    private readonly SubscriptionService _service;
    public SubscriptionsController(SubscriptionService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Subscribe([FromBody] SubscriptionRequest request)
    {
        try
        {
            var sub = await _service.Subscribe(request.UserId, request.TopicId);
            return Ok(sub);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [HttpDelete]
    public async Task<IActionResult> Unsubscribe([FromBody] SubscriptionRequest request)
    {
        await _service.Unsubscribe(request.UserId, request.TopicId);
        return Ok();
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserSubscriptions(string userId)
    {
        var subs = await _service.GetUserSubscriptions(userId);
        return Ok(subs);
    }
}