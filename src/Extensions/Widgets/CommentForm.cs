using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Core.Providers;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    /// <summary>The contact us form.</summary>
    [DisplayName("NBF - Comment Form")]
    public class CommentForm : ContentWidget
    {
        private string emailIsInvalidErrorMessage;
        private string emailIsRequiredErrorMessage;
        private string messageIsRequiredErrorMessage;
        private string nameIsRequiredErrorMessage;

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

        [TextContentField]
        public virtual string Subject
        {
            get
            {
                return this.GetValue<string>(nameof(Subject), "Comment submitted.", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Subject), value, FieldType.Contextual);
            }
        }

        public virtual string NameIsRequiredErrorMessage
        {
            get
            {
                return this.nameIsRequiredErrorMessage ?? (this.nameIsRequiredErrorMessage = "Please enter an email address");
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
