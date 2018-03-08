using System.Collections.Generic;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Category List View")]
    public class CategorieslistView : ContentWidget
    {
        [TextContentField(IsRequired = true)]
        public virtual string RootCategoryId
        {
            get
            {
                return GetValue(nameof(RootCategoryId), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(RootCategoryId), value, FieldType.Contextual);
            }
        }

        public virtual bool CategoryIdSet => !RootCategoryId.IsNullOrWhiteSpace();
    }   
}
