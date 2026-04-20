using Microsoft.AspNetCore.Mvc;
using src.Models;

[ApiController]
[Route("api/topics")]
public class TopicController : ControllerBase
{
    private readonly TopicService _topicService;
    public TopicController(TopicService topicService)
    {
        _topicService = topicService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(string title, string userId)
    {
        var topic = await _topicService.CreateTopic(title, userId);
        return Ok(topic);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var topics = await _topicService.GetAllTopics();
        return Ok(topics);
    }
}