using Insite.Core.Interfaces.Dependency;
using System;
using Extensions.Handlers.Interfaces;
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Collections;
using Extensions.WebApi.Listrak.Models;
using System.Reflection;
using System.ComponentModel;
using Extensions.Enums.Listrak;

namespace Extensions.Handlers.Helpers
{
    public class SegmentationFieldValue
    {
        public int SegmentationFieldId { get; set; }
        public string Value { get; set; }
    }

    public class NBFListrakHelper : INbfListrakHelper, IDependency
    {
        public NBFListrakHelper()
        {
        }

        public virtual async Task<bool> SendTransactionalEmail(SendTransationalMessageParameter parameter)
        {
            var a = await ProcessSendTransactionalEmail(parameter);
            return a;
        }

        public virtual async Task<bool> CreateOrUpdateContact(CreateOrUpdateContactParameter parameter)
        {
            var a = await ProcessCreateOrUpdateContact(parameter);
            return a;
        }

        public async Task<bool> ProcessSendTransactionalEmail(SendTransationalMessageParameter parameter)
        {
            var token = await GetOAuthToken();
            var client = new HttpClient();

            client.BaseAddress = new Uri("https://api.listrak.com/email/");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
            var segmentationFieldValues = new ArrayList();
            foreach (var field in parameter.SegmentationFields)
            {
                var fieldValue = new SegmentationFieldValue()
                {
                    SegmentationFieldId = field.SegmentationFieldId,
                    Value = "<![CDATA[" + field.Value
                };
                segmentationFieldValues.Add(fieldValue);
            }
            var transactionalMessageId = parameter.Message.GetId();
            var response = await client.PostAsJsonAsync(string.Format("v1/List/346046/TransactionalMessage/{0}/Message", transactionalMessageId), new
            {
                EmailAddress = parameter.EmailAddress,
                SegmentationFieldValues = segmentationFieldValues
            });

            return true;
        }

        public async Task<bool> ProcessCreateOrUpdateContact(CreateOrUpdateContactParameter parameter)
        {
            var token = await GetOAuthToken();
            var client = new HttpClient();
            client.BaseAddress = new Uri("https://api.listrak.com/email/");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
            var segmentationFieldValues = new ArrayList();
            //var fieldValue = new SegmentationFieldValue()
            //{
            //    SegmentationFieldId = 1890,
            //    Value = "true"
            //};
            //segmentationFieldValues.Add(fieldValue);
            var eventType = EventIdEnum.Account;
            if (parameter.EventId == "footer") { eventType = EventIdEnum.Footer; }
            if (parameter.EventId == "account") { eventType = EventIdEnum.Account; }
            if (parameter.EventId == "contact") { eventType = EventIdEnum.Contact; }
            if (parameter.EventId == "modal") { eventType = EventIdEnum.Modal; }

            var eventId = eventType.GetId();
            var queryString = "?eventIds=" + eventId;
            queryString += string.Format("&overrideUnsubscribe={0}", parameter.OverrideUnsubscribe.ToString());
            queryString += string.Format("&subscribedByContact={0}", parameter.SubscribedByContact.ToString());
            var response = await client.PostAsJsonAsync(string.Format("v1/List/346046/Contact{0}", queryString), new
            {
                EmailAddress = parameter.EmailAddress,
                SegmentationFieldValues = segmentationFieldValues
            });
            response.EnsureSuccessStatusCode();
            return true;
        }

        private async Task<string> GetOAuthToken()
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
            var responseData = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(responseString);
            
            return responseData["access_token"];
        }
    }

    public static class DescriptionExtensions
    {
        public static int GetId(this Enum value)
        {
            int enumId = 0;
            if (value == null)
            {
                throw new ArgumentNullException("value");
            }

            string description = value.ToString();
            FieldInfo fieldInfo = value.GetType().GetField(description);
            DescriptionAttribute[] attributes =
               (DescriptionAttribute[])
             fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false);

            if (attributes != null && attributes.Length > 0)
            {
                description = attributes[0].Description;
            }

            int.TryParse(description, out enumId);
            return enumId;
        }
    }
}