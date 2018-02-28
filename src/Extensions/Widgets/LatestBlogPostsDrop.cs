using DotLiquid;
using Extensions.Widgets.ContentFields;
using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    public class LatestBlogPostsDrop : Drop
    {
        public IList<LatestBlogPostDrop> PageLinks { get; set; }
    }
}
