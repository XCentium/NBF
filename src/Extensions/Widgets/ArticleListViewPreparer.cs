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
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();

            var tagSet = new HashSet<string>();
            var tagField = this.UnitOfWork.GetRepository<ContentItem>().GetTable().Where(x => x.IsDeleted == false && x.IsRetracted == false && x.PublishOn != null)
                .Join(this.UnitOfWork.GetRepository<ContentItemField>().GetTable(), ci => ci.ContentKey, cif => cif.ContentKey,
                    (ci, cif) => new { ci = ci, cif = cif })
                    .Where(x => x.cif.FieldName == "Css" || x.cif.FieldName == "Url");
            foreach(var tag in tagField)
            {
                if (tag.cif.FieldName == "Css")
                {
                    tagSet.Add(tag.cif.StringValue);
                }
                
            }
            this.ContentHelper = contentHelper;
            this.HttpContext = httpContext;
        }

        public override void Prepare(ArticleListView contentItem)
        {
            ArticleListViewDrop viewModel = this.CreateViewModel();
            this.PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual ArticleListViewDrop CreateViewModel()
        {
            return new ArticleListViewDrop();
        }

        protected virtual void PopulateViewModel(ArticleListViewDrop model, ArticleListView articleList)
        {
            string str1 = articleList.Id.ToString();
            int intFromQueryString1 = this.HttpContext.Request.ParseIntFromQueryString(string.Format("{0}_page", (object)str1), 1);
            string pageFilter = this.HttpContext.Request.QueryString.Get("tag");

            int intFromQueryString2 = this.HttpContext.Request.ParseIntFromQueryString(string.Format("{0}_pageSize", (object)str1), articleList.DefaultPageSize);
            List<NewsPage> list = new List<NewsPage>();

            list = this.ContentHelper.GetChildPages<NewsPage>(articleList.PageContentKey, true).OrderByDescending<NewsPage, DateTimeOffset?>((Func<NewsPage, DateTimeOffset?>)(o => o.PublishDate)).ToList<NewsPage>();
            var filteredHash = new HashSet<NewsPage>();
            if (pageFilter != null) {
                foreach (var item in list)
                {
                    var tagField = this.UnitOfWork.GetRepository<ContentItem>().GetTable().Where(x => x.ParentKey == item.ContentKey && x.IsDeleted == false && x.IsRetracted == false && x.PublishOn != null)
                        .Join(this.UnitOfWork.GetRepository<ContentItemField>().GetTable(), ci => ci.ContentKey, cif => cif.ContentKey,
                            (ci, cif) => new { ci = ci, cif = cif })
                            .Where(x => x.cif.FieldName == "PageTags");

                    foreach (var tag in tagField)
                    {
                        if (tag.cif.ObjectValue != null && tag.cif.ObjectValue.Count() > 0)
                        {
                            var oValue = tag.cif.ObjectValue.ToObject() as List<string>;
                            if (oValue.Contains(pageFilter))
                            {
                                filteredHash.Add(item);
                            }

                        }
                    }
                    //var pageFields = this.ContentHelper.GetWidgets(item.ContentKey, "Content").DefaultIfEmpty(); //.Where(z => z.Class == "PageTagSelectView");
                    //foreach (var p in pageFields)
                    //{
                    //    foreach (var field in p.CurrentContentItemFields)
                    //    {
                    //        if (field.Key == "PageTags")
                    //        {
                    //            if (((List<string>)field.Value.ObjectValue).Count > 0)
                    //            {
                    //                filteredList.Add(item);
                    //            }
                    //        }
                    //    }
                    //}
                    ////.OrderByDescending<NewsPage, DateTimeOffset?>((Func<NewsPage, DateTimeOffset?>)(o => o.PublishDate)).ToList<NewsPage>();
                }
                list = filteredHash.ToList();
            }
            if (!list.Any<NewsPage>())
                return;
            model.NewsListId = str1;
            model.NewsPages = (ICollection<ArticleListViewPageDrop>)list.Skip<NewsPage>(intFromQueryString2 * (intFromQueryString1 - 1)).Take<NewsPage>(intFromQueryString2).Select<NewsPage, ArticleListViewPageDrop>((Func<NewsPage, ArticleListViewPageDrop>)(p =>
            {
                ArticleListViewPageDrop listViewPageDrop = new ArticleListViewPageDrop();
                listViewPageDrop.Url = PageContext.Current.GenerateUrl((AbstractPage)p);
                listViewPageDrop.Title = p.Title;
                listViewPageDrop.Author = p.Author;
                DateTimeOffset? publishDate = p.PublishDate;

                string str2 = ((publishDate).HasValue ? (publishDate).GetValueOrDefault().LocalDateTime.ToShortDateString() : (string)null) ?? string.Empty;
                listViewPageDrop.PublishDateDisplay = str2;
                string str3 = p.Summary.IsBlank() ? p.NewsContents.Substring(0, p.NewsContents.Length > 500 ? 500 : p.NewsContents.Length) + "..." : p.Summary;
                listViewPageDrop.QuickSummaryDisplay = str3;
                return listViewPageDrop;
            })).ToList<ArticleListViewPageDrop>();
            model.Pagination = new PagingInfo(intFromQueryString1, intFromQueryString2, list.Count, articleList.DefaultPageSize);
        }
    }
}
