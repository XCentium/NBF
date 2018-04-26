using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Social Media Link List With Title")]
    public class SocialMediaLinkListWithTitle : ContentWidget
    {
        [TextContentField]
        public virtual string Title
        {
            get
            {
                return GetValue(nameof(Title), "Connect with us:", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Title), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Twitter Url")]
        public virtual string TwitterUrl
        {
            get
            {
                return GetValue(nameof(TwitterUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(TwitterUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Facebook Url")]
        public virtual string FacebookUrl
        {
            get
            {
                return GetValue(nameof(FacebookUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(FacebookUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Pinterest Url")]
        public virtual string PinterestUrl
        {
            get
            {
                return GetValue(nameof(PinterestUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(PinterestUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Instagram Url")]
        public virtual string InstagramUrl
        {
            get
            {
                return GetValue(nameof(InstagramUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(InstagramUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("YouTube Url")]
        public virtual string YoutubeUrl
        {
            get
            {
                return GetValue(nameof(YoutubeUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(YoutubeUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Google Plus Url")]
        public virtual string GooglePlusUrl
        {
            get
            {
                return GetValue(nameof(GooglePlusUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(GooglePlusUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("LinkedIn Url")]
        public virtual string LinkedInUrl
        {
            get
            {
                return GetValue(nameof(LinkedInUrl), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(LinkedInUrl), value, FieldType.Contextual);
            }
        }        
    }
}
