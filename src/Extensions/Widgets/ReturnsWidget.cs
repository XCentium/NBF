﻿using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Returns Widget")]
    public class ReturnsWidget : ContentWidget
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

        //[ListContentField(DisplayName = "Available Preferences (Note: Use default single option for 'Catalog Request Page')", IsRequired = true)]
        //public virtual List<string> Preferences
        //{
        //    get
        //    { 
        //        return this.GetValue<List<string>>("Preferences", new List<string>() { "New Catalog Request" }, FieldType.Contextual);
        //    }
        //    set
        //    {
        //        this.SetValue<List<string>>("Preferences", value, FieldType.Contextual);
        //    }
        //}

        //public virtual int PreferencesCount
        //{
        //    get
        //    {
        //        return this.Preferences.Count;
        //    }
        //}

        //public virtual string PreferencesFirstItem
        //{
        //    get
        //    {
        //        return this.Preferences.Any() ? this.Preferences.First() : string.Empty;
        //    }
        //}

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
