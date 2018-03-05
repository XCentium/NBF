using System;
using System.Collections.Generic;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Context;
using Insite.Core.Interfaces.Localization;
using Insite.Core.SystemSetting.Groups.SystemSettings;
using Insite.WebFramework;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using Microsoft.Ajax.Utilities;

namespace Extensions.Widgets
{
    public class LinkListWithTitlePreparer : GenericPreparer<LinkListWithTitle>
    {
        protected readonly IContentHelper ContentHelper;
        protected readonly SecuritySettings SecuritySettings;
        protected int CatId;
        protected int GrandCatId = 1000;

        public LinkListWithTitlePreparer(SecuritySettings securitySettings, ITranslationLocalizer translationLocalizer, IContentHelper contentHelper)
            : base(translationLocalizer)
        {
            ContentHelper = contentHelper;
            SecuritySettings = securitySettings;
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
                GetPageResult<AbstractPage> pageByVariantKey = PageContext.Current.ContentHelper.GetPageByVariantKey(page);
                if (pageByVariantKey.Page != null && !pageByVariantKey.Page.IsRetracted && pageByVariantKey.DisplayLink && (!pageByVariantKey.Page.Class.EqualsIgnoreCase("QuickOrderPage") || IsQuickOrderAllowed()))
                    pageLinkDropList.Add(new PageLinkDrop()
                    {
                        Url = PageContext.Current.GenerateUrl(pageByVariantKey.Page),
                        PageTitle = pageByVariantKey.Page.Title
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
