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
        [DisplayName("Background Image for Square #1")]
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
        [DisplayName("Title for Square #1")]
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
        [DisplayName("Sub Title for Square #1")]
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
        
        [TextContentField(SortOrder = 45)]
        [DisplayName("Url for Square #1")]
        public virtual string Url1
        {
            get
            {
                return this.GetValue<string>(nameof(Url1), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Url1), value, FieldType.Contextual);
            }
        }
       
        [TextContentField(SortOrder = 60)]
        [DisplayName("Title for Square #2")]
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

        [TextContentField(SortOrder = 80)]
        [DisplayName("Button Text for Square #2")]
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

        [TextContentField(SortOrder = 85)]
        [DisplayName("Url for Square #2")]
        public virtual string Url2
        {
            get
            {
                return this.GetValue<string>(nameof(Url2), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Url2), value, FieldType.Contextual);
            }
        }
        

        [TextContentField(SortOrder = 100)]
        [DisplayName("Title for Square #3")]
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

        [TextContentField(SortOrder = 130)]
        [DisplayName("Button Text for Square #3")]
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

        [TextContentField(SortOrder = 135)]
        [DisplayName("Url for Square #3")]
        public virtual string Url3
        {
            get
            {
                return this.GetValue<string>(nameof(Url3), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Url3), value, FieldType.Contextual);
            }
        }

        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 140)]
        [DisplayName("Background Image for Square #4")]
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
        [DisplayName("Title for Square #4")]
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

        [TextContentField(SortOrder = 175)]
        [DisplayName("Url for Square #4")]
        public virtual string Url4
        {
            get
            {
                return this.GetValue<string>(nameof(Url4), string.Empty, FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Url4), value, FieldType.Contextual);
            }
        }
    }
}
