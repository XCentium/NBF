using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;
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
                return this.GetValue<string>("Link", "http://www.bbb.org/wisconsin/business-reviews/office-furniture-and-equipment/national-business-furniture-llc-in-milwaukee-wi-23000085/#bbbonlineclick", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("Link", value, FieldType.Contextual);
            }
        }

        [TextContentField]
        public virtual string ImageSource
        {
            get
            {
                return this.GetValue<string>("ImageSource", "https://seal-wisconsin.bbb.org/seals/blue-seal-250-52-national-business-furniture-llc-23000085.png", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("ImageSource", value, FieldType.Contextual);
            }
        }

        [TextContentField]
        public virtual string AltText
        {
            get
            {
                return this.GetValue<string>("AltText", "National Business Furniture, LLC BBB Business Review", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("AltText", value, FieldType.Contextual);
            }
        }
    }
}