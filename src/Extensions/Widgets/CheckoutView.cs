using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    public class CheckoutView : ContentWidget
    {
        [CheckBoxContentField(DisplayName = "Display Cart", SortOrder = 110)]
        public virtual bool DisplayCart
        {
            get
            {
                return this.GetValue<bool>("DisplayCart", true, FieldType.General);
            }
            set
            {
                this.SetValue<bool>("DisplayCart", value, FieldType.General);
            }
        }
    }
}
