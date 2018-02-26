using Extensions.Settings;
using Insite.Core.Interfaces.Localization;
using Insite.WebFramework.Content;

namespace Extensions.Widgets
{
    public class CallUsPreparer : GenericPreparer<CallUs>
    {
        protected readonly PhoneNumberSettings PhoneNumberSettings;

        public CallUsPreparer(ITranslationLocalizer translationLocalizer, PhoneNumberSettings phoneNumberSettings)
          : base(translationLocalizer)
        {
            PhoneNumberSettings = phoneNumberSettings;
        }

        public override void Prepare(CallUs contentItem)
        {
            contentItem.CustomerServicePhone = PhoneNumberSettings.CustomerServicePhoneNumber;
        }
    }
}
