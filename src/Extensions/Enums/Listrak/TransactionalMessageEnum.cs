using System.ComponentModel;

namespace Extensions.Enums.Listrak
{
    public enum TransactionalMessageEnum
    {
        [Description("11570051")]
        WelcomeEmail,
        [Description("11570051")]
        BrowseAbandonmentEmail,
        [Description("11570051")]
        CartAbandonmentEmail,
        [Description("11570051")]
        PostPurchaseEmail
    }
}