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
    public class PageTagLinksViewPreparer : GenericPreparer<PageTagLinksView>
    {
        protected readonly IContentHelper ContentHelper;
        protected readonly HttpContextBase HttpContext;
        protected readonly IUnitOfWork UnitOfWork;

        public PageTagLinksViewPreparer(IContentHelper contentHelper, HttpContextBase httpContext, ITranslationLocalizer translationLocalizer, IUnitOfWorkFactory unitOfWorkFactory)
          : base(translationLocalizer)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.ContentHelper = contentHelper;
            this.HttpContext = httpContext;
        }

        public override void Prepare(PageTagLinksView contentItem)
        {
            PageTagLinksViewDrop viewModel = this.CreateViewModel();
            this.PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual PageTagLinksViewDrop CreateViewModel()
        {
            return new PageTagLinksViewDrop();
        }

        protected virtual void PopulateViewModel(PageTagLinksViewDrop model, PageTagLinksView articleList)
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
                    .Where(x => x.FieldName == "PageTags");
            foreach (var tagList in tagField)
            {
                if (tagList.FieldName == "PageTags")
                {
                    foreach(var tag in tagList.ObjectValue.ToObject() as List<string>)
                    {
                        tagSet.Add(tag);
                    }
                    
                }

            }
            model.PageTags = tagSet.ToList();

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
