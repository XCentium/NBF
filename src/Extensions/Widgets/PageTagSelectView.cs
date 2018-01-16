using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework.Content.Attributes;
using System;
using System.Collections.Generic;

namespace Extensions.Widgets
{
    public class PageTagSelectView : ContentWidget
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
        [ListContentField(DisplayName = "Page Tags", IsRequired = false)]
        public virtual List<string> PageTags
        {
            get
            {
                return this.GetValue<List<string>>("PageTags", new List<string>(), FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>("PageTags", value, FieldType.Contextual);
            }
        }


        public virtual PageTagSelectViewDrop Drop
        {
            get
            {
                return this.GetPerRequestValue<PageTagSelectViewDrop>(nameof(Drop));
            }
            set
            {
                this.SetPerRequestValue<PageTagSelectViewDrop>(nameof(Drop), value);
            }
        }
    }
}

