using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;
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

        public PageTagSelectViewPreparer(IContentHelper contentHelper, HttpContextBase httpContext, ITranslationLocalizer translationLocalizer, 
            IUnitOfWorkFactory unitOfWorkFactory)
          : base(translationLocalizer)
        {
            UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            ContentHelper = contentHelper;
            HttpContext = httpContext;
        }

        public override void Prepare(PageTagSelectView contentItem)
        {
            var viewModel = CreateViewModel();
            PopulateViewModel(viewModel, contentItem);
            contentItem.Drop = viewModel;
        }

        protected virtual PageTagSelectViewDrop CreateViewModel()
        {
            return new PageTagSelectViewDrop();
        }

        protected virtual void PopulateViewModel(PageTagSelectViewDrop model, PageTagSelectView pageTagView)
        {
            var parent = ContentHelper.GetPage(pageTagView.PageContentKey).Page;
            var nullable = parent.ParentKey;
            var variantKey = nullable ?? 0;
            parent = ContentHelper.GetPageByVariantKey(variantKey).Page;
            model.ParentUrl = PageContext.Current.GenerateUrl(parent);
            model.PageUrl = PageContext.Current.GenerateUrl(PageContext.Current.Page);

            var tagSet = new HashSet<string>();

            foreach (var tag in pageTagView.PageTags)
            {
                tagSet.Add(tag);
            }
            
            model.PageTags = tagSet.ToList();
        }
    }
}
