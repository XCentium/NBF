using DotLiquid;
using Extensions.Widgets.ContentFields;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    public class LatestBlogPostDrop : Drop
    {
        public int Number { get; set; }
        public string Url { get; set; }

        public string Title { get; set; }

        public string Author { get; set; }

        public string PublishDate { get; set; }

        public string Summary { get; set; }

        public string BackgroundImageUrl { get; set; }
    }
}
