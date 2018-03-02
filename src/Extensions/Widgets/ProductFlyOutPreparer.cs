using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Extensions.Widgets.Models;
using Insite.ContentLibrary.Providers;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;
using Insite.WebFramework.Mvc;

namespace Extensions.Widgets
{
    public class ProductFlyOutPreparer : GenericPreparer<ProductFlyOut>
    {
        protected readonly ICatalogLinkProvider CatalogLinkProvider;
        protected int CatId;
        protected int GrandCatId = 1000;


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

            var allProducts = contentItem.CategoryFilter.Equals("All Categories", StringComparison.CurrentCultureIgnoreCase);
            var byAreaOnly = contentItem.CategoryFilter.Equals("By-Area Categories Only", StringComparison.CurrentCultureIgnoreCase);
            var noByArea = contentItem.CategoryFilter.Equals("No By-Area Categories", StringComparison.CurrentCultureIgnoreCase);

            foreach (var categoryMenuLink in categoryMenuLinks)
            {
                if (allProducts)
                {
                    childPageDropList.Add(CreateChildPageDrop(categoryMenuLink));
                }
                else
                {
                    bool isByArea;
                    var isByAreaString = categoryMenuLink.Category.CustomProperties.FirstOrDefault(x => x.Name.Equals("IsAreaCat", StringComparison.CurrentCulture))?.Value;
                    bool.TryParse(isByAreaString, out isByArea);

                    if (byAreaOnly)
                    {
                        navigationListDrop1.RootPageTitle = "By Area";
                        if (isByArea)
                        {
                            childPageDropList.Add(CreateChildPageDrop(categoryMenuLink));
                        }
                    }
                    else if (noByArea)
                    {
                        if (!isByArea)
                        {
                            childPageDropList.Add(CreateChildPageDrop(categoryMenuLink));
                        }
                    }
                }
            }

            navigationListDrop4.ChildPages = childPageDropList;
        }

        protected virtual NbfChildPageDrop CreateChildPageDrop(NavLinkDto navLink)
        {
            //Add Navigation Content for the first children only
            NbfChildPageDrop child = new NbfChildPageDrop()
            {
                Title = navLink.LinkText,
                Url = navLink.Url,
                Id = navLink.CategoryId,
                CatNum = CatId,
                NavigationContent = navLink.Category.CustomProperties.FirstOrDefault(x => x.Name.Equals("NavigationFlyOutContent", StringComparison.CurrentCultureIgnoreCase))?.Value
            };

            //Add child elements
            if (navLink.NavLinks != null && navLink.NavLinks.Count > 0)
            {
                child.NbfChildPages = new List<NbfChildPageDrop>();
                foreach (var childPage in navLink.NavLinks)
                {
                    child.NbfChildPages.Add(new NbfChildPageDrop()
                    {
                        Title = childPage.LinkText,
                        Url = childPage.Url,
                        CatNum = GrandCatId,
                        Id = childPage.CategoryId
                    });
                    GrandCatId++;
                }
                //Add other stuff
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "On sale",
                    Url = child.Url + "?attr=onsale",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "Ships Today",
                    Url = child.Url + "?attr=shipstoday",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "Top Rated",
                    Url = child.Url + "?attr=toprated",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "New Products",
                    Url = child.Url + "?attr=newproducts",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "Best Selling",
                    Url = child.Url + "?attr=bestselling",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "Clearance",
                    Url = child.Url + "?attr=clearance",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
                child.NbfChildPages.Add(new NbfChildPageDrop()
                {
                    Title = "GSA",
                    Url = child.Url + "?attr=gsa",
                    CatNum = GrandCatId,
                    Id = new Guid()
                });
                GrandCatId++;
            }

            CatId++;
            return child;
        }
    }
}
