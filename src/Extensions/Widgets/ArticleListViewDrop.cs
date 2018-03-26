using DotLiquid;
using System.Collections.Generic;
using Insite.ContentLibrary;

namespace Extensions.Widgets
{
    public class ArticleListViewDrop : Drop
    {
        public string NewsListId { get; set; }

        public ICollection<ArticleListViewPageDrop> NewsPages { get; set; } = new List<ArticleListViewPageDrop>();

        public PagingInfo Pagination { get; set; } = new PagingInfo();
    }
}
