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
                return this.GetValue<string>(nameof(Title), "Connect with us:", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Twitter Url")]
        public virtual string TwitterUrl
        {
            get
            {
                return this.GetValue<string>(nameof(TwitterUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(TwitterUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Facebook Url")]
        public virtual string FacebookUrl
        {
            get
            {
                return this.GetValue<string>(nameof(FacebookUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(FacebookUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Pinterest Url")]
        public virtual string PinterestUrl
        {
            get
            {
                return this.GetValue<string>(nameof(PinterestUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(PinterestUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Instagram Url")]
        public virtual string InstagramUrl
        {
            get
            {
                return this.GetValue<string>(nameof(InstagramUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(InstagramUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("YouTube Url")]
        public virtual string YoutubeUrl
        {
            get
            {
                return this.GetValue<string>(nameof(YoutubeUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(YoutubeUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Google Plus Url")]
        public virtual string GooglePlusUrl
        {
            get
            {
                return this.GetValue<string>(nameof(GooglePlusUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(GooglePlusUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("LinkedIn Url")]
        public virtual string LinkedInUrl
        {
            get
            {
                return this.GetValue<string>(nameof(LinkedInUrl), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(LinkedInUrl), value, FieldType.Contextual);
            }
        }

        [TextContentField]
        [DisplayName("Email Address")]
        public virtual string EmailAddress
        {
            get
            {
                return this.GetValue<string>(nameof(EmailAddress), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(EmailAddress), value, FieldType.Contextual);
            }
        }
    }
}
