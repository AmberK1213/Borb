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
    public async Task<IActionResult> Create(CreateTopicRequest request)
    {
        var topic = await _topicService.CreateTopic(
            request.Title, 
            request.UserId
            );
        return Ok(topic);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var topic = await _topicService.GetTopicById(id);
        if (topic == null)
        {
            return NotFound();
        }
        return Ok(topic);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var topics = await _topicService.GetAllTopics();
        return Ok(topics);
    }
}