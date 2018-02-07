using Insite.Core.Interfaces.Dependency;
using Insite.Core.SystemSetting;
using Insite.Core.SystemSetting.Groups;

namespace Extensions.Settings
{
    [SettingsGroup(PrimaryGroupName = "OrderManagement", Label = "Order Tracking Settings", SortOrder = 13)]
    public class OrderTrackerSettings : BaseSettingsGroup, IExtension
    {
        [SettingsField(Description = "URL for the page containing Order Tracker Widget to be used for filtering authorized users", DisplayName = "Order Tracking URL")]
        public virtual string OrderTrackerUrl => this.GetValue("/OrderTracker");

        [SettingsField(Description = "URL for the page containing Order Tracker Detail View Widget to be used for filtering authorized users", DisplayName = "Order Tracking Detail URL")]
        public virtual string OrderTrackerDetailUrl => this.GetValue("/OrderTracker/Order");
    }
}