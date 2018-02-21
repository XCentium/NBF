using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework.Content.Attributes;
using System;

namespace Extensions.Widgets
{
    [AllowedParents(new Type[] { typeof(Footer) })]
    public class FooterView : ContentWidget
    {
    }
}
