using DotLiquid;

namespace Extensions.Widgets
{
    public class ArticleListViewPageDrop : Drop
    {
        public string Url { get; set; }

        public string Title { get; set; }

        public string Author { get; set; }

        public string PublishDateDisplay { get; set; }

        public string QuickSummaryDisplay { get; set; }
    }
}
