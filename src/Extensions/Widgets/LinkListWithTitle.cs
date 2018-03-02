using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using System.ComponentModel;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Link List With Title")]
    public class LinkListWithTitle : LinkList
    {
        [TextContentField]
        public virtual string Title
        {
            get
            {
                return GetValue(nameof(Title), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Title), value, FieldType.Contextual);
            }
        }

        public override string Direction => "Vertical";


        [DisplayName("Landing Page - Navigation Fly Out Template Only")]
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
