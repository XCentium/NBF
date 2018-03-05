using Insite.Core.Interfaces.Dependency;
using Insite.Core.SystemSetting;
using Insite.Core.SystemSetting.Groups;

namespace Extensions.Settings
{
    [SettingsGroup(PrimaryGroupName = "SiteConfigurations", Label = "Phone Numbers", SortOrder = 13)]
    public class PhoneNumberSettings : BaseSettingsGroup, IExtension
    {
        [SettingsField(Description = "Customer Service Phone Number", DisplayName = "Customer Service Phone Number")]
        public virtual string CustomerServicePhoneNumber => GetValue("800-558-1010");
    }
}