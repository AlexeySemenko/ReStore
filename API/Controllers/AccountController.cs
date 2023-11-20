using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

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
            
            return new UserDto
            {
                Email = user.Email,
                Token = await tokenService.GenerateToken(user)
            };
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

            return new UserDto
            {
                Email = user.Email,
                Token = await tokenService.GenerateToken(user)
            };
        }
    }
}