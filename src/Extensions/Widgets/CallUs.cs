using System.Collections.Generic;
using System.ComponentModel;
using Extensions.Widgets.ContentFields;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Call Us")]
    public class CallUs : ContentWidget
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

        [CheckBoxContentField(DisplayName = "Link Phone Number", SortOrder = 110)]
        public virtual bool LinkPhoneNumber
        {
            get
            {
                return GetValue("LinkPhoneNumber", true, FieldType.General);
            }
            set
            {
                SetValue("LinkPhoneNumber", value, FieldType.General);
            }
        }

        public bool TextExists => !Text.IsNullOrWhiteSpace();

        public virtual string CustomerServicePhone
        {
            get
            {
                return GetPerRequestValue<string>("CustomerServicePhone");
            }
            set
            {
                SetPerRequestValue("CustomerServicePhone", value);
            }
        }        
    }
}