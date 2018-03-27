using System.ComponentModel;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Microsoft.Ajax.Utilities;
using FieldType = Insite.Data.Entities.FieldType;

namespace Extensions.Widgets
{
    [DisplayName("NBF - CTA Link Widget")]
    public class CTALinkWidget : ContentWidget
    {
        [FilePickerField(ResourceType = "ImageFiles", SortOrder = 10, DisplayName = "CTA Logo Image")]
        public virtual string CtaLogoImage
        {
            get
            {
                return GetValue(nameof(CtaLogoImage), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(CtaLogoImage), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 40, DisplayName = "CTA Title")]
        public virtual string CtaTitle
        {
            get
            {
                return GetValue(nameof(CtaTitle), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(CtaTitle), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 50, DisplayName = "CTA Summary")]
        public virtual string CtaSummary
        {
            get
            {
                return GetValue(nameof(CtaSummary), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(CtaSummary), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 60, DisplayName = "CTA Button Text")]
        public virtual string CtaButtonText
        {
            get
            {
                return GetValue(nameof(CtaButtonText), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(CtaButtonText), value, FieldType.Contextual);
            }
        }

        [TextContentField(SortOrder = 70, DisplayName = "CTA Button URL")]
        public virtual string CtaButtonUrl
        {
            get
            {
                return GetValue(nameof(CtaButtonUrl), string.Empty, FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(CtaButtonUrl), value, FieldType.Contextual);
            }
        }

        public virtual bool ButtonReady => !CtaButtonText.IsNullOrWhiteSpace() && !CtaButtonUrl.IsNullOrWhiteSpace();
        public virtual bool ImageReady => !CtaLogoImage.IsNullOrWhiteSpace();
    }
}
