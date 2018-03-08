using System;
using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Category List View")]
    public class CategorieslistView : ContentWidget
    {
        [TextContentField]
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

        [DropDownContentField(new[] { "Use Root Category Id", "Products Categories", "By-Area Categories" }, IsRequired = true, SortOrder = 110)]
        public virtual string RootCategory
        {
            get
            {
                return GetValue("RootCategory", "Use Root Category Id", FieldType.General);
            }
            set
            {
                SetValue("RootCategory", value, FieldType.General);
            }
        }

        public virtual bool CategoryIdSet => !RootCategoryId.IsNullOrWhiteSpace();
        public virtual bool IsProducts => RootCategory.Equals("Products Categories", StringComparison.CurrentCultureIgnoreCase);
        public virtual bool IsByArea => RootCategory.Equals("By-Area Categories", StringComparison.CurrentCultureIgnoreCase);
    }   
}
