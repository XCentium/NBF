using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.WebFramework.Content.Attributes;
using System;

namespace Extensions.Widgets
{
    public class ArticlePageView : ContentWidget
    {
        public virtual ArticlePageViewDrop Drop
        {
            get
            {
                return this.GetPerRequestValue<ArticlePageViewDrop>(nameof(Drop));
            }
            set
            {
                this.SetPerRequestValue<ArticlePageViewDrop>(nameof(Drop), value);
            }
        }
    }
}
