using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Providers;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Web Code")]
    public class WebCode : ContentWidget
    {
        [TextContentField]
        public virtual string Text
        {
            get
            {
                return GetValue("Text", "Web Code: ", FieldType.Contextual);
            }
            set
            {
                SetValue("Text", value, FieldType.Contextual);
            }
        }
    }
}