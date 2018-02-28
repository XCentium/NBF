using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    public class PopularCategories : ContentWidget
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

        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 20)]
        [DisplayName("Background Image for Category #1")]
        public virtual string BackgroundImage1
        {
            get
            {
                return this.GetValue<string>(nameof(BackgroundImage1), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(BackgroundImage1), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 30)]
        [DisplayName("Category #1")]
        public virtual string Category1
        {
            get
            {
                return this.GetValue<string>(nameof(Category1), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category1), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 35)]
        [DisplayName("Category #1 URL")]
        public virtual string Category1Url
        {
            get
            {
                return this.GetValue<string>(nameof(Category1Url), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category1Url), value, FieldType.Contextual);
            }
        }

        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 40)]
        [DisplayName("Background Image for Category #2")]
        public virtual string BackgroundImage2
        {
            get
            {
                return this.GetValue<string>(nameof(BackgroundImage2), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(BackgroundImage2), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 50)]
        [DisplayName("Category #2")]
        public virtual string Category2
        {
            get
            {
                return this.GetValue<string>(nameof(Category2), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category2), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 55)]
        [DisplayName("Category #2 URL")]
        public virtual string Category2Url
        {
            get
            {
                return this.GetValue<string>(nameof(Category2Url), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category2Url), value, FieldType.Contextual);
            }
        }

        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 60)]
        [DisplayName("Background Image for Category #3")]
        public virtual string BackgroundImage3
        {
            get
            {
                return this.GetValue<string>(nameof(BackgroundImage3), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(BackgroundImage3), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 70)]
        [DisplayName("Category #3")]
        public virtual string Category3
        {
            get
            {
                return this.GetValue<string>(nameof(Category3), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category3), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 75)]
        [DisplayName("Category #3 URL")]
        public virtual string Category3Url
        {
            get
            {
                return this.GetValue<string>(nameof(Category3Url), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category3Url), value, FieldType.Contextual);
            }
        }

        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 80)]
        [DisplayName("Background Image for Category #4")]
        public virtual string BackgroundImage4
        {
            get
            {
                return this.GetValue<string>(nameof(BackgroundImage4), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(BackgroundImage4), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 90)]
        [DisplayName("Category #4")]
        public virtual string Category4
        {
            get
            {
                return this.GetValue<string>(nameof(Category4), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category4), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 95)]
        [DisplayName("Category #4 URL")]
        public virtual string Category4Url
        {
            get
            {
                return this.GetValue<string>(nameof(Category4Url), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Category4Url), value, FieldType.Contextual);
            }
        }

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
