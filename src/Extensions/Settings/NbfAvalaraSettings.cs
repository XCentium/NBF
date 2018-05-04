using Insite.Core.Interfaces.Dependency;
using Insite.Core.SystemSetting;
using Insite.Core.SystemSetting.Groups;
using Insite.Core.SystemSetting.Groups.OrderManagement;

namespace Extensions.Settings
{
    [SettingsGroup(HasTestButton = true, Label = "NBF - Avalara Tax Calculator", PrimaryGroupName = "OrderManagement", SortOrder = 20, TestButtonLabel = "Test Connection")]
    [SettingsFieldDependency(typeof(TaxesSettings), "Calculator", "NBF - Avalara")]
    public class AvalaraSettings : BaseSettingsGroup, IExtension
    {
        [SettingsField(Description = "Company Code needed to identify the company to Avalara. This would be found in the documenation provided by Avalara.", DisplayName = "Company Code")]
        public virtual string CompanyCode => GetValue(string.Empty, nameof(CompanyCode));

        [SettingsField(Description = "Indicates if discounts are applied to freight for tax calculation purposes.", DisplayName = "Discount Freight On Order")]
        public virtual bool DiscountFreightOnOrder => GetValue(false, nameof(DiscountFreightOnOrder));

        [SettingsField(Description = "The tax code used by Avalara for freight charges.", DisplayName = "Freight Tax Code")]
        public virtual string FreightTaxCode => GetValue("Freight", nameof(FreightTaxCode));

        [SettingsField(Description = "The account number for your Avalara account. This will be a ten digit number.", DisplayName = "Account")]
        public virtual string TaxServiceAccount => GetValue(string.Empty, nameof(TaxServiceAccount));

        [SettingsField(Description = "The license key required to connect to Avalara. This will be a 16 character string.", DisplayName = "License Key")]
        public virtual string TaxServiceLicense => GetValue(string.Empty, nameof(TaxServiceLicense));

        [SettingsField(Description = "Determines if tax will be calculated using the development server or the live server.")]
        public virtual bool SendLiveTransaction => GetValue(false, nameof(SendLiveTransaction));

        [SettingsField(Description = "If Yes, taxes will be posted to Avalara on order submit.", DisplayName = "Post Taxes on Order Submit")]
        [SettingsFieldAuthorizationRequired(AllowedRoles = new[] { "ISC_System", "ISC_Implementer" })]
        public virtual bool PostTaxes => GetValue(false, nameof(PostTaxes));

        [SettingsField(Description = "If enabled, transaction logs will be saved to the application log to assist with troubleshooting. To prevent large numbers of application logs this should only be used for debugging purposes.", DisplayName = "Log Transactions", IsGlobal = false)]
        public virtual bool LogTransactions => GetValue(false, nameof(LogTransactions));
    }
}
