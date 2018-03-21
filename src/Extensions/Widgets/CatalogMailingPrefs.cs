using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Catalog Mailing Preferences Widget")]
    public class CatalogMailingPrefs : ContentWidget
    {
        [RichTextContentField(IsRequired = true)]
        public virtual string SuccessMessage
        {
            get
            {
                return this.GetValue<string>("SuccessMessage", "<p>Your message has been sent.</p>", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("SuccessMessage", value, FieldType.Contextual);
            }
        }

        [ListContentField(DisplayName = "Send Email To", InvalidRegExMessage = "Invalid Email Address", IsRequired = true, RegExValidation = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*")]
        public virtual List<string> EmailTo
        {
            get
            {
                return this.GetValue<List<string>>("EmailTo", new List<string>(), FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>("EmailTo", value, FieldType.Contextual);
            }
        }

        public virtual string EmailToValue
        {
            get
            {
                return string.Join(",", this.EmailTo.ToArray());
            }
        }

        [ListContentField(DisplayName = "Available Topics", IsRequired = true)]
        public virtual List<string> Topics
        {
            get
            {
                return this.GetValue<List<string>>("Topics", new List<string>(), FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>("Topics", value, FieldType.Contextual);
            }
        }              
    }
}
