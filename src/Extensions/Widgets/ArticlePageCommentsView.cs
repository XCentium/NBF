using System;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;
using Insite.ContentLibrary.Pages;
using Insite.WebFramework.Content.Attributes;

namespace Extensions.Widgets
{
    [AllowedParents(typeof(NewsPage))]
    [DisplayName("NBF - Article Page Comments View")]
    public class ArticlePageCommentsView : ContentWidget
    {
        [TextContentField(IsRequired = true)]
        public virtual string Title
        {
            get
            {
                return GetValue("Title", "Comments", FieldType.Contextual);
            }
            set
            {
                SetValue("Title", value, FieldType.Contextual);
            }
        }
        
        public virtual int CommentCount
        {
            get
            {
                return GetPerRequestValue<int>(nameof(CommentCount));
            }
            set
            {
                SetPerRequestValue(nameof(CommentCount), value);
            }
        }
    }
}
