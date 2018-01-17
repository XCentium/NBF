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
            this.ContentHelper = contentHelper;
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

            var newsPage = this.ContentHelper.GetChildPages<NewsPage>((int)newsPageView.ParentKey, false);
            //var summary = this.ContentHelper.GetWidgets(newsPage.ContentKey, "Summary").FirstOrDefault();
            //if (summary != null)
            //{
            //    var summaryContents = summary.CurrentContentItemFields.FirstOrDefault(xx => xx.Key == "Body");
            //    if (summaryContents.Value != null && !string.IsNullOrEmpty(summaryContents.Value.StringValue))
            //    {
            //        model.PageSummary = summary.CurrentContentItemFields.FirstOrDefault(xx => xx.Key == "Body").Value.StringValue;
            //    }
            //}

            //for (var x = 0; x < source.Count; x++)
            //{
            //    if (source[x].Id == newsPage.Id)
            //    {
            //        if (x > 0)
            //        {
            //            model.PreviousArticle = source[x - 1].Url;
            //            model.PreviousArticleTitle = source[x - 1].Title;
            //        }
            //        if (x + 1 < source.Count)
            //        {
            //            model.NextArticle = source[x + 1].Url;
            //            model.NextArticleTitle = source[x + 1].Title;
            //        }
            //    }
            //}

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
