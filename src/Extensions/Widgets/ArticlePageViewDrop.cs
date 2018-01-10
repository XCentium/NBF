using DotLiquid;
using System.Collections.Generic;

namespace Extensions.Widgets
{
    public class ArticlePageViewDrop : Drop
    {
        public string Author { get; set; }

        public string PublishDate { get; set; }

        public string NewsContents { get; set; }

        public string Title { get; set; }

        public List<string> Tags { get; set; }
    }
}
