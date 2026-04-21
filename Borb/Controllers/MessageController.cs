using Microsoft.AspNetCore.Mvc;
using src.Models;
using src.Services;

[ApiController]
[Route("api/messages")]
public class MessageController: ControllerBase
{
    private readonly MessageService _messageService;

    public MessageController(MessageService messageService)
    {
        _messageService = messageService;
    }
    [HttpGet("{topicId}")]
    public async Task<IActionResult> GetMessages(string topicId)
    {
        var messages = await _messageService.GetByTopicId(topicId);
        return Ok(messages);
    }
    [HttpPost]
    public async Task<IActionResult> CreateMessage([FromBody] Message message)
    {
        var userId = "Amber";
        message.CreatedBy = userId;
        message.CreatedAt = DateTime.UtcNow;

        await _messageService.Create(message);
        return Ok(message);
    }
}