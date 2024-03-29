﻿using System.Collections.Generic;
using Insite.ContentLibrary.ContentFields;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Shop The Look CTA")]
    public class ShopTheLookCta : ShopTheLookWidget
    {

        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 10)]
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

        [TextContentField(SortOrder = 20)]
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

        [ListContentField(DisplayName = "Enter Product Numbers and Hotspot Positions in the following template: PRODUCTNUMBER;top:XX%;left:XX%", SortOrder = 40)]
        public virtual List<string> ProductNumbers
        {
            get
            {
                return GetValue(nameof(ProductNumbers), new List<string>(), FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ProductNumbers), value, FieldType.Contextual);
            }
        }

        public virtual string ProductString => string.Join("||", ProductNumbers.ToArray());
    }
}
