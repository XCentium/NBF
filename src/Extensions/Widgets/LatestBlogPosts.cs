using Extensions.Widgets.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Latest Blog Posts")]
    public class LatestBlogPosts : ContentWidget
    {
        [ListOfNewsPagesContentField(DisplayName = "Blog Posts", IsRequired = true, SortOrder = 10)]
        public virtual List<int> BlogPosts
        {
            get
            {
                return GetValue(nameof(BlogPosts), new List<int>(), FieldType.General);
            }
            set
            {
                SetValue(nameof(BlogPosts), value, FieldType.General);
            }
        }

        public virtual LatestBlogPostsDrop Drop
        {
            get
            {
                return GetPerRequestValue<LatestBlogPostsDrop>(nameof(Drop));
            }
            set
            {
                SetPerRequestValue(nameof(Drop), value);
            }
        }
    }
}
