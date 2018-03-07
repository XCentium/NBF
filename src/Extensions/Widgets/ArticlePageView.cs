using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.WebFramework.Content.Attributes;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Article Page View")]
    [AllowedParents(typeof(NewsPage))]
    public class ArticlePageView : ContentWidget
    {
        public virtual ArticlePageViewDrop Drop
        {
            get
            {
                return GetPerRequestValue<ArticlePageViewDrop>(nameof(Drop));
            }
            set
            {
                SetPerRequestValue(nameof(Drop), value);
            }
        }

        [FilePickerField(IsRequired = false, ResourceType = "ImageFiles",DisplayName = "Article Image used for Article Widgets")]
        public virtual string ArticleImageUrl
        {
            get
            {
                return GetValue("ArticleImageUrl", string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue("ArticleImageUrl", value, FieldType.Contextual);
            }
        }

        [DropDownContentField(new[] { "Left", "Center", "Right" }, SortOrder = 20)]
        public virtual string ArticleImageWidgetViewFocalPosition
        {
            get
            {
                return GetValue(nameof(ArticleImageWidgetViewFocalPosition), "Center", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ArticleImageWidgetViewFocalPosition), value, FieldType.Contextual);
            }
        }

        [RichTextContentField(IsRequired = false)]
        public virtual string AuthorInfo
        {
            get
            {
                return GetValue("AuthorInfo", "Information About The Author", FieldType.Contextual);
            }
            set
            {
                SetValue("AuthorInfo", value, FieldType.Contextual);
            }
        }

        [FilePickerField(IsRequired = false, ResourceType = "ImageFiles")]
        public virtual string AuthorImageUrl
        {
            get
            {
                return GetValue("AuthorImageUrl", string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue("AuthorImageUrl", value, FieldType.Contextual);
            }
        }

        public bool InfoExists => !AuthorInfo.IsNullOrWhiteSpace();
        public bool AuthorImageExists => !AuthorImageUrl.IsNullOrWhiteSpace();
        public bool ArticleImageExists => !ArticleImageUrl.IsNullOrWhiteSpace();
    }
}
