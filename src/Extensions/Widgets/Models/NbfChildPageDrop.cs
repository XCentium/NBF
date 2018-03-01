using System;
using System.Collections.Generic;
using Insite.ContentLibrary.Widgets;

namespace Extensions.Widgets.Models
{
    public class NbfChildPageDrop : ChildPageDrop
    {
        public Guid Id { get; set; }
        public int CatNum { get; set; }
        public IList<NbfChildPageDrop> NbfChildPages { get; set; }
        public string NavigationContent { get; set; }
    }
}