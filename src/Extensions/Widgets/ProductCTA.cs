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
                return GetValue(nameof(BackgroundImage), string.Empty, FieldType.General);
            }
            set
            {
                SetValue(nameof(BackgroundImage), value, FieldType.General);
            }
        }

        [DropDownContentField(new[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, IsRequired = true, SortOrder = 20)]
        public virtual string Position
        {
            get
            {
                return GetValue("Position", "Bottom Right", FieldType.General);
            }
            set
            {
                SetValue("Position", value, FieldType.General);
            }
        }

        public virtual string PositionFormatted => Position.Replace(" ", "").ToLower();

        [DropDownContentField(new[] { "White", "Navy" }, IsRequired = true, SortOrder = 30)]
        public virtual string Style
        {
            get
            {
                return GetValue("Style", "Navy", FieldType.General);
            }
            set
            {
                SetValue("Style", value, FieldType.General);
            }
        }

        public virtual string StyleFormatted => Style.Replace(" ", "").ToLower();

        [TextContentField(IsRequired = true, SortOrder = 40)]
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

        [TextContentField(IsRequired = true, SortOrder = 50)]
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

        [TextContentField(IsRequired = true, SortOrder = 60)]
        public virtual string Link
        {
            get
            {
                return GetValue(nameof(Link), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Link), value, FieldType.Contextual);
            }
        }

    }
}
