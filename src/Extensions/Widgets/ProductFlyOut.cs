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
    [DisplayName("NBF - Product Catalog Fly Out")]
    public class ProductFlyOut : ContentWidget
    {
        public virtual ProductFlyOutDrop Drop
        {
            get
            {
                return GetPerRequestValue<ProductFlyOutDrop>("Drop");
            }
            set
            {
                SetPerRequestValue("Drop", value);
            }
        }

        [DropDownContentField(new[] { "All Categories", "By-Area Categories Only", "No By-Area Categories" }, IsRequired = true, SortOrder = 110)]
        public virtual string CategoryFilter
        {
            get
            {
                return GetValue("CategoryFilter", "All Categories", FieldType.General);
            }
            set
            {
                SetValue("CategoryFilter", value, FieldType.General);
            }
        }

        [SelectedPageContentField(DisplayName = "Landing Page", IsRequired = false)]
        public virtual string LandingPageName
        {
            get
            {
                return GetValue("LandingPageName", string.Empty, FieldType.General);
            }
            set
            {
                SetValue("LandingPageName", value, FieldType.General);
            }
        }

        public virtual string LandingPageUrl
        {
            get
            {
                return GetPerRequestValue<string>("LandingPageUrl");
            }
            set
            {
                SetPerRequestValue("LandingPageUrl", value);
            }
        }

        public virtual bool HasUrl => !LandingPageUrl.IsNullOrWhiteSpace();
    }
}