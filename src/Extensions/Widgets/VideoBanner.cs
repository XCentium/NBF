using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Video Banner")]
    public class VideoBanner : ContentWidget
    {        
        [TextContentField(IsRequired = false, SortOrder = 20)]
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

        [TextContentField(IsRequired = false, SortOrder = 25)]
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
        [TextContentField(IsRequired = false, SortOrder = 30)]
        public virtual string Url
        {
            get
            {
                return GetValue(nameof(Url), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Url), value, FieldType.Contextual);
            }
        }


        [FilePickerField(IsRequired = false, ResourceType = "ImageFiles", SortOrder = 40)]
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
        [DropDownContentField(new[] { "White", "Navy" }, IsRequired = true, SortOrder = 50)]
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

        [DropDownContentField(new[] { "Bottom Right", "Bottom Left", "Top Left", "Top Right" }, IsRequired = true, SortOrder = 60)]
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

        [TextContentField(IsRequired = true, SortOrder = 70, DisplayName="MP4 Video Url")]
        public virtual string Mp4VideoUrl
        {
            get
            {
                return GetValue(nameof(Mp4VideoUrl), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Mp4VideoUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = false, SortOrder = 80, DisplayName = "Ogg Video Url")]
        public virtual string OggVideoUrl
        {
            get
            {
                return GetValue(nameof(OggVideoUrl), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(OggVideoUrl), value, FieldType.Contextual);
            }
        }
    }
}
