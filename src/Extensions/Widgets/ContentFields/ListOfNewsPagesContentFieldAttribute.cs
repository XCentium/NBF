using Insite.ContentLibrary.Pages;
using Insite.WebFramework.Content.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Extensions.Widgets.ContentFields
{
    public class ListOfNewsPagesContentFieldAttribute: ContentFieldAttribute
    {
        public ListOfNewsPagesContentFieldAttribute()
        {
            this.Template = "~/Extensions/Views/ContentItemFields/ListOfNewsPages.cshtml";            
        }
    }
}