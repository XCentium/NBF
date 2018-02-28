using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Link List With Title")]
    public class LinkListWithTitle : LinkList
    {
        [TextContentField]
        public virtual string Title
        {
            get
            {
                return GetValue(nameof(Title), "", FieldType.Contextual);
            }
            set
            {
                SetValue(nameof(Title), value, FieldType.Contextual);
            }
        }

        public override string Direction => "Vertical";
    }
}
