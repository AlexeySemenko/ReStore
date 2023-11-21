using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : BaseApiController
    {
        public BasketController(StoreContext context) : base(context)
        {
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrieveBasket();

            if (basket == null)
                return NotFound();

            return basket.MapBasketToDto();
        }

        [HttpPost]
        public async Task<IActionResult> AddItemToBasket(int productId, int quantity)
        {
            //get basket or create basket
            Basket basket = await RetrieveBasket();

            if (basket == null)
            {
                basket = CreateBasket();
            }

            //get product
            Product product = await this.context.Products.FindAsync(productId);
            if (product == null)
            {
                return BadRequest(new ProblemDetails{Title = "Product not found"});
            }

            //add item
            basket.AddItem(product, quantity);

            //save changes
            IActionResult actResult = CreatedAtRoute("GetBasket", basket.MapBasketToDto());
            return await SaveContextChanges("Problem adding item to basket", actResult);
        }

        


        [HttpDelete]
        public async Task<IActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //get basket
            Basket basket = await RetrieveBasket();
            if(basket == null)
            {
                return NotFound();
            }

            //remove item or quantity
            basket.RemoveItem(productId, quantity);

            //save changes
            return await SaveContextChanges("Problem removing item from basket", Ok());
        }


        private async Task<Basket> RetrieveBasket()
        {
            string buyerId = GetBuyerId();

            return await RetrieveBasket(buyerId);
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
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

        private string GetBuyerId()
        {
            return User.Identity.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            string buyerId = User.Identity.Name;
            
            if(string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                CookieOptions cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }

            Basket basket = new Basket{BuyerId = buyerId};
            context.Baskets.Add(basket);

            return basket;
        }
    }
}