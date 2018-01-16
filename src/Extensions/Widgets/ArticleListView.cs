using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework.Content.Attributes;
using System;

namespace Extensions.Widgets
{
    [AllowedChildren(new Type[] { typeof(ArticlePageView) })]
    public class ArticleListView : ContentWidget
    {
        [IntegerContentField]
        public virtual int DefaultPageSize
        {
            get
            {
                return this.GetValue<int>(nameof(DefaultPageSize), 5, FieldType.General);
            }
            set
            {
                this.SetValue<int>(nameof(DefaultPageSize), value, FieldType.General);
            }
        }

        public virtual ArticleListViewDrop Drop
        {
            get
            {
                return this.GetPerRequestValue<ArticleListViewDrop>(nameof(Drop));
            }
            set
            {
                this.SetPerRequestValue<ArticleListViewDrop>(nameof(Drop), value);
            }
        }
    }
}
