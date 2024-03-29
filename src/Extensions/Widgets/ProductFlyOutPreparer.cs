﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using Extensions.Widgets.Models;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Providers;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using Insite.WebFramework.Mvc;
using Microsoft.Ajax.Utilities;

namespace Extensions.Widgets
{
    public class ProductFlyOutPreparer : GenericPreparer<ProductFlyOut>
    {
        protected readonly ICatalogLinkProvider CatalogLinkProvider;
        protected readonly IContentHelper ContentHelper;
        protected int CatId;
        protected int GrandCatId = 1000;


        public ProductFlyOutPreparer(ITranslationLocalizer translationLocalizer, ICatalogLinkProvider catalogLinkProvider, IContentHelper contentHelper)
            : base(translationLocalizer)
        {
            CatalogLinkProvider = catalogLinkProvider;
            ContentHelper = contentHelper;
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

            var allProducts = contentItem.CategoryFilter.Equals("All Categories", StringComparison.CurrentCultureIgnoreCase);
            var byAreaOnly = contentItem.CategoryFilter.Equals("By-Area Categories Only", StringComparison.CurrentCultureIgnoreCase);
            var noByArea = contentItem.CategoryFilter.Equals("No By-Area Categories", StringComparison.CurrentCultureIgnoreCase);

            model.RootPageTitle = byAreaOnly ? "By Area" : "Products";
            model.RootPageExists = true;
            model.ChildPages = categoryMenuLinks.Where(n => n.Properties["IsByArea"] == (byAreaOnly ? "true" : "false")).Select(CreateChildPageDrop).ToList();

            if (!contentItem.LandingPageName.IsNullOrWhiteSpace())
            {
                contentItem.LandingPageUrl = ContentHelper.GetPage<ContentPage>(contentItem.LandingPageName).Page.Url;
            }
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
                //NavigationContent = navLink.Category.CustomProperties.FirstOrDefault(x => x.Name.Equals("NavigationFlyOutContent", StringComparison.CurrentCultureIgnoreCase))?.Value
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
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "On sale",
                //    Url = child.Url + "?attr=onsale",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                //GrandCatId++;
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "Ships Today",
                //    Url = child.Url + "?attr=shipstoday",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                //GrandCatId++;
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "Top Rated",
                //    Url = child.Url + "?attr=toprated",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                //GrandCatId++;
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "New Products",
                //    Url = child.Url + "?attr=newproducts",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                //GrandCatId++;
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "Best Selling",
                //    Url = child.Url + "?attr=bestselling",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                //GrandCatId++;
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "Clearance",
                //    Url = child.Url + "?attr=clearance",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                //GrandCatId++;
                //child.NbfChildPages.Add(new NbfChildPageDrop()
                //{
                //    Title = "GSA",
                //    Url = child.Url + "?attr=gsa",
                //    CatNum = GrandCatId,
                //    Id = new Guid()
                //});
                GrandCatId++;
            }

            CatId++;
            return child;
        }
    }
}
