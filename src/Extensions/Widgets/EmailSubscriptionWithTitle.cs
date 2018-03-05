using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Subscribe to Email List")]
    public class EmailSubscriptionWithTitle : EmailSubscription
    {
        [TextContentField]
        public virtual string Title
        {
            get
            {
                return this.GetValue<string>(nameof(Title), "Sign Up To Get The Latest From NBF", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title), value, FieldType.Contextual);
            }
        }
    }
}