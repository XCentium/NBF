using Insite.WebFramework.Content.Attributes;

namespace Extensions.Widgets.ContentFields
{
    public class ListOfNewsPagesContentFieldAttribute: ContentFieldAttribute
    {
        public ListOfNewsPagesContentFieldAttribute()
        {
            Template = "~/Themes/NationalBusinessFurniture/Views/ContentItemFields/ListOfNewsPages.cshtml";            
        }
    }
}