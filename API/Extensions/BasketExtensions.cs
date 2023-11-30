using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTO;
using API.Entities;

namespace API.Extensions
{
    public static class BasketExtensions
    {
        public static BasketDto MapBasketToDto(this Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId = basket.PaymentIntentId,
                ClientSecret = basket.ClientSecret,
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