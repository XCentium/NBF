using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Extensions.Widgets.Models;
using Insite.ContentLibrary.Providers;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;
using Insite.WebFramework.Mvc;

namespace Extensions.Widgets
{
    public class ProductFlyOutPreparer : GenericPreparer<ProductFlyOut>
    {
        protected readonly ICatalogLinkProvider CatalogLinkProvider;

        public ProductFlyOutPreparer(ITranslationLocalizer translationLocalizer, ICatalogLinkProvider catalogLinkProvider)
            : base(translationLocalizer)
        {
            CatalogLinkProvider = catalogLinkProvider;
        }

        public override void Prepare(ProductFlyOut contentItem)
        {
            ProductFlyOutDrop viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual ProductFlyOutDrop CreateViewModel()
        {
            return new ProductFlyOutDrop();
        }

        protected virtual void PopulateViewModel(ProductFlyOutDrop model, ProductFlyOut contentItem)
        {
            ReadOnlyCollection<NavLinkDto> categoryMenuLinks = CatalogLinkProvider.GetCategoryMenuLinks(new int?());
            ProductFlyOutDrop navigationListDrop1 = model;
            navigationListDrop1.RootPageTitle = "Products";
            ProductFlyOutDrop navigationListDrop2 = model;
            navigationListDrop2.RootPageExists = true;
            ProductFlyOutDrop navigationListDrop3 = model;
            navigationListDrop3.Id = model.Id;
            ProductFlyOutDrop navigationListDrop4 = model;
            IList<NbfChildPageDrop> childPageDropList = new List<NbfChildPageDrop>();

            var catId = 0;
            var grandCatId = 1000;
        
            foreach (var categoryMenuLink in categoryMenuLinks)
            {
                NbfChildPageDrop child = new NbfChildPageDrop()
                {
                    Title = categoryMenuLink.LinkText,
                    Url = categoryMenuLink.Url,
                    Id = categoryMenuLink.CategoryId,
                    CatNum = catId
                };

                //Add child elements
                if (categoryMenuLink.NavLinks != null && categoryMenuLink.NavLinks.Count > 0)
                {
                    child.NbfChildPages = new List<NbfChildPageDrop>();
                    foreach (var childPage in categoryMenuLink.NavLinks)
                    {
                        child.NbfChildPages.Add( new NbfChildPageDrop()
                        {
                            Title = childPage.LinkText,
                            Url = childPage.Url,
                            CatNum = grandCatId,
                            Id = childPage.CategoryId
                        });
                        grandCatId++;
                    }
                    //Add other stuff
                    child.NbfChildPages.Add( new NbfChildPageDrop()
                    {
                        Title = "On sale",
                        Url = "/Search?category=" + categoryMenuLink.Category.Name + "&something=OnSale",
                        CatNum = grandCatId,
                        Id = new Guid()
                    });
                    grandCatId++;
                }
                
                childPageDropList.Add(child);
                catId++;
            }

            navigationListDrop4.ChildPages = childPageDropList;
        }
    }
}
