using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;

namespace Extensions.Widgets
{
    public class SignInWidget : ContentWidget
    {
        [CheckBoxContentField]
        public virtual bool IncludeForgotPasswordLink
        {
            get
            {
                return GetValue("IncludeForgotPasswordLink", false, FieldType.General);
            }
            set
            {
                SetValue("IncludeForgotPasswordLink", value, FieldType.General);
            }
        }

        [CheckBoxContentField]
        public virtual bool AllowCreateAccount
        {
            get
            {
                return GetValue("AllowCreateAccount", false, FieldType.General);
            }
            set
            {
                SetValue("AllowCreateAccount", value, FieldType.General);
            }
        }
    }
}