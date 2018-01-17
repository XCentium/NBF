using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Providers;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    public class OrderTracker : ContentWidget
    {
        private string _phoneIsRequiredErrorMessage;
        private string _phoneIsInvalidErrorMessage;
        private string _orderNumberIsRequiredErrorMessage;
        private string _orderNumberIsInvalidErrorMessage;
        private MessageProvider _messageProvider;

        [RichTextContentField(DisplayName = "Content - Above", IsRequired = true)]
        public virtual string ContentAbove
        {
            get
            {
                return GetValue("ContentAbove", "<h3>Look up a single order</h3><p>Enter your order number and phone number to track its status</p>", FieldType.Contextual);
            }
            set
            {
                SetValue("ContentAbove", value, FieldType.Contextual);
            }
        }

        [TextContentField]
        public virtual string ButtonText
        {
            get
            {
                return GetValue("ButtonText", "Track Order", FieldType.Contextual);
            }
            set
            {
                SetValue("ButtonText", value, FieldType.Contextual);
            }
        }

        public virtual string PhoneIsRequiredErrorMessage =>
            _phoneIsRequiredErrorMessage ?? (_phoneIsRequiredErrorMessage = _messageProvider.GetMessage("OrderTracker_PhoneRequired", "Phone Required", ""));
        public virtual string PhoneIsInvalidErrorMessage =>
            _phoneIsInvalidErrorMessage ?? (_phoneIsInvalidErrorMessage = _messageProvider.GetMessage("OrderTracker_PhoneInvalid", "Invalid Phone Format", ""));
        public virtual string OrderNumberIsRequiredErrorMessage =>
            _orderNumberIsRequiredErrorMessage ?? (_orderNumberIsRequiredErrorMessage = _messageProvider.GetMessage("OrderTracker_OrderNumberRequired", "Order Number Required", ""));
        public virtual string OrderNumberIsInvalidErrorMessage =>
            _orderNumberIsInvalidErrorMessage ?? (_orderNumberIsInvalidErrorMessage = _messageProvider.GetMessage("OrderTracker_OrderNumberInvalid", "Invalid Order Number Format", ""));
    }
}
