using Insite.ContentLibrary.Pages;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using System;

namespace Extensions.Widgets
{
    public class ArticlePageViewPreparer : GenericPreparer<ArticlePageView>
    {
        protected readonly IContentHelper ContentHelper;

        public ArticlePageViewPreparer(ITranslationLocalizer translationLocalizer, IContentHelper contentHelper)
          : base(translationLocalizer)
        {
            ContentHelper = contentHelper;
        }

        public override void Prepare(ArticlePageView contentItem)
        {
            ArticlePageViewDrop viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual ArticlePageViewDrop CreateViewModel()
        {
            return new ArticlePageViewDrop();
        }

        protected virtual void PopulateViewModel(ArticlePageViewDrop model, ArticlePageView newsPageView)
        {
            NewsPage page = PageContext.Current.Page as NewsPage;
            model.Author = page != null ? page.Author : string.Empty;
            ArticlePageViewDrop newsPageViewDrop = model;
            DateTimeOffset? publishDate = page?.PublishDate;

            string str = ((publishDate).HasValue ? (publishDate).GetValueOrDefault().LocalDateTime.ToShortDateString() : null) ?? string.Empty;
            newsPageViewDrop.PublishDate = str;
            model.NewsContents = page?.NewsContents;
            model.Summary = page?.Summary;
            model.Title = page?.Title;
        }
    }
}
