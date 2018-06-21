using System;
using System.Web;
using Insite.Common.Extensions;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Interfaces.Plugins.SystemSetting;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Core.SystemSetting.Groups.SystemSettings;
using Insite.WebFramework.Content;

namespace Extensions.Widgets
{
    public class CheckoutViewPreparer : GenericPreparer<CheckoutView>
    {
        private readonly PaymentSettings _paymentSettings;

        private readonly ISystemSettingProvider _systemSettingProvider;

        public CheckoutViewPreparer(ITranslationLocalizer translationLocalizer, SecuritySettings securitySettings, PaymentSettings paymentSettings, ISystemSettingProvider systemSettingProvider) : base(translationLocalizer,
            securitySettings)
        {
            this._paymentSettings = paymentSettings;
            this._systemSettingProvider = systemSettingProvider;
        }

        public CheckoutViewPreparer(ITranslationLocalizer translationLocalizer, PaymentSettings paymentSettings, ISystemSettingProvider systemSettingProvider) : base(translationLocalizer)
        {
            this._paymentSettings = paymentSettings;
            this._systemSettingProvider = systemSettingProvider;
        }

        public override void Prepare(CheckoutView contentItemModel)
        {
            var model = this.CreateViewModel();
            this.PopulateViewModel(model, contentItemModel);
            contentItemModel.Drop = model;
        }

        protected virtual CheckoutViewDrop CreateViewModel()
        {
            return new CheckoutViewDrop();
        }

        protected virtual void PopulateViewModel(CheckoutViewDrop model, CheckoutView invoicesView)
        {
            model.IsCloudPaymentGateway = this._paymentSettings.Gateway.EqualsIgnoreCase(PaymentSettings.CloudPaymentGatewayName);
            if (!model.IsCloudPaymentGateway)
            {
                return;
            }

            model.HostedPciFrameHost = "https://ccframe.hostedpci.com";
            var hostedPciSiteId = this._systemSettingProvider.GetValue("HostedPci_TestMode", true)
                ? this._systemSettingProvider.GetValue("HostedPci_iFrameTestSiteId", string.Empty)
                : this._systemSettingProvider.GetValue("HostedPci_iFrameProductionSiteId", string.Empty);
            var hostedPciFullParentHost =
                HttpUtility.UrlEncode(HttpContext.Current.Request.ActualUrl().GetLeftPart(UriPartial.Authority) + "/");
            var hostedPciFullParentQStr = HttpUtility.UrlEncode(HttpContext.Current.Request.ActualUrl().AbsoluteUri);

            model.HostedPciFrameFullUrl = $"{model.HostedPciFrameHost}/iSynSApp/showPxyPage!ccFrame.action" +
                                          "?pgmode1=prod" +
                                          "&locationName=checkout1" +
                                          $"&sid={hostedPciSiteId}" +
                                          "&reportCCType=Y" +
                                          "&formatCCDigits=Y" +
                                          "&formatCCDigitsDelimiter=-" +
                                          $"&fullParentHost={hostedPciFullParentHost}" +
                                          $"&fullParentQStr={hostedPciFullParentQStr}" +
                                          "&pluginMode=jq2" +
                                          "&ccNumTokenIdx=1";
        }
    }
}
