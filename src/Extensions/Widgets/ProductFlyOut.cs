using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Pages;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using Insite.WebFramework.Content.Attributes;

namespace Extensions.Widgets
{
    [AllowedParents(typeof(Header))]
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

        [RichTextContentField(DisplayName = "Additional Content", IsRequired = false)]
        public virtual string AdditionalContent
        {
            get
            {
                return GetValue("AdditionalContent", "<ul class='res-nav-group sub-tier-panel'><li class='sub-heading'>By Area:</li>" 
                    + "<li><a href = '#' onclick='insite.nav.hideMenu();'>Public Spaces/ Reception</a></li>"
                    + "<li><a href = '#' onclick='insite.nav.hideMenu();'>Conference Room</a></li>"
                    + "<li><a href = '#' onclick= 'insite.nav.hideMenu();' > Break Room</a></li>"
                    + "<li><a href = '#' onclick= 'insite.nav.hideMenu();' > Out Door Furniture</a></li>"
                    + "<li><a href = '#' onclick= 'insite.nav.hideMenu();' > Class & Training Room</a></li>"
                    + "<li><a href = '#' onclick= 'insite.nav.hideMenu();' > Collaborative Spaces</a></li>"
                    + "</ul>"
                    + "<ul class='res-nav-group sub-tier-panel'>"
                    + "<li class='sub-heading'>Resources:</li>"
                    + "<li><a href = '#' onclick='insite.nav.hideMenu();'>Space Planning Guides</a></li>"
                    + "<li><a href = '#' onclick='insite.nav.hideMenu();'>Design Guides</a></li>"
                    + "<li><a href = '#' onclick= 'insite.nav.hideMenu();' > Samples Requests</a></li>"
                    + "</ul>", FieldType.Contextual);
            }
            set
            {
                SetValue("AdditionalContent", value, FieldType.Contextual);
            }
        }
    }
}