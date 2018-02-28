using System;
using System.Collections.Generic;
using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Category Select")]
    public class CategoryWidget : ContentWidget
    {
        [ListContentField]
        public virtual List<string> CategoryIds
        {
            get
            {
                return GetValue("CategoryIds", new List<string>(), FieldType.Contextual);
            }
            set
            {
                SetValue("CategoryIds", value, FieldType.Contextual);
            }
        }

        public virtual string CategoryString => string.Join(":", CategoryIds.ToArray());
    }
}