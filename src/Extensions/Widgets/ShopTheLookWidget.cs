using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Shop The Look Widget")]
    public class ShopTheLookWidget : ContentWidget
    {
        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 10)]
        [DisplayName("Background Image")]
        public virtual string BackgroundImage
        {
            get
            {
                return this.GetValue<string>(nameof(BackgroundImage), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(BackgroundImage), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 20)]
        [DisplayName("Title")]
        public virtual string Title
        {
            get
            {
                return this.GetValue<string>(nameof(Title), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 30)]
        [DisplayName("Sub Title")]
        public virtual string SubTitle
        {
            get
            {
                return this.GetValue<string>(nameof(SubTitle), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SubTitle), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 35)]
        [DisplayName("Button Url")]
        public virtual string ButtonUrl
        {
            get
            {
                return this.GetValue<string>(nameof(ButtonUrl), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ButtonUrl), value, FieldType.Contextual);
            }
        }

        [ListContentField(DisplayName="Enter upto 3 Product Ids", SortOrder = 40)]
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

        public virtual string ProductString => string.Join(":", ProductIds.ToArray());

        [TextContentField(SortOrder = 50)]
        [DisplayName("Product #1 Hotspot Position")]
        public virtual string Product1HotspotPosition
        {
            get
            {
                return this.GetValue<string>(nameof(Product1HotspotPosition), "top:23%; left:78%;", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Product1HotspotPosition), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 60)]
        [DisplayName("Product #2 Hotspot Position")]
        public virtual string Product2HotspotPosition
        {
            get
            {
                return this.GetValue<string>(nameof(Product2HotspotPosition), "top:79%; left:23%;", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Product2HotspotPosition), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 70)]
        [DisplayName("Product #3 Hotspot Position")]
        public virtual string Product3HotspotPosition
        {
            get
            {
                return this.GetValue<string>(nameof(Product3HotspotPosition), "top:50%; left:50%;", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Product3HotspotPosition), value, FieldType.Contextual);
            }
        }

    }
}
