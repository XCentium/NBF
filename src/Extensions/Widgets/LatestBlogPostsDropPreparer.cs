using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Localization;
using Insite.Data.Entities;
using Insite.WebFramework;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.Widgets
{
    public class LatestBlogPostsDropPreparer : GenericPreparer<LatestBlogPosts>
    {
        protected readonly IContentHelper ContentHelper;
        protected readonly HttpContextBase HttpContext;
        protected readonly IUnitOfWork UnitOfWork;
        
        public LatestBlogPostsDropPreparer(IContentHelper contentHelper, HttpContextBase httpContext, ITranslationLocalizer translationLocalizer, IUnitOfWorkFactory unitOfWorkFactory)
          : base(translationLocalizer)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.ContentHelper = contentHelper;
            this.HttpContext = httpContext;
        }

        public override void Prepare(LatestBlogPosts contentItem)
        {
            LatestBlogPostsDrop viewModel = this.CreateViewModel();
            this.PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual LatestBlogPostsDrop CreateViewModel()
        {
            return new LatestBlogPostsDrop();
        }

        protected virtual void PopulateViewModel(LatestBlogPostsDrop model, LatestBlogPosts articleList)
        {           
            var pageLinkDropList = new List<LatestBlogPostDrop>();
            int counter = 0;
            foreach (int page in articleList.BlogPosts)
            {
                counter++;
                GetPageResult<AbstractPage> pageByVariantKey = this.ContentHelper.GetPageByVariantKey(page, false);
                if (pageByVariantKey.Page != null && !pageByVariantKey.Page.IsRetracted
                    && pageByVariantKey.DisplayLink)
                {
                    var blogPage = pageByVariantKey.Page as NewsPage;
                    var articlePageView = ContentHelper.GetWidgets(blogPage.ContentKey, "Content")
                        .FirstOrDefault(x => x is ArticlePageView) as ArticlePageView;

                    pageLinkDropList.Add(new LatestBlogPostDrop()
                    {
                        Url = PageContext.Current.GenerateUrl(blogPage),
                        Title = blogPage.Title,
                        Summary = blogPage.Summary,
                        PublishDate = blogPage.PublishDate.Value.UtcDateTime.ToShortDateString(),
                        Author = blogPage.Author,
                        Number = counter,
                        BackgroundImageUrl = articlePageView != null ? articlePageView.ArticleImageUrl : string.Empty
                    });
                }
            }
            model.PageLinks = pageLinkDropList;
        }
    }
}
