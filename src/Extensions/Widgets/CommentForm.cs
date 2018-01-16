using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Providers;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    /// <summary>The contact us form.</summary>
    [DisplayName("Form - Comment")]
    public class CommentForm : ContentWidget
    {
        private string emailIsInvalidErrorMessage;
        private string emailIsRequiredErrorMessage;
        private string messageIsRequiredErrorMessage;
        private string topicIsRequiredErrorMessage;

        /// <summary>Gets or sets the success message.</summary>
        [RichTextContentField(IsRequired = true)]
        public virtual string SuccessMessage
        {
            get
            {
                return this.GetValue<string>(nameof(SuccessMessage), "<p>Your comment has been sent.</p>", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SuccessMessage), value, FieldType.Contextual);
            }
        }

        /// <summary>Gets or sets the email to.</summary>
        [ListContentField(DisplayName = "Send Email To", InvalidRegExMessage = "Invalid Email Address", IsRequired = true, RegExValidation = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*")]
        public virtual List<string> EmailTo
        {
            get
            {
                return this.GetValue<List<string>>(nameof(EmailTo), new List<string>(), FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>(nameof(EmailTo), value, FieldType.Contextual);
            }
        }

        public virtual string EmailToValue
        {
            get
            {
                return string.Join(",", this.EmailTo.ToArray());
            }
        }

        /// <summary>Gets the email is invalid error message.</summary>
        public virtual string EmailIsInvalidErrorMessage
        {
            get
            {
                return this.emailIsInvalidErrorMessage ?? (this.emailIsInvalidErrorMessage = "Invalid email address.");
            }
        }

        /// <summary>Gets the email is required error message.</summary>
        public virtual string EmailIsRequiredErrorMessage
        {
            get
            {
                return this.emailIsRequiredErrorMessage ?? (this.emailIsRequiredErrorMessage = "Please enter an email address");
            }
        }

        /// <summary>Gets the message is required error message.</summary>
        public virtual string MessageIsRequiredErrorMessage
        {
            get
            {
                return this.messageIsRequiredErrorMessage ?? (this.messageIsRequiredErrorMessage = "Message is required");
            }
        }

        public virtual string EmailAddressRegexPattern
        {
            get
            {
                return "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
            }
        }
    }
}
