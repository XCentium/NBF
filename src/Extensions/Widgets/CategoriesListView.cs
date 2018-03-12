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

        public virtual string CategoryIndicator
        {
            get
            {
                var indicator = RootCategoryId;
                if(RootCategory.Equals("Products Categories") || RootCategory.Equals("By-Area Categories"))
                {
                    indicator = RootCategory;
                }
                return indicator;
            }
        }
    }   
}
