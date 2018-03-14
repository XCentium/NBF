using System.Collections.Generic;
using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Shop The Look Widget")]
    public class ShopTheLookWidget : ContentWidget
    {
        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 10)]
        [DisplayName("Background Image")]
        public virtual string BackgroundImage
        {
            get
            {
                return GetValue(nameof(BackgroundImage), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(BackgroundImage), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 20)]
        [DisplayName("Title")]
        public virtual string Title
        {
            get
            {
                return GetValue(nameof(Title), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Title), value, FieldType.Contextual);
            }
        }

        [ListContentField(DisplayName = "Enter ProductIds and Hotspot Positions in the following template: ProductId;top:XX%;left:XX%", SortOrder = 40)]
        public virtual List<string> ProductIds
        {
            get
            {
                return GetValue(nameof(ProductIds), new List<string>(), FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ProductIds), value, FieldType.Contextual);
            }
        }

        public virtual string ProductAndHotSpotString => string.Join("||", ProductIds.ToArray());
    }
}
