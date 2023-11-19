using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        protected readonly StoreContext context;

        public BaseApiController(StoreContext context)
        {
            this.context = context;
        }

        protected async Task<IActionResult> SaveContextChanges(string errorMsg, IActionResult objectResult)
        {
            bool result = await this.context.SaveChangesAsync() > 0;

            if (result)
                return objectResult;
            else
                return BadRequest(new ProblemDetails { Title = errorMsg });
        }

    }
}