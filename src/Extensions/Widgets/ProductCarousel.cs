using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Product Carousel")]
    public class ProductCarousel : FeaturedProducts
    {
        [TextContentField(IsRequired = false, SortOrder = 10)]
        public override string Title
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
        public override string AllCategoriesText => null;

        public override string AllCategoriesUrl => null;
    }
}