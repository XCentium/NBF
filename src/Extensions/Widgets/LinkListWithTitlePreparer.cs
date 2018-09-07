using System;
using System.Collections.Generic;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Context;
using Insite.Core.Exceptions;
using Insite.Core.Interfaces.Localization;
using Insite.Core.SystemSetting.Groups.SystemSettings;
using Insite.Core.WebApi.Interfaces;
using Insite.WebFramework;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using Microsoft.Ajax.Utilities;

namespace Extensions.Widgets
{
    public class LinkListWithTitlePreparer : GenericPreparer<LinkListWithTitle>
    {
        protected readonly IContentHelper ContentHelper;
        protected int CatId;
        protected int GrandCatId = 1000;

        public LinkListWithTitlePreparer(ITranslationLocalizer translationLocalizer, SecuritySettings securitySettings, IUrlHelper urlHelper, IContentHelper contentHelper)
            : base(translationLocalizer, securitySettings, urlHelper)
        {
            ContentHelper = contentHelper;
        }

        public override void Prepare(LinkListWithTitle contentItem)
        {
            LinkListDrop viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;

            if (!contentItem.LandingPageName.IsNullOrWhiteSpace())
            {
                contentItem.LandingPageUrl = ContentHelper.GetPage<ContentPage>(contentItem.LandingPageName).Page.Url;
            }
        }
        protected virtual LinkListDrop CreateViewModel()
        {
            return new LinkListDrop();
        }

        protected virtual void PopulateViewModel(LinkListDrop model, LinkList linkList)
        {
            List<PageLinkDrop> pageLinkDropList = new List<PageLinkDrop>();
            foreach (int page in linkList.Pages)
            {
                GetPageResult<AbstractPage> getPageResult = null;

                try
                {
                    getPageResult = PageContext.Current.ContentHelper.GetPageByVariantKey(page);
                }
                catch (ContentVariantNotFoundException)
                {
                    // in case page was removed
                }

                if (getPageResult?.Page != null && !getPageResult.Page.IsRetracted && getPageResult.DisplayLink && (!getPageResult.Page.Class.EqualsIgnoreCase("QuickOrderPage") || IsQuickOrderAllowed()))
                    pageLinkDropList.Add(new PageLinkDrop()
                    {
                        Url = PageContext.Current.GenerateUrl(getPageResult.Page),
                        PageTitle = getPageResult.Page.Title
                    });
            }

            model.PageLinks = pageLinkDropList;
        }

        protected virtual bool IsQuickOrderAllowed()
        {
            if (SiteContext.Current.UserProfileDto != null)
                return true;
            if (SecuritySettings.StorefrontAccess != StorefrontAccess.SignInRequiredToBrowse && SecuritySettings.StorefrontAccess != StorefrontAccess.SignInRequiredToAddToCart)
                return SecuritySettings.StorefrontAccess != StorefrontAccess.SignInRequiredToAddToCartOrSeePrices;
            return false;
        }
    }
}
