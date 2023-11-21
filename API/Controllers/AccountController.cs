using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        UserManager<User> userManager;
        private readonly TokenService tokenService;

        public AccountController(UserManager<User> userManager, StoreContext context, TokenService tokenService) : base(context)
        {
            this.tokenService = tokenService;
            this.userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await this.userManager.FindByNameAsync(loginDto.Username);

            if(user == null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
                return Unauthorized();

            var userBasket = await RetrieveBasket(loginDto.Username);
            var anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);

            //if we have anon basket and no user basket - transfer anon basket to user basket
            if(anonBasket != null)
            {
                if(userBasket != null)
                {
                    context.Baskets.Remove(userBasket);
                   
                }

                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await context.SaveChangesAsync();
            }
            
            return new UserDto
            {
                Email = user.Email,
                Token = await tokenService.GenerateToken(user),
                Basket = (anonBasket != null ? anonBasket : userBasket)?.MapBasketToDto()
            };
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

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto)
        {
            var user = new User{ UserName = registerDto.Username, Email = registerDto.Email};

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded)
            {
                foreach(var error in result.Errors)
                {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();
            }

            await userManager.AddToRoleAsync(user, "Member");

            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await userManager.FindByNameAsync(User.Identity.Name);
            var userBasket = await RetrieveBasket(User.Identity.Name);

            return new UserDto
            {
                Email = user.Email,
                Token = await tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }
    }
}