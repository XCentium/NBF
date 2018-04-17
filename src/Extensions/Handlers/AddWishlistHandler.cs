using System;
using System.Linq;
using System.Linq.Expressions;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Data.Entities;
using Insite.WishLists.Services.Parameters;
using Insite.WishLists.SystemSettings;

namespace Extensions.Handlers
{
  [DependencyName("AddWishListHandler")]
  public override AddWishListHandler : HandlerBase<AddWishListParameter, WishListResult>
  {
    internal const string DefaultName = "My Wishlist";
    protected readonly ITranslationLocalizer TranslationLocalizer;
    protected readonly IWishListHandlerMapper WishListHandlerMapper;
    protected readonly WishlistsSettings WishlistsSettings;
    

    public override int Order => 500;

      protected virtual string DefaultWishListName => "Favorites";

      public AddWishListHandlerNbf(ITranslationLocalizer translationLocalizer, IWishListHandlerMapper wishListHandlerMapper, WishlistsSettings wishlistsSettings)
    {
      TranslationLocalizer = translationLocalizer;
      WishListHandlerMapper = wishListHandlerMapper;
      WishlistsSettings = wishlistsSettings;
    }

    public override WishListResult Execute(IUnitOfWork unitOfWork, AddWishListParameter parameter, WishListResult result)
    {
      UserProfile userProfile = SiteContext.Current.UserProfile ?? SiteContext.Current.RememberedUserProfile;
      if (userProfile == null)
        return CreateErrorServiceResult<WishListResult>(result, SubCode.Forbidden, MessageProvider.Current.Forbidden);
      bool allowMultiple = WishlistsSettings.AllowMultiple;
      bool byCustomer = WishlistsSettings.ByCustomer;
      if (allowMultiple && parameter.Name.IsBlank())
        return CreateErrorServiceResult<WishListResult>(result, SubCode.WishListServiceNameRequired, string.Format(MessageProvider.Current.Wishlist_Name_Required, (object) "Wishlist"));
      if (!allowMultiple && !parameter.Name.IsBlank() && !parameter.Name.Equals(DefaultWishListName, StringComparison.OrdinalIgnoreCase))
        return CreateErrorServiceResult<WishListResult>(result, SubCode.WishListServiceMultipleNotAllowed, string.Format(MessageProvider.Current.Multiple_Not_Allowed, (object) "Wishlists"));
      if (!allowMultiple && parameter.Name.IsBlank())
        parameter.Name = "My Wishlist";
      IRepository<WishList> repository = unitOfWork.GetRepository<WishList>();
      IQueryable<WishList> table = repository.GetTable();
      WishList wishList;
      if (byCustomer)
      {
        wishList = table.FirstOrDefault<WishList>((Expression<Func<WishList, bool>>) (w => w.Customer.Id == SiteContext.Current.BillTo.Id && w.Name == parameter.Name));
        if (wishList == null)
        {
          wishList = repository.Create();
          wishList.CustomerId = new Guid?(SiteContext.Current.BillTo.Id);
          wishList.Name = parameter.Name;
          repository.Insert(wishList);
        }
      }
      else
      {
        wishList = table.FirstOrDefault<WishList>((Expression<Func<WishList, bool>>) (w => w.UserProfile.Id == userProfile.Id && w.Name == parameter.Name));
        if (wishList == null)
        {
          wishList = repository.Create();
          wishList.UserProfileId = new Guid?(userProfile.Id);
          wishList.Name = parameter.Name;
          repository.Insert(wishList);
        }
      }
      return NextHandler.Execute(unitOfWork, parameter, WishListHandlerMapper.MapWishListResult(wishList, result));
    }
  }
}
