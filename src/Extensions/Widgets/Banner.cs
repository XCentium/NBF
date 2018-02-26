using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    public class Banner : ContentWidget
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

        [DropDownContentField(new string[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, SortOrder = 20)]
        public virtual string Position1
        {
            get
            {
                return this.GetValue<string>(nameof(Position1), "Bottom Right", FieldType.Contextual).Replace(" ", "").ToLower();
            }
            set
            {
                this.SetValue<string>(nameof(Position1), value, FieldType.Contextual);
            }
        }
        [DropDownContentField(new string[] { "Default", "Square" }, SortOrder = 30)]
        public virtual string Style1
        {
            get
            {
                return this.GetValue<string>(nameof(Style1), "Default", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Style1), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 40)]
        public virtual string Title1
        {
            get
            {
                return this.GetValue<string>(nameof(Title1), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title1), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 50)]
        public virtual string SubTitle1
        {
            get
            {
                return this.GetValue<string>(nameof(SubTitle1), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SubTitle1), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 60)]
        public virtual string ButtonText1
        {
            get
            {
                return this.GetValue<string>(nameof(ButtonText1), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ButtonText1), value, FieldType.Contextual);
            }
        }

        [DropDownContentField(new string[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, SortOrder = 70)]
        public virtual string Position2
        {
            get
            {
                return this.GetValue<string>(nameof(Position2), "Bottom Right", FieldType.Contextual).Replace(" ", "").ToLower();
            }
            set
            {
                this.SetValue<string>(nameof(Position2), value, FieldType.Contextual);
            }
        }
        [DropDownContentField(new string[] { "Default", "Square" }, SortOrder = 80)]
        public virtual string Style2
        {
            get
            {
                return this.GetValue<string>(nameof(Style2), "Default", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Style2), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 90)]
        public virtual string Title2
        {
            get
            {
                return this.GetValue<string>(nameof(Title2), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title2), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 100)]
        public virtual string SubTitle2
        {
            get
            {
                return this.GetValue<string>(nameof(SubTitle2), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SubTitle2), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 110)]
        public virtual string ButtonText2
        {
            get
            {
                return this.GetValue<string>(nameof(ButtonText2), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ButtonText2), value, FieldType.Contextual);
            }
        }
    }
}
