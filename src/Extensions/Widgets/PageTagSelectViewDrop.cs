using DotLiquid;
using System.Collections.Generic;
using Insite.ContentLibrary;

namespace Extensions.Widgets
{
    public class PageTagSelectViewDrop : Drop
    {
        public string NewsListId { get; set; }

        public ICollection<string> PageTagList { get; set; } = (ICollection<string>)new List<string>();

        public PagingInfo Pagination { get; set; } = new PagingInfo();
    }
}
