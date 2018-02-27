using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Product CTA 4 Squares")]
    public class ProductCTAFourSquares : ContentWidget
    {
        [FilePickerField( ResourceType = "ImageFiles", SortOrder = 10)]
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
              
        [TextContentField( SortOrder = 20)]
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

        [TextContentField( SortOrder = 30)]
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

        [TextContentField( SortOrder = 40)]
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

        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 50)]
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

        [TextContentField(SortOrder = 60)]
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

        [TextContentField(SortOrder = 70)]
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

        [TextContentField(SortOrder = 80)]
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

        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 90)]
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

        [TextContentField(SortOrder = 100)]
        public virtual string Title3
        {
            get
            {
                return this.GetValue<string>(nameof(Title3), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title3), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 120)]
        public virtual string SubTitle3
        {
            get
            {
                return this.GetValue<string>(nameof(SubTitle3), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SubTitle3), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 130)]
        public virtual string ButtonText3
        {
            get
            {
                return this.GetValue<string>(nameof(ButtonText3), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ButtonText3), value, FieldType.Contextual);
            }
        }

        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 140)]
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

        [TextContentField(SortOrder = 150)]
        public virtual string Title4
        {
            get
            {
                return this.GetValue<string>(nameof(Title4), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title4), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 160)]
        public virtual string SubTitle4
        {
            get
            {
                return this.GetValue<string>(nameof(SubTitle4), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SubTitle4), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 170)]
        public virtual string ButtonText4
        {
            get
            {
                return this.GetValue<string>(nameof(ButtonText4), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ButtonText4), value, FieldType.Contextual);
            }
        }
    }
}
