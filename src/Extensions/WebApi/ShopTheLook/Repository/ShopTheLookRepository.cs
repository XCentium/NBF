using System;
using System.Collections.Generic;
using System.Linq;
using Extensions.Models.ShopTheLook;
using Extensions.WebApi.Base;
using Extensions.WebApi.ShopTheLook.Interfaces;
using Extensions.WebApi.ShopTheLook.Models;
using Insite.Catalog.Services;
using Insite.Catalog.Services.Parameters;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Plugins.Security;
using Insite.Customers.Services;

namespace Extensions.WebApi.ShopTheLook.Repository
{
    public class ShopTheLookRepository : BaseRepository, IShopTheLookRepository, IInterceptable
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProductService _productService;

        public ShopTheLookRepository(IUnitOfWorkFactory unitOfWorkFactory, ICustomerService customerService, IProductService productService, IAuthenticationService authenticationService)
            : base(unitOfWorkFactory, customerService, productService, authenticationService)
        {
            _unitOfWork = unitOfWorkFactory.GetUnitOfWork();
            _productService = productService;
        }

        public ShopTheLookDto GetLook(string id)
        {
            var look = _unitOfWork.GetRepository<StlRoomLook>().GetTable()
                .FirstOrDefault(x => x.Id.ToString().Equals(id));

            if (look != null)
            {
                var dto = new ShopTheLookDto
                {
                    SortOrder = look.SortOrder,
                    Description = look.Description,
                    Id = look.Id,
                    MainImage = look.MainImage,
                    Status = look.Status,
                    Title = look.Title,
                    ProductHotSpots = new List<ShopTheLookHotSpotDto>()
                };

                var lookProducts = _unitOfWork.GetRepository<StlRoomLooksProduct>().GetTable()
                    .Where(x => x.StlRoomLookId.ToString().Equals(id)).OrderBy(x => x.AdditionalProduct)
                    .ThenBy(x => x.SortOrder).ThenBy(x => x.AdditionalProductSort).ToList();
                foreach (var prod in lookProducts)
                {
                    var param = new GetProductParameter()
                    {
                        ProductId = prod.ProductId
                    };
                    var product = _productService.GetProduct(param);

                    var hotSpot = new ShopTheLookHotSpotDto
                    {
                        Product = product.ProductDto,
                        HotSpotPosition = "left:" + prod.XPosition + "%;top:" + prod.YPosition + "%;"
                    };

                    if (prod.AdditionalProduct)
                    {
                        if (prod.AdditionalProductSort > 0 && prod.AdditionalProductSort <= 4)
                        {
                            hotSpot.IsFeatured = false;
                            hotSpot.IsAccessory = true;
                        }
                        else
                        {
                            hotSpot.IsFeatured = true;
                            hotSpot.IsAccessory = false;
                        }
                    }
                    else
                    {
                        hotSpot.IsFeatured = false;
                        hotSpot.IsAccessory = false;
                    }

                    dto.ProductHotSpots.Add(hotSpot);
                }

                return dto;
            }

            return null;
        }

        public ShopTheLookCollectionDto GetLookCollection()
        {
            var collection = new ShopTheLookCollectionDto()
            {
                Categories = GetCategories(),
                Styles = GetStyles(),
                Looks = _unitOfWork.GetRepository<StlRoomLook>().GetTable().ToList()
            };

            return collection;
        }

        private List<ShopTheLookCategoryDto> GetCategories()
        {
            var rooms = _unitOfWork.GetRepository<StlRoomLooksCategory>().GetTable().ToList();

            var categories = new List<ShopTheLookCategoryDto>();
            foreach (var room in rooms)
            {
                var cat = categories.FirstOrDefault(x => x.Id.Equals(room.StlCategoryId));
                if (cat != null)
                {
                    cat.LookIds.Add(room.StlRoomLookId);
                }
                else
                {
                    categories.Add(new ShopTheLookCategoryDto()
                    {
                        Id = room.StlCategory.Id,
                        Description = room.StlCategory.Description,
                        LookIds = new List<Guid>() { room.StlRoomLookId },
                        MainImage = room.StlCategory.MainImage,
                        Name = room.StlCategory.Name,
                        SortOrder = room.StlCategory.SortOrder,
                        Status = room.StlCategory.Status
                    });
                }
            }

            return categories;
        }

        private List<ShopTheLookStyleDto> GetStyles()
        {
            var rooms = _unitOfWork.GetRepository<StlRoomLooksStyle>().GetTable().ToList();

            var styles = new List<ShopTheLookStyleDto>();
            foreach (var room in rooms)
            {
                var style = styles.FirstOrDefault(x => x.Id.Equals(room.Id));
                if (style != null)
                {
                    style.LookIds.Add(room.StlRoomLookId);
                }
                else
                {
                    styles.Add(new ShopTheLookStyleDto()
                    {
                        Id = room.Id,
                        LookIds = new List<Guid>() { room.StlRoomLookId },
                        StyleName = room.StyleName,
                        SortOrder = room.SortOrder
                    });
                }
            }

            return styles;
        }
    }
}