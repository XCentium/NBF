using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Featured Products")]
    public class FeaturedProducts : ContentWidget
    {
        [TextContentField(IsRequired = true, SortOrder = 10)]
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

        [ListContentField]
        [DisplayName("Enter Product Numbers")]
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

        public virtual string ProductNumbersString => string.Join(":", ProductNumbers.ToArray());

        [TextContentField(IsRequired = true, SortOrder = 100)]
        [DisplayName("All Categories Text")]
        public virtual string AllCategoriesText
        {
            get
            {
                return this.GetValue<string>(nameof(AllCategoriesText), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(AllCategoriesText), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 105)]
        [DisplayName("All Categories URL")]
        public virtual string AllCategoriesUrl
        {
            get
            {
                return this.GetValue<string>(nameof(AllCategoriesUrl), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(AllCategoriesUrl), value, FieldType.Contextual);
            }
        }
    }
}
