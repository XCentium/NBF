using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;
using Insite.WebFramework.Content.Interfaces;

namespace Extensions.Widgets
{
    public class ArticlePageCommentsViewPreparer : GenericPreparer<ArticlePageCommentsView>
    {
        protected readonly IContentHelper ContentHelper;
        public ArticlePageCommentsViewPreparer(ITranslationLocalizer translationLocalizer, IContentHelper contentHelper)
          : base(translationLocalizer)
        {
            ContentHelper = contentHelper;
        }

        public override void Prepare(ArticlePageCommentsView contentItem)
        {
            contentItem.CommentCount = ContentHelper.GetWidgets(contentItem.ContentKey, "Comments").Count;
        }
    }
}
