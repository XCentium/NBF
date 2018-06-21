using System.ComponentModel;
using Insite.ContentLibrary.Widgets;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Checkout View")]
    public class CheckoutView : ContentWidget
    {
        public virtual CheckoutViewDrop Drop
        {
            get { return this.GetPerRequestValue<CheckoutViewDrop>(nameof(this.Drop)); }
            set { this.SetPerRequestValue(nameof(this.Drop), value); }
        }
    }
}
