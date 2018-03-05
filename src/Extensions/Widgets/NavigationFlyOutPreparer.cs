using System;
using System.Collections.Generic;
using System.Linq;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework;
using Insite.WebFramework.Content;

namespace Extensions.Widgets
{
    public class NavigationFlyOutPreparer : GenericPreparer<NavigationFlyOut>
    {
        public NavigationFlyOutPreparer(ITranslationLocalizer translationLocalizer)
          : base(translationLocalizer)
        {
        }

        public override void Prepare(NavigationFlyOut contentItem)
        {
            NavigationListDrop viewModel = this.CreateViewModel();
            this.PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;

            if (contentItem.LinkRootPage)
            {
                contentItem.RootPageUrl = viewModel.RootPage.CanonicalUrl;
            }
        }

        protected virtual NavigationListDrop CreateViewModel()
        {
            return new NavigationListDrop();
        }

        protected virtual void PopulateViewModel(NavigationListDrop model, NavigationList navigationList)
        {
            model.RootPage = PageContext.Current.ContentHelper.GetPage<AbstractPage>(navigationList.RootPageName, false).Page;
            NavigationListDrop navigationListDrop1 = model;
            AbstractPage rootPage = navigationListDrop1.RootPage;
            string str = rootPage != null ? rootPage.Title : (string)null;
            navigationListDrop1.RootPageTitle = str;
            NavigationListDrop navigationListDrop2 = model;
            int num = navigationListDrop2.RootPage != null ? 1 : 0;
            navigationListDrop2.RootPageExists = num != 0;
            NavigationListDrop navigationListDrop3 = model;
            IList<ChildPageDrop> childPageDropList = !navigationListDrop3.RootPageExists ? (IList<ChildPageDrop>)new List<ChildPageDrop>() : this.GetChildPages(model.RootPage, false);
            navigationListDrop3.ChildPages = childPageDropList;
        }

        private IList<ChildPageDrop> GetChildPages(AbstractPage abstractPage, bool isNestedLevel = false)
        {
            if (isNestedLevel && !PageContext.Current.PageExistsInCurrentPath(abstractPage))
                return (IList<ChildPageDrop>)null;
            return (IList<ChildPageDrop>)PageContext.Current.ContentHelper.GetChildPagesForVariantKey<AbstractPage>(abstractPage.VariantKey.Value, true).Where<AbstractPage>((Func<AbstractPage, bool>)(o =>
            {
                if (!o.ExcludeFromNavigation)
                    return !(o is AbstractNavigationPage);
                return false;
            })).Select<AbstractPage, ChildPageDrop>((Func<AbstractPage, ChildPageDrop>)(o => new ChildPageDrop() { Title = o.Title, Url = PageContext.Current.GenerateUrl(o), CssClass = o.ContentKey == PageContext.Current.Page.ContentKey ? "active" : string.Empty, ChildPages = isNestedLevel ? (IList<ChildPageDrop>)null : this.GetChildPages(o, true) })).ToList<ChildPageDrop>();
        }
    }
}
