using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework.Content.Attributes;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
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
        public bool ImageExists => !AuthorImageUrl.IsNullOrWhiteSpace();
    }
}
