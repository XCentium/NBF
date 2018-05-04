using System;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using Avalara.AvaTax.Adapter;
using Avalara.AvaTax.Adapter.AddressService;
using Avalara.AvaTax.Adapter.TaxService;
using Insite.Common.Helpers;
using Insite.Common.Logging;
using Insite.Core.Exceptions;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.EntityUtilities;
using Insite.Core.Plugins.Tax;
using Insite.Core.SystemSetting.Groups.OrderManagement;
using Insite.Data.Entities;
using AvalaraSettings = Extensions.Settings.AvalaraSettings;

namespace Extensions.TaxCalculators
{
    [DependencyName("NBF - Avalara")]
    public class NbfTaxCalculatorAvalara : ITaxCalculator
    {
        private readonly string[] _addressErrorMessages = { "RegionCodeError", "CountryError", "TaxAddressError", "JurisdictionNotFoundError", "AddressRangeError", "TaxRegionError", "AddressError", "InsufficientAddressError", "PostalCodeError", "UnsupportedCountryError", "CityError", "NonDeliverableAddressError", "AddressUnknownStreetError", "MultipleAddressMatchError" };
        /// <summary> The order line utilities </summary>
        protected readonly IOrderLineUtilities OrderLineUtilities;
        /// <summary> The customer order utilities </summary>
        protected readonly ICustomerOrderUtilities CustomerOrderUtilities;
        protected readonly AvalaraSettings AvalaraSettings;
        protected readonly TaxesSettings TaxesSettings;
        public NbfTaxCalculatorAvalara(IOrderLineUtilities orderLineUtilities, ICustomerOrderUtilities customerOrderUtilities, AvalaraSettings avalaraSettings, TaxesSettings taxesSettings) 
        {
            OrderLineUtilities = orderLineUtilities;
            CustomerOrderUtilities = customerOrderUtilities;
            AvalaraSettings = avalaraSettings;
            TaxesSettings = taxesSettings;
        }

        public string TestConnection()
        {
            try
            {
                GetConfiguredTaxService().Ping(string.Empty);
            }
            catch (Exception ex)
            {
                if (ex is AvaTaxException || ex is AdapterConfigException || ex is InvalidOperationException && ex.Message.StartsWith("Avalara Tax Service is not configured") || ex.Source.Equals("Avalara.AvaTax.Adapter"))
                {
                    LogHelper.For(this).Error($"Exception while testing Avalara connection: {ex.Message as object}", ex);
                    return $"Test connection to Avalara failed: {ex.Message as object}";
                }
                throw;
            }
            return "Test connection to Avalara was successful.";
        }

        /// <summary>The calculate tax.</summary>
        /// <param name="originAddress">The origin Address.</param>
        /// <param name="customerOrder">The customer order.</param>
        public void CalculateTax(OriginAddress originAddress, CustomerOrder customerOrder)
        {
            if (customerOrder.TaxCode1.Equals("TE", StringComparison.CurrentCultureIgnoreCase))
            {
                customerOrder.StateTax = decimal.Zero;
                return;
            }

            if (customerOrder.Type != "Quote")
            {
                var orderLines = customerOrder.OrderLines;
                if (orderLines.All(ol => ol.Product.IsQuoteRequired))
                {
                    customerOrder.StateTax = decimal.Zero;
                    return;
                }
            }
            if (customerOrder.Website == null)
                return;
            if (customerOrder.TaxCode1.IsBlank())
                customerOrder.StateTax = decimal.Zero;
            bool storePickup;
            if (!PreFunctionCheck(customerOrder, out storePickup))
                return;
            var requestFromOrder1 = GetCalcTaxRequestFromOrder(originAddress, customerOrder, storePickup, DocumentType.SalesOrder);
            var configuredTaxService = GetConfiguredTaxService();
            string str1;
            try
            {
                var tax = configuredTaxService.GetTax(requestFromOrder1);
                if (AvalaraSettings.LogTransactions)
                    LogHelper.For(this).Info($"CalculateTax request: {(object) SerializeObject(requestFromOrder1)} {(object) Environment.NewLine} Response: {(object) SerializeObject(tax)}", "TaxCalculator_Avalara");
                str1 = ProcessAvalaraResponseMessage(tax);
                customerOrder.StateTax = tax.TotalTax;
            }
            catch (Exception ex)
            {
                LogHelper.For(this).Error("Error running Avalara GetTax method: " + ex.Message, ex, "TaxCalculator_Avalara");
                throw;
            }
            if (!string.IsNullOrEmpty(str1))
                LogHelper.For(this).Debug(str1, "Avalara Result, GetTax: ");
            return;
            string str2;
            try
            {
                var requestFromOrder2 = GetPostTaxRequestFromOrder(customerOrder);
                str2 = ProcessAvalaraResponseMessage(configuredTaxService.PostTax(requestFromOrder2));
            }
            catch (Exception ex)
            {
                LogHelper.For(this).Error("Error running Avalara PostTax method: " + ex.Message, ex, "TaxCalculator_Avalara");
                throw;
            }
            if (string.IsNullOrEmpty(str2))
                return;
            LogHelper.For(this).Debug(str2, "Avalara Result, PostTax: ");
        }
        /// <summary>The post tax.</summary>
        /// <param name="originAddress">The origin Address.</param>
        /// <param name="customerOrder">The customer order.</param>
        public void PostTax(OriginAddress originAddress, CustomerOrder customerOrder)
        {
            bool storePickup;
            if (!AvalaraSettings.PostTaxes || !PreFunctionCheck(customerOrder, out storePickup))
                return;
            var requestFromOrder1 = GetCalcTaxRequestFromOrder(originAddress, customerOrder, storePickup, DocumentType.SalesInvoice);
            var requestFromOrder2 = GetPostTaxRequestFromOrder(customerOrder);
            var configuredTaxService = GetConfiguredTaxService();
            string str;
            try
            {
                configuredTaxService.GetTax(requestFromOrder1);
                var postTaxResult = configuredTaxService.PostTax(requestFromOrder2);
                if (AvalaraSettings.LogTransactions)
                    LogHelper.For(this).Info($"Tax request: {(object) SerializeObject(requestFromOrder1)}" + Environment.NewLine +
                                             $"Post request: {(object) SerializeObject(requestFromOrder2)}" + Environment.NewLine +
                                             $"Response: {(object) SerializeObject(postTaxResult)}", "TaxCalculator_Avalara");
                str = ProcessAvalaraResponseMessage(postTaxResult);
            }
            catch (Exception ex)
            {
                LogHelper.For(this).Error("Error running Avalara PostTax method: " + ex.Message, ex, "TaxCalculator_Avalara");
                throw;
            }
            if (string.IsNullOrEmpty(str))
                return;
            LogHelper.For(this).Debug(str, "Avalara Result, PostTax: ");
        }

        /// <summary>The pre function check.</summary>
        /// <param name="customerOrder">The customer order.</param>
        /// <param name="storePickup">The store pickup.</param>
        /// <returns>The <see cref="T:System.Boolean" />.</returns>
        private bool PreFunctionCheck(CustomerOrder customerOrder, out bool storePickup)
        {
            storePickup = false;
            if (customerOrder.ShipVia != null)
            {
                storePickup = string.Equals(customerOrder.ShipVia.ShipCode, TaxesSettings.StorePickupShipCode, StringComparison.CurrentCultureIgnoreCase);
                if (!storePickup && string.IsNullOrEmpty(customerOrder.STAddress1))
                    return false;
            }
            return true;
        }

        /// <summary>The get configured tax service.</summary>
        /// <returns>The <see cref="T:Avalara.AvaTax.Adapter.TaxService.TaxSvc" />.</returns>
        protected virtual TaxSvc GetConfiguredTaxService()
        {
            var taxServiceAccount = AvalaraSettings.TaxServiceAccount;
            var taxServiceLicense = AvalaraSettings.TaxServiceLicense;
            if (taxServiceAccount.IsBlank() && taxServiceLicense.IsBlank())
            {
                LogHelper.For(this).Error("Avalara Tax Service is not configured completely in Commerce App Settings", "TaxCalculator_Avalara");
                throw new InvalidOperationException("Avalara Tax Service is not configured completely in Commerce App Settings");
            }
            var taxSvc = new TaxSvc();
            taxSvc.Configuration.RequestTimeout = 300;
            taxSvc.Profile.Client = "InSite eCommerce";
            taxSvc.Configuration.Url = AvalaraSettings.SendLiveTransaction ? "https://avatax.avalara.net" : "https://development.avalara.net";
            if (!taxServiceAccount.IsBlank())
                taxSvc.Configuration.Security.Account = taxServiceAccount;
            if (!taxServiceLicense.IsBlank())
                taxSvc.Configuration.Security.License = taxServiceLicense;
            return taxSvc;
        }

        /// <summary>The get calc tax request from order.</summary>
        /// <param name="originAddress">The origin address</param>
        /// <param name="customerOrder">The customer order.</param>
        /// <param name="storePickup">The store pickup.</param>
        /// <param name="requestDocType">The request doc type.</param>
        /// <returns>The <see cref="T:Avalara.AvaTax.Adapter.TaxService.GetTaxRequest" />.</returns>
        protected virtual GetTaxRequest GetCalcTaxRequestFromOrder(OriginAddress originAddress, CustomerOrder customerOrder, bool storePickup, DocumentType requestDocType)
        {
            var companyCode = AvalaraSettings.CompanyCode;
            var freightTaxCode = AvalaraSettings.FreightTaxCode;
            var discountFreightOnOrder = AvalaraSettings.DiscountFreightOnOrder;
            var orderDiscountTotal = CustomerOrderUtilities.GetPromotionOrderDiscountTotal(customerOrder);
            var num1 = CustomerOrderUtilities.GetPromotionShippingDiscountTotal(customerOrder);
            if (discountFreightOnOrder)
            {
                orderDiscountTotal += num1;
                num1 = new decimal();
            }
            var flag1 = orderDiscountTotal != decimal.Zero;
            var flag2 = num1 != decimal.Zero;
            var getTaxRequest1 = new GetTaxRequest();
            var address1 = new Address();
            address1.Line1 = originAddress.Address1;
            address1.Line2 = originAddress.Address2;
            address1.Line3 = originAddress.Address3;
            address1.City = originAddress.City;
            address1.Region = originAddress.Region;
            address1.PostalCode = originAddress.PostalCode;
            var country1 = originAddress.Country;
            var str1 = country1 != null ? country1.IsoCode2 : null;
            address1.Country = str1;
            var address2 = address1;
            getTaxRequest1.OriginAddress = address2;
            if (address2.Line1.IsBlank())
                throw new InvalidOperationException("The origin address for tax purposes does not have a proper address. In order to calculate tax this must be set up.");
            Address address3;
            if (storePickup)
            {
                address3 = address2.Clone();
            }
            else
            {
                var address4 = new Address();
                address4.Line1 = customerOrder.STAddress1;
                address4.Line2 = customerOrder.STAddress2;
                address4.Line3 = customerOrder.STAddress3;
                address4.City = customerOrder.STCity;
                address4.Region = customerOrder.STState;
                address4.PostalCode = customerOrder.STPostalCode;
                var shipTo = customerOrder.ShipTo;
                string str2;
                if (shipTo == null)
                {
                    str2 = null;
                }
                else
                {
                    var country2 = shipTo.Country;
                    str2 = country2 != null ? country2.IsoCode2 : null;
                }
                if (str2 == null)
                    str2 = customerOrder.STCountry;
                address4.Country = str2;
                address3 = address4;
            }
            getTaxRequest1.DestinationAddress = address3;
            foreach (var orderLine in customerOrder.OrderLines)
            {
                if (!(customerOrder.Type != "Quote") || !orderLine.Product.IsQuoteRequired)
                {
                    var isActive = OrderLineUtilities.GetIsActive(orderLine);
                    if (!(orderLine.Status == "Void") && orderLine.Release <= 1 && isActive)
                    {
                        var line1 = new Line();
                        line1.No = orderLine.Line.ToString();
                        line1.ItemCode = orderLine.Product.ErpNumber;
                        line1.Qty = (double)orderLine.QtyOrdered;
                        line1.Amount = OrderLineUtilities.GetTotalNetPrice(orderLine);
                        var num2 = flag1 ? 1 : 0;
                        line1.Discounted = num2 != 0;
                        var shortDescription = orderLine.Product.ShortDescription;
                        line1.Description = shortDescription;
                        var taxCode1 = orderLine.TaxCode1;
                        line1.TaxCode = taxCode1;
                        var line2 = line1;
                        getTaxRequest1.Lines.Add(line2);
                    }
                }
            }
            if (!storePickup)
            {
                var line1 = new Line();
                line1.No = "Freight";
                line1.ItemCode = "Freight";
                line1.Qty = 1.0;
                var num2 = customerOrder.ShippingCharges - num1;
                line1.Amount = num2;
                var num3 = flag2 ? 1 : 0;
                line1.Discounted = num3 != 0;
                var str2 = "Freight";
                line1.Description = str2;
                var str3 = freightTaxCode;
                line1.TaxCode = str3;
                var line2 = line1;
                getTaxRequest1.Lines.Add(line2);
            }
            getTaxRequest1.CompanyCode = companyCode;
            getTaxRequest1.DocCode = customerOrder.OrderNumber;
            getTaxRequest1.DocDate = customerOrder.OrderDate.UtcDateTime;
            getTaxRequest1.DocType = requestDocType;
            getTaxRequest1.Discount = orderDiscountTotal;
            getTaxRequest1.CustomerCode = customerOrder.CustomerNumber;
            getTaxRequest1.CustomerUsageType = customerOrder.TaxCode1;
            var getTaxRequest2 = getTaxRequest1;
            var currency = customerOrder.Currency;
            var str4 = (currency != null ? currency.CurrencyCode : null) ?? string.Empty;
            getTaxRequest2.CurrencyCode = str4;
            return getTaxRequest1;
        }

        /// <summary>The get post tax request from order.</summary>
        /// <param name="customerOrder">The customer order.</param>
        /// <returns>The <see cref="T:Avalara.AvaTax.Adapter.TaxService.PostTaxRequest" />.</returns>
        protected virtual PostTaxRequest GetPostTaxRequestFromOrder(CustomerOrder customerOrder)
        {
            var totalTax = CustomerOrderUtilities.GetTotalTax(customerOrder);
            var postTaxRequest = new PostTaxRequest();
            postTaxRequest.Commit = true;
            var companyCode = AvalaraSettings.CompanyCode;
            postTaxRequest.CompanyCode = companyCode;
            var orderNumber = customerOrder.OrderNumber;
            postTaxRequest.DocCode = orderNumber;
            var utcDateTime = customerOrder.OrderDate.UtcDateTime;
            postTaxRequest.DocDate = utcDateTime;
            var num1 = 1;
            postTaxRequest.DocType = (DocumentType)num1;
            var empty = string.Empty;
            postTaxRequest.NewDocCode = empty;
            var num2 = NumberHelper.RoundCurrency(CustomerOrderUtilities.GetOrderTotal(customerOrder) - totalTax);
            postTaxRequest.TotalAmount = num2;
            var num3 = totalTax;
            postTaxRequest.TotalTax = num3;
            return postTaxRequest;
        }

        /// <summary>The process avalara response message.</summary>
        /// <param name="result">The result.</param>
        /// <returns>The <see cref="T:System.String" />.</returns>
        private string ProcessAvalaraResponseMessage(BaseResult result)
        {
            var stringBuilder = new StringBuilder();
            if (result.ResultCode == SeverityLevel.Success)
                return stringBuilder.ToString();
            foreach (Avalara.AvaTax.Adapter.Message message in result.Messages)
            {
                if (_addressErrorMessages.Contains(message.Name))
                {
                    LogHelper.For(this).Error($"{(object) message.Name} - {(object) message.Details}", "TaxCalculator_Avalara");
                    throw new HttpException(400, typeof(InvalidAddressException).ToString());
                }
                stringBuilder.AppendLine("Name: " + message.Name);
                stringBuilder.AppendLine("Severity: " + message.Severity);
                stringBuilder.AppendLine("Summary: " + message.Summary);
                stringBuilder.AppendLine("Details: " + message.Details);
                stringBuilder.AppendLine("Source: " + message.Source);
                stringBuilder.AppendLine("RefersTo: " + message.RefersTo);
                stringBuilder.AppendLine("HelpLink: " + message.HelpLink);
            }
            if (result.ResultCode != SeverityLevel.Error && result.ResultCode != SeverityLevel.Exception)
                return stringBuilder.ToString();
            throw new Exception(stringBuilder.ToString());
        }

        protected virtual string SerializeObject(object value)
        {
            return new JavaScriptSerializer().Serialize(value);
        }
    }
}
