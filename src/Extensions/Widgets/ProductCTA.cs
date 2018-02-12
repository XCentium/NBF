using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    public class ProductCTA : ContentWidget
    {
        [DropDownContentField(new string[] { "Bottom Right", "bottom Left", "Top Left", "Top Right" }, IsRequired = true, SortOrder = 110)]
        public virtual string Position
        {
            get
            {
                return this.GetValue<string>("Position", "Bottom Right", FieldType.General).Replace(" ", "").ToLower();
            }
            set
            {
                this.SetValue<string>("Position", value, FieldType.General);
            }
        }
        [DropDownContentField(new string[] { "white", "navy" }, IsRequired = true, SortOrder = 110)]
        public virtual string Style
        {
            get
            {
                return this.GetValue<string>("Style", "navy", FieldType.General);
            }
            set
            {
                this.SetValue<string>("Style", value, FieldType.General);
            }
        }
    }
}
