using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Shop The Look Landing Page View")]
    public class ShopTheLookLandingView : ContentWidget
    {
        [RichTextContentField(IsRequired = true)]
        public virtual string NoResultsContent
        {
            get
            {
                return GetValue("NoResultsContent", "No Looks Found.", FieldType.Contextual);
            }
            set
            {
                SetValue("NoResultsContent", value, FieldType.Contextual);
            }
        }
    }
}
