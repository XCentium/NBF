using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Article List View")]
    public class ArticleListView : ContentWidget
    {
        [IntegerContentField]
        public virtual int DefaultPageSize
        {
            get
            {
                return GetValue(nameof(DefaultPageSize), 18, FieldType.General);
            }
            set
            {
                SetValue(nameof(DefaultPageSize), value, FieldType.General);
            }
        }

        public virtual ArticleListViewDrop Drop
        {
            get
            {
                return GetPerRequestValue<ArticleListViewDrop>(nameof(Drop));
            }
            set
            {
                SetPerRequestValue(nameof(Drop), value);
            }
        }
    }
}
