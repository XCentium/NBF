using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Localization;
using Insite.Data.Entities;
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
            var tagSet = new HashSet<string>();
            var tagField = UnitOfWork.GetRepository<ContentItemField>().GetTable()
                    .Where(x => x.FieldName == "PageTags" && x.PublishOn != null && x.IsRetracted == false).OrderByDescending(x => x.PublishOn);
            var keyList = new List<int>();
            foreach (var tagList in tagField)
            {
                if (!keyList.Contains(tagList.ContentKey))
                {
                    keyList.Add(tagList.ContentKey);
                    if (tagList.FieldName == "PageTags")
                    {
                        foreach (var tag in (List<string>) tagList.ObjectValue.ToObject())
                        {
                            tagSet.Add(tag);
                        }
                    }
                }
                
            }
            model.PageTags = tagSet.ToList();
        }
    }
}
