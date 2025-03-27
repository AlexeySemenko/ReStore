using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public ImagesController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet]
    public IActionResult GetImages()
    {
        string assetsPath = Path.Combine(_env.WebRootPath + "\\images", "Slider");
        if (!Directory.Exists(assetsPath))
        {
            return NotFound(new { message = "Assets folder not found " +  assetsPath});
        }

        var images = Directory.GetFiles(assetsPath)
                              .Select(Path.GetFileName)
                              .Where(file => file.EndsWith(".jpg") || file.EndsWith(".png") || file.EndsWith(".jpeg"))
                              .ToList();

        return Ok(new { images });
    }
}
