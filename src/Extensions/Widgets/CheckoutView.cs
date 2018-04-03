using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Checkout View")]
    public class CheckoutView : ContentWidget
    {
        [RichTextContentField(IsRequired = true)]
        public virtual string TermsAndConditionsModalContent
        {
            get
            {
                return GetValue(nameof(TermsAndConditionsModalContent), "Terms and Conditions Modal Content Placeholder", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(TermsAndConditionsModalContent), value, FieldType.Contextual);
            }
        }
    }
}
