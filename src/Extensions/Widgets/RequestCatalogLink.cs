using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework;
using Insite.WebFramework.Content;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Request Catalog Link")]
    public class RequestCatalogLink : ContentWidget
    {
        private AbstractPage _linkedContent;

        [TextContentField]
        public virtual string Text
        {
            get
            {
                return GetValue("Text", "Request a FREE Catalog", FieldType.Contextual);
            }
            set
            {
                SetValue("Text", value, FieldType.Contextual);
            }
        }

        [SelectedPageContentField(DisplayName = "Request Catalog Page", IsRequired = true)]
        public virtual string LinkedContentName
        {
            get
            {
                return GetValue("LinkedContentName", string.Empty, FieldType.General);
            }
            set
            {
                SetValue("LinkedContentName", value, FieldType.General);
            }
        }
        protected AbstractPage LinkedContent => _linkedContent ?? (_linkedContent = GetLinkedContent());

        public string LinkedContentTitle
        {
            get
            {
                var linkedContent = LinkedContent;
                return linkedContent?.Title;
            }
        }

        public string LinkedContentUrl => PageContext.Current.GenerateUrl(_linkedContent);

        public bool LinkedContentExists => LinkedContent != null;

        private AbstractPage GetLinkedContent()
        {
            return PageContext.Current.ContentHelper.GetPage<AbstractPage>(LinkedContentName).Page;
        }
    }
}