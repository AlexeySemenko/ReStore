using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        public OrdersController(StoreContext context) : base(context)
        {
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders()
        {
            return await context.Orders
                            .ProjectOrderToOrderDto()
                            .Where(x => x.BuyerId == User.Identity.Name).ToListAsync();
        } 

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            return await context.Orders.ProjectOrderToOrderDto().FirstOrDefaultAsync(o => o.Id == id && o.BuyerId == User.Identity.Name);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO orderDTO)
        {
            Basket basket = await RetrieveBasket(User.Identity.Name);

            if(basket == null)
                return BadRequest(new ProblemDetails{Title = "Could not locate basket"});

            List<OrderItem> items = new List<OrderItem>();

            foreach(BasketItem basketItem in basket.Items)
            {
                Product productItem = await context.Products.FindAsync(basketItem.ProductId);
                ProductItemOrdered itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                OrderItem orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = basketItem.Quantity
                };

                items.Add(orderItem);
                productItem.QuantityInStock -= basketItem.Quantity;
            }

            var subtotal = items.Sum(i =>i.Price * i.Quantity);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            var order = new Order
            {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDTO.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee
            };

            context.Orders.Add(order);
            context.Baskets.Remove(basket);

            if(orderDTO.SaveAddress)
            {
                User user = await context.Users.FirstOrDefaultAsync(u => u.UserName == User.Identity.Name);

                if(user!= null)
                {
                    user.Address = new UserAddress
                    {
                        FullName = orderDTO.ShippingAddress.FullName,
                        Address1 = orderDTO.ShippingAddress.Address1,
                        Address2 = orderDTO.ShippingAddress.Address2,
                        City = orderDTO.ShippingAddress.City,
                        Country = orderDTO.ShippingAddress.Country,
                        State = orderDTO.ShippingAddress.State,
                        Zip = orderDTO.ShippingAddress.Zip
                    };

                    context.Update(user);
                }
            }

            //save changes
            await SaveContextChanges("Problem creating order", Ok());

            return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);

        }
    }
}