using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework.Content.Attributes;
using System;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Page Tag Links View")]
    public class PageTagLinksView : ContentWidget
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

        public virtual PageTagLinksViewDrop Drop
        {
            get
            {
                return this.GetPerRequestValue<PageTagLinksViewDrop>(nameof(Drop));
            }
            set
            {
                this.SetPerRequestValue<PageTagLinksViewDrop>(nameof(Drop), value);
            }
        }
    }
}

