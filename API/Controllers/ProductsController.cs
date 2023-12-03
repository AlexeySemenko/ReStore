using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.DTO;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IMapper mapper;
        private ImageService ImageService;
        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService) : base(context)
        {
            this.ImageService = imageService;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query = context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchTerm)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            var products = await PagedList<Product>.ToPagedList(query, productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaDataPages);

            return products;
        }

        [HttpGet("{id}")] //api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

            if(product == null) 
                return NotFound();

            return product;
        }

        [HttpGet("filters")] //api/products/3
        public async Task<IActionResult> GetFilters()
        {
            var brands = await context.Products.Select(i => i.Brand).Distinct().ToListAsync();
            var types = await context.Products.Select(i => i.Type).Distinct().ToListAsync();

            return Ok(new {brands, types});
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct([FromForm]CreateProductDTO productDto)
        {
            var product = mapper.Map<Product>(productDto);

            //add image to cloudinary
            if(productDto.File != null)
            {
                var imageResult = await ImageService.AddImageAsync(productDto.File);

                if(imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails{Title = imageResult.Error.Message});
                }

                product.PictureUrl = imageResult.SecureUrl.ToString(); //https url
                product.PublicId = imageResult.PublicId;
            }

            context.Products.Add(product);

            return await SaveContextChanges("Error adding product", new CreatedAtRouteResult("GetProduct", new {Id = product.Id, product}));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDTO productDto)
        {
            var product = await context.Products.FindAsync(productDto.Id);

            if(product == null)
                return NotFound();

            mapper.Map(productDto, product); ///EF will track changes in DTO and update actual product

            if(productDto.File != null)
            {
                var imageResult = await ImageService.AddImageAsync(productDto.File);

                if(imageResult.Error != null)
                {
                    return BadRequest(new ProblemDetails{Title = imageResult.Error.Message});
                }

                if(!string.IsNullOrEmpty(product.PublicId))
                    await ImageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.ToString(); //https url
                product.PublicId = imageResult.PublicId;

            }

            return await SaveContextChanges("Error updating product", Ok(product));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await context.Products.FindAsync(id);

             if(product == null)
                return NotFound();

            if(!string.IsNullOrEmpty(product.PublicId))
                await ImageService.DeleteImageAsync(product.PublicId); //log if have an error..

            context.Products.Remove(product);

            return await SaveContextChanges("Error deleting product", new OkResult());
        }
    }
}