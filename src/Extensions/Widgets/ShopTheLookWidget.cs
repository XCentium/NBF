using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Shop The Look Widget")]
    public class ShopTheLookWidget : ContentWidget
    {
        [RichTextContentField(IsRequired = true)]
        public virtual string NoResultsContent
        {
            get
            {
                return GetValue("NoResultsContent", "Sorry, this look could not be found. <br /><a href='/shop-the-look'>Return to Looks</a>", FieldType.Contextual);
            }
            set
            {
                SetValue("NoResultsContent", value, FieldType.Contextual);
            }
        }
    }
}
