using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.WebFramework.Content.Attributes;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [AllowedParents(typeof(Header))]
    [DisplayName("NBF - Navigation Fly Out")]
    public class NavigationFlyOut : NavigationList
    {
        [TextContentField]
        public virtual string Text
        {
            get
            {
                return GetValue("Text", "", FieldType.Contextual);
            }
            set
            {
                SetValue("Text", value, FieldType.Contextual);
            }
        }

        public bool TextExists => !Text.IsNullOrWhiteSpace();

        [CheckBoxContentField(DisplayName = "Link To Root Page", SortOrder = 110)]
        public virtual bool LinkRootPage
        {
            get
            {
                return GetValue("LinkRootPage", true, FieldType.General);
            }
            set
            {
                SetValue("LinkRootPage", value, FieldType.General);
            }
        }

        public virtual string RootPageUrl
        {
            get
            {
                return GetPerRequestValue<string>("RootPageUrl");
            }
            set
            {
                SetPerRequestValue("RootPageUrl", value);
            }
        }
    }
}
