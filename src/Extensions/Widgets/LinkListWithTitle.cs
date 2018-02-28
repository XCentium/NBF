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
                return this.GetValue<string>(nameof(Title), "", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(Title), value, FieldType.Contextual);
            }
        }

        public override string Direction { get => "Vertical" ; }
    }
}
