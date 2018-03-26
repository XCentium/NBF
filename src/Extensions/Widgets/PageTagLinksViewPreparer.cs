using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Localization;
using Insite.Data.Entities;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.ContentLibrary.Pages;

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
            UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            ContentHelper = contentHelper;
            HttpContext = httpContext;
        }

        public override void Prepare(PageTagLinksView contentItem)
        {
            PageTagLinksViewDrop viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual PageTagLinksViewDrop CreateViewModel()
        {
            return new PageTagLinksViewDrop();
        }

        protected virtual void PopulateViewModel(PageTagLinksViewDrop model, PageTagLinksView articleList)
        {
            var list = ContentHelper.GetChildPages<NewsPage>(articleList.PageContentKey).OrderByDescending(o => o.PublishDate).ToList();
            var tagSet = new HashSet<string>();

            var keyList = new List<int>();
            foreach (var item in list)
            {
                var tagField = UnitOfWork.GetRepository<ContentItem>().GetTable().Where(x =>
                        x.PageContentKey == item.ContentKey && x.IsDeleted == false && x.IsRetracted == false &&
                        x.PublishOn != null)
                    .Join(UnitOfWork.GetRepository<ContentItemField>().GetTable(), ci => ci.ContentKey,
                        cif => cif.ContentKey,
                        (ci, cif) => new {ci, cif})
                    .Where(x => x.cif.FieldName == "PageTags")
                    .ToList();

                foreach (var tag in tagField)
                {
                    if (tag.cif.ObjectValue != null && tag.cif.ObjectValue.Any() && !keyList.Contains(tag.cif.ContentKey))
                    {
                        keyList.Add(tag.cif.ContentKey);
                        foreach (var tagItem in (List<string>) tag.cif.ObjectValue.ToObject())
                        {
                            tagSet.Add(tagItem);
                        }
                    }
                }
            }
            model.PageTags = tagSet.ToList();
        }
    }
}
