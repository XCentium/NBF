using System.ComponentModel;

namespace Extensions.Enums.Listrak
{
    public enum TransactionalMessageEnum
    {
        [Description("11570051")]
        WelcomeEmail,
        [Description("11572525")]
        OrderConfirmation,
        [Description("11570051")]
        BrowseAbandonmentEmail,
        [Description("11570051")]
        CartAbandonmentEmail
    }
}