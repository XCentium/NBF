using Insite.Common.Extensions;
using Insite.ContentLibrary;
using Insite.ContentLibrary.Pages;
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
    public class ArticleListViewPreparer : GenericPreparer<ArticleListView>
    {
        protected readonly IContentHelper ContentHelper;
        protected readonly HttpContextBase HttpContext;
        protected readonly IUnitOfWork UnitOfWork;

        public ArticleListViewPreparer(IContentHelper contentHelper, HttpContextBase httpContext, ITranslationLocalizer translationLocalizer ,IUnitOfWorkFactory unitOfWorkFactory)
          : base(translationLocalizer)
        {
            UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            ContentHelper = contentHelper;
            HttpContext = httpContext;
        }

        public override void Prepare(ArticleListView contentItem)
        {
            ArticleListViewDrop viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual ArticleListViewDrop CreateViewModel()
        {
            return new ArticleListViewDrop();
        }

        protected virtual void PopulateViewModel(ArticleListViewDrop model, ArticleListView articleList)
        {
            string str1 = articleList.Id.ToString();
            int intFromQueryString1 = HttpContext.Request.ParseIntFromQueryString($"{str1}_page", 1);
            string pageFilter = HttpContext.Request.QueryString.Get("tag");

            int intFromQueryString2 = HttpContext.Request.ParseIntFromQueryString($"{str1}_pageSize", articleList.DefaultPageSize);

            var list = ContentHelper.GetChildPages<NewsPage>(articleList.PageContentKey).OrderByDescending(o => o.PublishDate).ToList();
            var filteredHash = new HashSet<NewsPage>();
            if (pageFilter != null) {
                foreach (var item in list)
                {
                    var tagField = UnitOfWork.GetRepository<ContentItem>().GetTable().Where(x => x.PageContentKey == item.ContentKey && x.IsDeleted == false && x.IsRetracted == false && x.PublishOn != null)
                        .Join(UnitOfWork.GetRepository<ContentItemField>().GetTable(), ci => ci.ContentKey, cif => cif.ContentKey,
                            (ci, cif) => new {ci, cif })
                            .Where(x => x.cif.FieldName == "PageTags");

                    foreach (var tag in tagField)
                    {
                        if (tag.cif.ObjectValue != null && tag.cif.ObjectValue.Any())
                        {
                            var oValue = tag.cif.ObjectValue.ToObject() as List<string>;
                            if (oValue != null && oValue.Contains(pageFilter))
                            {
                                filteredHash.Add(item);
                            }
                        }
                    }
                }
                list = filteredHash.ToList();
            }
            if (!list.Any())
                return;
            model.NewsListId = str1;
            model.NewsPages = list.Skip(intFromQueryString2 * (intFromQueryString1 - 1)).Take(intFromQueryString2).Select(p =>
            {
                var articlePageView = ContentHelper.GetWidgets(p.ContentKey, "Content")
                    .FirstOrDefault(x => x is ArticlePageView) as ArticlePageView;

                ArticleListViewPageDrop listViewPageDrop =
                    new ArticleListViewPageDrop
                    {
                        Url = PageContext.Current.GenerateUrl(p),
                        Title = p.Title,
                        Author = p.Author,
                        QuickSummaryDisplay = p.Summary,
                        Image = articlePageView != null ? articlePageView.ArticleImageUrl : string.Empty,
                        ImageFocalPosition = articlePageView != null ? articlePageView.ArticleImageWidgetViewFocalPosition : string.Empty
                    };
                DateTimeOffset? publishDate = p.PublishDate;

                string str2 = ((publishDate).HasValue ? (publishDate).GetValueOrDefault().LocalDateTime.ToShortDateString() : null) ?? string.Empty;
                listViewPageDrop.PublishDateDisplay = str2;
                string str3 = p.Summary.IsBlank() ? p.NewsContents.Substring(0, p.NewsContents.Length > 500 ? 500 : p.NewsContents.Length) + "..." : p.Summary;
                listViewPageDrop.QuickSummaryDisplay = str3;
                return listViewPageDrop;
            }).ToList();
            model.Pagination = new PagingInfo(intFromQueryString1, intFromQueryString2, list.Count, articleList.DefaultPageSize);
        }
    }
}
