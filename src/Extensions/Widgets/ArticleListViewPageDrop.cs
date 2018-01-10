// Decompiled with JetBrains decompiler
// Type: Insite.ContentLibrary.Widgets.NewsListViewPageDrop
// Assembly: Insite.ContentLibrary, Version=4.3.2.38010, Culture=neutral, PublicKeyToken=null
// MVID: 07ABDDF4-4E7A-4584-9377-BE6EA283F5AD
// Assembly location: E:\NBF\insite-commerce-cloud-master\src\InsiteCommerce.Web\bin\Insite.ContentLibrary.dll

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
