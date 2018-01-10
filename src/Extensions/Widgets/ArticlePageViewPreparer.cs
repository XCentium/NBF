using Insite.ContentLibrary.Pages;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework;
using Insite.WebFramework.Content;
using System;

namespace Extensions.Widgets
{
    public class ArticlePageViewPreparer : GenericPreparer<ArticlePageView>
    {
        public ArticlePageViewPreparer(ITranslationLocalizer translationLocalizer)
          : base(translationLocalizer)
        {
        }

        public override void Prepare(ArticlePageView contentItem)
        {
            ArticlePageViewDrop viewModel = this.CreateViewModel();
            this.PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual ArticlePageViewDrop CreateViewModel()
        {
            return new ArticlePageViewDrop();
        }

        protected virtual void PopulateViewModel(ArticlePageViewDrop model, ArticlePageView newsPageView)
        {
            NewsPage page = PageContext.Current.Page as NewsPage;
            model.Author = page.Author;
            ArticlePageViewDrop newsPageViewDrop = model;
            DateTimeOffset? publishDate = page.PublishDate;

            string str = ((publishDate).HasValue ? (publishDate).GetValueOrDefault().LocalDateTime.ToShortDateString() : (string)null) ?? string.Empty;
            newsPageViewDrop.PublishDate = str;
            model.NewsContents = page.NewsContents;
            model.Title = page.Title;
        }
    }
}
