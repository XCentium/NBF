using Insite.Catalog.Services;
using Insite.Core.Context;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using System;
using Extensions.Handlers.Interfaces;
using Insite.Core.Localization;
using Insite.Order.Services;
using System.Web;
using System.Dynamic;
using Insite.Core.Interfaces.Plugins.Emails;
using System.Net.Http;
using Microsoft.Owin.Security;
using System.Collections.Generic;

namespace Extensions.Handlers.Helpers
{
    public class NBFListrakHelper : INbfListrakHelper, IDependency
    {
        protected readonly Lazy<IProductService> ProductService;
        protected readonly Lazy<IShipmentService> ShipmentService;
        protected readonly Lazy<IEntityTranslationService> EntityTranslationService;

        public NBFListrakHelper(Lazy<IProductService> productService, Lazy<IShipmentService> shipmentService, Lazy<IEntityTranslationService> entityTranslationService)
        {
            this.ProductService = productService;
            this.ShipmentService = shipmentService;
            this.EntityTranslationService = entityTranslationService;
        }

        public virtual bool SendTransactionalEmail(ExpandoObject templateData, SendEmailParameter sendEmailParameter, IUnitOfWork unitOfWork)
        {
            var a = ProcessSendTransactionalEmail();
            //var userProfile = SiteContext.Current.UserProfileDto;
            //var url = HttpContext.Current.Request.Url;
            //dynamic emailData = new ExpandoObject();
            //emailData.FirstName = userProfile.FirstName ?? string.Empty;
            //emailData.LastName = userProfile.LastName ?? string.Empty;
            //emailData.Email = userProfile.Email;
            //emailData.WebsiteUrl = $"{url.Scheme}://{url.Authority}";
            return true;
        }

        private bool ProcessSendTransactionalEmail()
        {
            var token = GetOAuthToken();
            var client = new HttpClient();

            client.BaseAddress = new Uri("https://auth.listrak.com/OAuth2/Token");
            //client.DefaultRequestHeaders.Add("Content-Type", "client_credentials");
            //client.

            //var response = await client.PostAsJsonAsync("v1/List/{listId}/TransactionalMessage/{transactionalMessageId}/Message", new
            //{
            //    EmailAddress = null,
            //    SegmentationFieldValues = null
            //});
            return true;
        }

        private async System.Threading.Tasks.Task<string> GetOAuthToken()
        {
            var args = new List<KeyValuePair<string, string>>();
            args.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            args.Add(new KeyValuePair<string, string>("client_id", "NzgzY2YzMTM5YWI5NDZjYzgxMzI2MDk1YTRkMzY2ZWE"));
            args.Add(new KeyValuePair<string, string>("client_secret", "KTOXL98C7ywp1pH3yQZvSqjiWnn0JveQ8+5+av3+bts"));
            var client = new HttpClient();
            var request = new HttpRequestMessage();
            request.Content = new FormUrlEncodedContent(args);
            request.Method = HttpMethod.Post;
            client.BaseAddress = new Uri("https://auth.listrak.com/OAuth2/Token");
           // request.Headers.Add("Content-Type", "client_credentials");

            var responseString = string.Empty;
            try
            {
                HttpResponseMessage response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                HttpContent httpContent = response.Content;
                responseString = await httpContent.ReadAsStringAsync();

            }
            catch (Exception ex)
            {

            }


            return "";
        }
    }
}
