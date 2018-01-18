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
        private readonly MessageProvider _messageProvider;

        public OrderTracker()
        {
            _messageProvider = new MessageProvider();
        }

        [RichTextContentField(DisplayName = "Content - Above", IsRequired = true)]
        public virtual string ContentAbove
        {
            get
            {
                return GetValue("ContentAbove", "<h2>Look up a single order</h2><p>Enter your order number and phone number to track its status</p>", FieldType.Contextual);
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

        [TextContentField]
        public virtual string OrderNotFoundErrorMessage
        {
            get
            {
                return GetValue("OrderNotFoundErrorMessage", "Order not found, please try again.", FieldType.Contextual);
            }
            set
            {
                SetValue("OrderNotFoundErrorMessage", value, FieldType.Contextual);
            }
        }

        [RichTextContentField(DisplayName = "Content - Below", IsRequired = true)]
        public virtual string ContentBelow
        {
            get
            {
                return GetValue("ContentBelow", "", FieldType.Contextual);
            }
            set
            {
                SetValue("ContentBelow", value, FieldType.Contextual);
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
