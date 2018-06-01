using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.WebApi.AnalyticsPages.Models
{
    public class AnalyticsPageDto
    {
        public string Url { get; set; }
        public string PageName { get; set; }
        public string Section { get; set; }
        public string SubSection { get; set; }
        public string PageType { get; set; }
    }
}