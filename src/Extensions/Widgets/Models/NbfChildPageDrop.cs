using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.ContentLibrary.Widgets;

namespace Extensions.Widgets.Models
{
    public class NbfChildPageDrop : ChildPageDrop
    {
        public Guid Id { get; set; }
        public int CatNum { get; set; }
        public IList<NbfChildPageDrop> NbfChildPages { get; set; }
    }
}