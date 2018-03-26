using Insite.ContentLibrary.Widgets;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Page Tag Links View")]
    public class PageTagLinksView : ContentWidget
    {
        public virtual PageTagLinksViewDrop Drop
        {
            get
            {
                return GetPerRequestValue<PageTagLinksViewDrop>(nameof(Drop));
            }
            set
            {
                SetPerRequestValue(nameof(Drop), value);
            }
        }
    }
}

