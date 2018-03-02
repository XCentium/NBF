using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Providers;
using Insite.Core.Interfaces.Localization;
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


        public LinkListWithTitlePreparer(ITranslationLocalizer translationLocalizer, IContentHelper contentHelper)
            : base(translationLocalizer)
        {
            ContentHelper = contentHelper;
        }

        public override void Prepare(LinkListWithTitle contentItem)
        {
            if (!contentItem.LandingPageName.IsNullOrWhiteSpace())
            {
                contentItem.LandingPageUrl = ContentHelper.GetPage<ContentPage>(contentItem.LandingPageName).Page.Url;
            }
        }
    }
}
