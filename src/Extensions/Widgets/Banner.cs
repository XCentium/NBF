using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using System.ComponentModel;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Banner")]
    public class Banner : ContentWidget
    {
        [FilePickerField(IsRequired = true, ResourceType = "ImageFiles", SortOrder = 10)]
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

        [DropDownContentField(new[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, SortOrder = 20)]
        public virtual string Position1
        {
            get
            {
                return GetValue(nameof(Position1), "Bottom Right", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Position1), value, FieldType.Contextual);
            }
        }

        public virtual string Position1Formatted => Position1.Replace(" ", "").ToLower();

        [DropDownContentField(new[] { "Default", "Square" }, SortOrder = 30)]
        public virtual string Style1
        {
            get
            {
                return GetValue(nameof(Style1), "Default", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Style1), value, FieldType.Contextual);
            }
        }

        public virtual string Style1Formatted => Style1.Replace(" ", "").ToLower();

        [TextContentField(SortOrder = 40)]
        public virtual string Title1
        {
            get
            {
                return GetValue(nameof(Title1), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Title1), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 50)]
        public virtual string SubTitle1
        {
            get
            {
                return GetValue(nameof(SubTitle1), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(SubTitle1), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 60)]
        public virtual string ButtonText1
        {
            get
            {
                return GetValue(nameof(ButtonText1), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ButtonText1), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 65)]
        public virtual string ButtonUrl1
        {
            get
            {
                return GetValue(nameof(ButtonUrl1), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ButtonUrl1), value, FieldType.Contextual);
            }
        }

        [DropDownContentField(new[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, SortOrder = 70)]
        public virtual string Position2
        {
            get
            {
                return GetValue(nameof(Position2), "Bottom Right", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Position2), value, FieldType.Contextual);
            }
        }

        public virtual string Position2Formatted => Position2.Replace(" ", "").ToLower();

        [DropDownContentField(new[] { "Default", "Square" }, SortOrder = 80)]
        public virtual string Style2
        {
            get
            {
                return GetValue(nameof(Style2), "Default", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Style2), value, FieldType.Contextual);
            }
        }

        public virtual string Style2Formatted => Style2.Replace(" ", "").ToLower();

        [TextContentField(SortOrder = 90)]
        public virtual string Title2
        {
            get
            {
                return GetValue(nameof(Title2), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Title2), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 100)]
        public virtual string SubTitle2
        {
            get
            {
                return GetValue(nameof(SubTitle2), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(SubTitle2), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 110)]
        public virtual string ButtonText2
        {
            get
            {
                return GetValue(nameof(ButtonText2), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ButtonText2), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 120)]
        public virtual string ButtonUrl2
        {
            get
            {
                return GetValue(nameof(ButtonUrl2), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(ButtonUrl2), value, FieldType.Contextual);
            }
        }

        public virtual bool ButtonReady1 => !ButtonText1.IsNullOrWhiteSpace() && !ButtonUrl1.IsNullOrWhiteSpace();
        public virtual bool ButtonReady2 => !ButtonText2.IsNullOrWhiteSpace() && !ButtonUrl2.IsNullOrWhiteSpace();
    }
}
