﻿using System;
using System.Collections.Generic;
using DotLiquid;
using Extensions.Widgets.Models;
using Insite.ContentLibrary.Widgets;
using Insite.WebFramework.Content;

namespace Extensions.Widgets
{
  public class ProductFlyOutDrop : Drop
  {
    public Guid Id { get; set; }
    public string RootPageTitle { get; set; }

    public bool RootPageExists { get; set; }

    public IList<NbfChildPageDrop> ChildPages { get; set; }
  }
}
