using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Product CTA")]
    public class ProductCTA : ContentWidget
    {
        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 10)]
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

        [DropDownContentField(new string[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, IsRequired = true, SortOrder = 20)]
        public virtual string Position
        {
            get
            {
                return this.GetValue<string>("Position", "Bottom Right", FieldType.General).Replace(" ", "").ToLower();
            }
            set
            {
                this.SetValue<string>("Position", value, FieldType.General);
            }
        }
        [DropDownContentField(new string[] { "White", "Navy" }, IsRequired = true, SortOrder = 30)]
        public virtual string Style
        {
            get
            {
                return this.GetValue<string>("Style", "Navy", FieldType.General);
            }
            set
            {
                this.SetValue<string>("Style", value, FieldType.General);
            }
        }

        [TextContentField(IsRequired = true, SortOrder = 40)]
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

        [TextContentField(IsRequired = true, SortOrder = 50)]
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
    }
}
