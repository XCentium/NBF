using System;
using System.Linq;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.WishLists.Services.Parameters;
using Insite.WishLists.Services.Results;
using Insite.WishLists.SystemSettings;

namespace Extensions.Handlers.AddWishListHandler
{
    [DependencyName(nameof(AddWishList))]
    public sealed class AddWishList : HandlerBase<AddWishListParameter, AddWishListResult>
    {
        internal const string DefaultName = "Favorites";

        private readonly WishlistsSettings _wishlistsSettings;

        public AddWishList(WishlistsSettings wishlistsSettings)
        {
            _wishlistsSettings = wishlistsSettings;
        }

        public override int Order => 600;

        public override AddWishListResult Execute(IUnitOfWork unitOfWork, AddWishListParameter parameter, AddWishListResult result)
        {
            var allowMultipleWishlists = _wishlistsSettings.AllowMultiple;
            if (!allowMultipleWishlists && parameter.Name.IsBlank())
            {
                parameter.Name = DefaultName;
            }

            var wishlistRepository = unitOfWork.GetRepository<WishList>();
            var wishListTable = wishlistRepository.GetTable().Where(o => o.ShareOption != "Static");

            var wishList = allowMultipleWishlists ? wishListTable.FirstOrDefault(o => o.UserProfile.Id == result.UserProfileDto.Id && o.Name == parameter.Name)
                : wishListTable.OrderByDescending(o => o.ModifiedOn).FirstOrDefault(o => o.UserProfile.Id == result.UserProfileDto.Id);

            if (wishList == null)
            {
                wishList = wishlistRepository.Create();
                wishList.UserProfileId = result.UserProfileDto.Id;
                wishList.Name = parameter.Name;
                wishList.Description = parameter.Description ?? string.Empty;
                wishList.ModifiedByUserProfileId = result.UserProfileDto.Id;
                wishlistRepository.Insert(wishList);
            }

            result.WishList = wishList;

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}