using Insite.Cart.Services.Results;
using Insite.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Extensions.Handlers.Helpers
{
    public static class NBFHtmlHelper
    {
        public static string GetBillToShipToHtml(UpdateCartResult order)
        {
            var table = new TagBuilder("table");
            var tr = new TagBuilder("tr");
            var td = new TagBuilder("td");
            var containerDiv = new TagBuilder("div");
            var h4 = new TagBuilder("h4");

            // Billing Info

            h4.InnerHtml = "Billing Information";
            containerDiv.InnerHtml = h4.ToString();

            var innerDiv = new TagBuilder("div");

            if (! string.IsNullOrEmpty(order.GetCartResult.Cart.BTCompanyName))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.BTCompanyName + "<br />";
            }
            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.BTAddress1))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.BTAddress1 + "<br />";
            }
            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.BTAddress2))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.BTAddress2 + "<br />";
            }
            innerDiv.InnerHtml += order.GetCartResult.Cart.BTCity + ", " + order.GetCartResult.Cart.BTState + " " + order.GetCartResult.Cart.BTPostalCode;
            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.BTPhone))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.BTPhone + "<br />";
            }

            containerDiv.InnerHtml += innerDiv.ToString();
            td.InnerHtml = containerDiv.ToString();
            tr.InnerHtml = td.ToString();
            table.InnerHtml = tr.ToString();

            // Shipping Info

            h4.InnerHtml = "Shipping Information";
            containerDiv.InnerHtml = h4.ToString();

            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.STCompanyName))
            {
                innerDiv.InnerHtml = order.GetCartResult.Cart.STCompanyName + "<br />";
            }
            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.STAddress1))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.STAddress1 + "<br />";
            }
            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.STAddress2))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.STAddress2 + "<br />";
            }
            innerDiv.InnerHtml += order.GetCartResult.Cart.STCity + ", " + order.GetCartResult.Cart.STState + " " + order.GetCartResult.Cart.STPostalCode;
            if (!string.IsNullOrEmpty(order.GetCartResult.Cart.STPhone))
            {
                innerDiv.InnerHtml += order.GetCartResult.Cart.STPhone + "<br />";
            }

            containerDiv.InnerHtml += innerDiv.ToString();
            td.InnerHtml = containerDiv.ToString();
            tr.InnerHtml = td.ToString();
            table.InnerHtml += tr.ToString();
            return table.ToString();
        }

        private static string GetFieldValue(string field)
        {
            return (string.IsNullOrEmpty(field)) ? string.Empty : field;
        }
    }
}