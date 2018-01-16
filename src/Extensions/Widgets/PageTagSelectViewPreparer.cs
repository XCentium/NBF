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
using Insite.Message.Services;
using Insite.Message.Services.Parameters;

namespace Extensions.Widgets
{
    public class PageTagSelectViewPreparer : GenericPreparer<PageTagSelectView>
    {
        protected readonly IContentHelper ContentHelper;
        protected readonly HttpContextBase HttpContext;
        protected readonly IUnitOfWork UnitOfWork;

        public PageTagSelectViewPreparer(IContentHelper contentHelper, HttpContextBase httpContext, ITranslationLocalizer translationLocalizer, 
            IUnitOfWorkFactory unitOfWorkFactory)
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

        protected virtual void PopulateViewModel(PageTagSelectViewDrop model, PageTagSelectView pageTagView)
        {
            var tagSet = new HashSet<string>();

            foreach (var tag in pageTagView.PageTags)
            {
                tagSet.Add(tag);
            }
            model.PageTags = tagSet.ToList();

        }
    }
}
