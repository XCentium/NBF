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
    [DisplayName("NBF - Article Page Comment")]
    public class ArticlePageComment : ContentWidget
    {
        [TextContentField(IsRequired = true)]
        public virtual string NameOfCommenter
        {
            get
            {
                return GetValue("NameOfCommenter", "Anonymous", FieldType.Contextual);
            }
            set
            {
                SetValue("NameOfCommenter", value, FieldType.Contextual);
            }
        }

        [RichTextContentField(IsRequired = true)]
        public virtual string Comment
        {
            get
            {
                return GetValue("Comment", "Comment submitted.", FieldType.Contextual);
            }
            set
            {
                SetValue("Comment", value, FieldType.Contextual);
            }
        }

        [DatePickerField(IncludeTimePicker = true, IsRequired = true)]
        public virtual DateTimeOffset? CommentDate
        {
            get
            {
                return GetValue("CommentDate", new DateTimeOffset?(), FieldType.General);
            }
            set
            {
                SetValue("CommentDate", value, FieldType.General);
            }
        }

        public virtual string DateDifference
        {
            get
            {
                return GetPerRequestValue<string>(nameof(DateDifference));
            }
            set
            {
                SetPerRequestValue(nameof(DateDifference), value);
            }
        }
    }
}
