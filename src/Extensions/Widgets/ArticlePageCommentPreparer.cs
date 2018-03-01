using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;
using System;

namespace Extensions.Widgets
{
    public class ArticlePageCommentPreparer : GenericPreparer<ArticlePageComment>
    {
        public ArticlePageCommentPreparer(ITranslationLocalizer translationLocalizer)
          : base(translationLocalizer)
        {

        }

        public override void Prepare(ArticlePageComment contentItem)
        {
            var now = DateTimeOffset.Now;
            if (contentItem.CommentDate == null) return;
            var date = contentItem.CommentDate.Value;
            var diff = now.Subtract(date);
            if (diff.Days > 0)
            {
                contentItem.DateDifference = $"{diff.Days} days ago";
            } else if (diff.Hours > 0)
            {
                contentItem.DateDifference = $"{diff.Hours} hours ago";
            } else if (diff.Minutes > 0)
            {
                contentItem.DateDifference = $"{diff.Minutes} minutes ago";
            } 
        }
    }
}
