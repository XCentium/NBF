using System;
using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Better Business Bureau Plugin")]
    public class BetterBusinessBureau : ContentWidget
    {
        [TextContentField]
        public virtual string Link
        {
            get
            {
                return GetValue("Link", "http://www.bbb.org/wisconsin/business-reviews/office-furniture-and-equipment/national-business-furniture-llc-in-milwaukee-wi-23000085/#bbbonlineclick", FieldType.Contextual);
            }
            set
            {
                SetValue("Link", value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true)]
        public virtual string ImageSource
        {
            get
            {
                return GetValue("ImageSource", "https://seal-wisconsin.bbb.org/seals/blue-seal-250-52-national-business-furniture-llc-23000085.png", FieldType.Contextual);
            }
            set
            {
                SetValue("ImageSource", value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true)]
        public virtual string AltText
        {
            get
            {
                return GetValue("AltText", "National Business Furniture, LLC BBB Business Review", FieldType.Contextual);
            }
            set
            {
                SetValue("AltText", value, FieldType.Contextual);
            }
        }

        public virtual bool IsLinkProvided => !Link.IsBlank();
    }
}