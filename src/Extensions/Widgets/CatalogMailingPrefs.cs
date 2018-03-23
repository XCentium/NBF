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

        [ListContentField(DisplayName = "Available Preferences", IsRequired = true)]
        public virtual List<string> Preferences
        {
            get
            {
                return this.GetValue<List<string>>("Preferences", new List<string>(), FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>("Preferences", value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName ="Submit Button Text")]
        public virtual string SubmitButtonText
        {
            get
            {
                return this.GetValue<string>("SubmitButtonText", "Submit", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("SubmitButtonText", value, FieldType.Contextual);
            }
        }
    }
}
