using Insite.ContentLibrary.Pages;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Localization;
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
            UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            ContentHelper = contentHelper;
            HttpContext = httpContext;
        }

        public override void Prepare(LatestBlogPosts contentItem)
        {
            LatestBlogPostsDrop viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
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
                GetPageResult<AbstractPage> pageByVariantKey = null;
                try
                {
                    pageByVariantKey = ContentHelper.GetPageByVariantKey(page);
                }
                catch(Exception ex)
                {
                    //do nothing 
                }
                
                if (pageByVariantKey != null && pageByVariantKey.Page != null && !pageByVariantKey.Page.IsRetracted && pageByVariantKey.Page.PublishOn.HasValue && pageByVariantKey.Page.PublishOn <= DateTimeOffset.Now
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
                        BackgroundImageUrl = articlePageView != null ? articlePageView.ArticleImageUrl : string.Empty,
                        BackgroundImageFocalPosition = articlePageView != null ? articlePageView.ArticleImageWidgetViewFocalPosition : string.Empty
                    });
                }
            }
            model.PageLinks = pageLinkDropList;
        }
    }
}
