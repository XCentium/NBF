﻿using Insite.Common.Extensions;
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
        }
    }
}