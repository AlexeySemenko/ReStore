using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        IConfiguration config;
        public PaymentService(IConfiguration config)
        {
            this.config = config;
        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

            var service = new PaymentIntentService();
            var intent = new PaymentIntent();
            var subtotal = basket.Items.Sum(i => i.Quantity * i.Product.Price);
            var deliveryFee = subtotal > 10000 ? 0 : 500;

            if(string.IsNullOrEmpty(basket.PaymentIntentId))
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,  //this is long with 500.00 looks like - (50000), in Stripe the same as in our app
                    Currency = "usd",
                    PaymentMethodTypes = new List<string>{"card"}
                };

                intent = await service.CreateAsync(options);
                
            }
            else
            {
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = subtotal + deliveryFee
                };

                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            return intent;
        }
    }
}