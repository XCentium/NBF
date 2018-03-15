using Insite.ContentLibrary.ContentFields;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Shop The Look CTA")]
    public class ShopTheLookCta : ShopTheLookWidget
    {
        [TextContentField(SortOrder = 30)]
        [DisplayName("Sub Title")]
        public virtual string SubTitle
        {
            get
            {
                return GetValue(nameof(SubTitle), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(SubTitle), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 35)]
        [DisplayName("Button Url")]
        public virtual string ButtonUrl
        {
            get
            {
                return GetValue(nameof(ButtonUrl), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ButtonUrl), value, FieldType.Contextual);
            }
        }
    }
}
