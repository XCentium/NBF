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
    public class PageTagSelectViewPreparer : GenericPreparer<PageTagSelectView>
    {
        protected readonly IContentHelper ContentHelper;
        protected readonly HttpContextBase HttpContext;
        protected readonly IUnitOfWork UnitOfWork;

        public PageTagSelectViewPreparer(IContentHelper contentHelper, HttpContextBase httpContext, ITranslationLocalizer translationLocalizer ,IUnitOfWorkFactory unitOfWorkFactory)
          : base(translationLocalizer)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.ContentHelper = contentHelper;
            this.HttpContext = httpContext;
        }

        public override void Prepare(PageTagSelectView contentItem)
        {
            PageTagSelectViewDrop viewModel = this.CreateViewModel();
            this.PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual PageTagSelectViewDrop CreateViewModel()
        {
            return new PageTagSelectViewDrop();
        }

        protected virtual void PopulateViewModel(PageTagSelectViewDrop model, PageTagSelectView articleList)
        {
            //string str1 = articleList.Id.ToString();
            //int intFromQueryString1 = this.HttpContext.Request.ParseIntFromQueryString(string.Format("{0}_page", (object)str1), 1);
            //int intFromQueryString2 = this.HttpContext.Request.ParseIntFromQueryString(string.Format("{0}_pageSize", (object)str1), articleList.DefaultPageSize);
            //List<NewsPage> list = this.ContentHelper.GetChildPages<NewsPage>(articleList.PageContentKey, true).OrderByDescending<NewsPage, DateTimeOffset?>((Func<NewsPage, DateTimeOffset?>)(o => o.PublishDate)).ToList<NewsPage>();

            var tagSet = new HashSet<string>();
            //var tagField = this.UnitOfWork.GetRepository<ContentItem>().GetTable().Where(x => x.IsDeleted == false && x.IsRetracted == false && x.PublishOn != null)
            //    .Join(this.UnitOfWork.GetRepository<ContentItemField>().GetTable(), ci => ci.ContentKey, cif => cif.ContentKey,
            //        (ci, cif) => new { ci = ci, cif = cif })
            //        .Where(x => x.cif.FieldName == "Css" || x.cif.FieldName == "Url");
            var tagField = this.UnitOfWork.GetRepository<ContentItemField>().GetTable()
                    .Where(x => x.FieldName == "CssClass" || x.FieldName == "Url");
            foreach (var tag in tagField)
            {
                if (tag.FieldName == "CssClass")
                {
                    tagSet.Add(tag.StringValue);
                }

            }
            model.PageTagList = tagSet.ToList();

            //var l = new List<string>();
            //l.Add("list1");
            //l.Add("list2");
            //model.PageTags = l;

            //if (!list.Any<NewsPage>())
            //    return;
            //model.NewsListId = str1;
            //model.PageTags = (ICollection<PageTagLinksViewDrop>)list.Skip<NewsPage>(intFromQueryString2 * (intFromQueryString1 - 1)).Take<NewsPage>(intFromQueryString2).Select<NewsPage, PageTagLinksViewDrop>((Func<NewsPage, PageTagLinksViewDrop>)(p =>
            //{
            //    PageTagLinksViewDrop listViewPageDrop = new PageTagLinksViewDrop();

            //    return listViewPageDrop;
            //})).ToList<PageTagLinksViewDrop>();
            //model.Pagination = new PagingInfo(intFromQueryString1, intFromQueryString2, list.Count, articleList.DefaultPageSize);
        }
    }
}
