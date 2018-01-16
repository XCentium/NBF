using DotLiquid;
using System.Collections.Generic;
using Insite.ContentLibrary;

namespace Extensions.Widgets
{
    public class PageTagSelectViewDrop : Drop
    {
        public string NewsListId { get; set; }

        public ICollection<string> PageTags { get; set; } = (ICollection<string>)new List<string>();
        public string ParentUrl { get; set; }

        public PagingInfo Pagination { get; set; } = new PagingInfo();
    }
}
