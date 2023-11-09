using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity)
        {
            BasketItem existingItem = Items.FirstOrDefault(i => i.ProductId == product.Id);
            if(existingItem == null)
            {
                existingItem = new BasketItem{
                    Product = product,
                    Quantity = quantity
                };

                Items.Add(existingItem);
            }
            else
            {
                existingItem.Quantity +=quantity;
            }
        }

        public void RemoveItem(int productId, int quantity)
        {
            BasketItem item = Items.FirstOrDefault(i => i.ProductId == productId);
            if(item == null)
            {
                return;
            }

            item.Quantity -= quantity;

            if(item.Quantity <= 0)
            {
                Items.Remove(item);
            }
        }
    }
}