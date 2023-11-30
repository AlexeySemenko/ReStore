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

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly PaymentService paymentService;
        public PaymentsController(StoreContext context, PaymentService paymentService) : base(context)
        {
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
    }
}