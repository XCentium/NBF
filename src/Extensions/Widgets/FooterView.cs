using System;
using System.ComponentModel;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.WebFramework.Content.Attributes;

namespace Extensions.Widgets
{
    [AllowedParents(new Type[] { typeof(Footer) })]
    [DisplayName("NBF - Footer View")]
    public class FooterView : ContentWidget
    {
    }
}
