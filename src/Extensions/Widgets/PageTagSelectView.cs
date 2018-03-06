using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Page Tag Select View")]
    public class PageTagSelectView : ContentWidget
    {
        [IntegerContentField]
        public virtual int DefaultPageSize
        {
            get
            {
                return GetValue(nameof(DefaultPageSize), 5, FieldType.General);
            }
            set
            {
                SetValue(nameof(DefaultPageSize), value, FieldType.General);
            }
        }
        [ListContentField(DisplayName = "Page Tags", IsRequired = false)]
        public virtual List<string> PageTags
        {
            get
            {
                return GetValue("PageTags", new List<string>(), FieldType.Contextual);
            }
            set
            {
                SetValue("PageTags", value, FieldType.Contextual);
            }
        }


        public virtual PageTagSelectViewDrop Drop
        {
            get
            {
                return GetPerRequestValue<PageTagSelectViewDrop>(nameof(Drop));
            }
            set
            {
                SetPerRequestValue(nameof(Drop), value);
            }
        }
    }
}

