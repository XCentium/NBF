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
            var tagSet = new HashSet<string>();
            List<NewsPage> list = new List<NewsPage>();
            list = this.ContentHelper.GetChildPages<NewsPage>(articleList.PageContentKey, true).OrderByDescending<NewsPage, DateTimeOffset?>((Func<NewsPage, DateTimeOffset?>)(o => o.PublishDate)).ToList<NewsPage>();
            foreach (var item in list)
            {
                var tagField = this.UnitOfWork.GetRepository<ContentItem>().GetTable().Where(x => x.ParentKey == item.ContentKey && x.IsDeleted == false && x.IsRetracted == false && x.PublishOn != null)
                    .Join(this.UnitOfWork.GetRepository<ContentItemField>().GetTable().OrderByDescending(p => p.PublishOn), ci => ci.ContentKey, cif => cif.ContentKey,
                        (ci, cif) => new { ci = ci, cif = cif })
                        .Where(x => x.cif.FieldName == "PageTags");
                var keyList = new List<int>();
                foreach (var tag in tagField)
                {
                    if (!keyList.Contains(tag.ci.ContentKey) && tag.cif.ObjectValue != null && tag.cif.ObjectValue.Count() > 0)
                    {
                        keyList.Add(tag.ci.ContentKey);
                        var oValue = tag.cif.ObjectValue.ToObject() as List<string>;
                        foreach (var t in oValue)
                        {
                            tagSet.Add(t);
                        }
                        
                    }

                }
            }
            //var tagField = this.UnitOfWork.GetRepository<ContentItemField>().GetTable()
            //        .Where(x => x.FieldName == "PageTags" && x.PublishOn != null && x.IsRetracted == false).OrderByDescending(x => x.PublishOn);
            //var keyList = new List<int>();
            //foreach (var tagList in tagField)
            //{
            //    if (!keyList.Contains(tagList.ContentKey))
            //    {
            //        keyList.Add(tagList.ContentKey);
            //        if (tagList.FieldName == "PageTags")
            //        {
            //            foreach (var tag in tagList.ObjectValue.ToObject() as List<string>)
            //            {
            //                tagSet.Add(tag);
            //            }
            //        }
            //    }
                
            //}
            model.PageTags = tagSet.ToList();
        }
    }
}
