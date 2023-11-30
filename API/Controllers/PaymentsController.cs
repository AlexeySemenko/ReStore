using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService paymentService;
        private readonly IConfiguration config;
        public PaymentsController(StoreContext context, PaymentService paymentService, IConfiguration config) : base(context)
        {
            this.config = config;
            this.paymentService = paymentService;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            var basket = await RetrieveBasket(User.Identity.Name);

            if(basket == null) 
                return NotFound();

            var intent = await paymentService.CreateOrUpdatePaymentIntent(basket);

            if(intent == null)
                return BadRequest(new ProblemDetails{Title="Problem creating payment intent"});
            
            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            context.Update(basket);

            return await SaveContextChanges("Problem updating basket with intent", new OkObjectResult(basket.MapBasketToDto()));
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            var jsonResponse = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(jsonResponse, Request.Headers["Stripe-Signature"], 
                        config["StripeSettings:WhSecret"]);

            var charge = (Charge)stripeEvent.Data.Object;

            var order = await context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);

            if(charge.Status == "succeeded")
            {
                order.OrderStatus = Entities.OrderAggregate.OrderStatus.PaymentRecieved;
            }

            return await SaveContextChanges("Cannot update order status from webhook from stripe", new EmptyResult());

        }
    }
}