using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        protected async Task<ActionResult> SaveContextChanges(string errorMsg, ActionResult objectResult)
        {
            bool result = await this.context.SaveChangesAsync() > 0;

            if (result)
                return objectResult;
            else
                return BadRequest(new ProblemDetails { Title = errorMsg });
        }

        protected async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)){
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await this.context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }

    }
}