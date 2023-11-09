using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController : BaseApiController
    {
        private readonly StoreContext context;
        public BasketController(StoreContext context)
        {
            this.context = context;
            
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await GetBusketStore();

            if (basket == null)
                return NotFound();

            return MapBasketToDto(basket);
        }

       


        [HttpPost]
        public async Task<IActionResult> AddItemToBasket(int productId, int quantity)
        {
            //get basket or create basket
            Basket basket = await GetBusketStore();
            if (basket == null)
            {
                basket = CreateBasket();
            }

            //get product
            Product product = await this.context.Products.FindAsync(productId);
            if (product == null)
            {
                return NotFound();
            }

            //add item
            basket.AddItem(product, quantity);

            //save changes
            IActionResult actResult = CreatedAtRoute("GetBasket", MapBasketToDto(basket));
            return await SaveContextChanges("Problem adding item to basket", actResult);
        }

        


        [HttpDelete]
        public async Task<IActionResult> RemoveBasketItem(int productId, int quantity)
        {
            //get basket
            Basket basket = await GetBusketStore();
            if(basket == null)
            {
                return NotFound();
            }

            //remove item or quantity
            basket.RemoveItem(productId, quantity);

            //save changes
            return await SaveContextChanges("Problem removing item from basket", Ok());
        }


        private async Task<Basket> GetBusketStore()
        {
            return await this.context.Baskets
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket()
        {
            string buyerId = Guid.NewGuid().ToString();
            CookieOptions cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};

            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            Basket basket = new Basket{BuyerId = buyerId};
            context.Baskets.Add(basket);

            return basket;
        }

        private async Task<IActionResult> SaveContextChanges(string errorMsg, IActionResult objectResult)
        {
            bool result = await this.context.SaveChangesAsync() > 0;

            if (result)
                return objectResult;
            else
                return BadRequest(new ProblemDetails { Title = errorMsg });
        }

        private static ActionResult<BasketDto> MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(bi => new BasketItemDto
                {
                    Brand = bi.Product.Brand,
                    PictureUrl = bi.Product.PictureUrl,
                    Name = bi.Product.Name,
                    Price = bi.Product.Price,
                    ProductId = bi.Product.Id,
                    Quantity = bi.Quantity,
                    Type = bi.Product.Type,
                }).ToList()
            };
        }
    }
}