using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Core.Services.Handlers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.WebFramework.Mvc;
using Extensions.Models.StaticCategory;
using System.Collections.ObjectModel;

namespace Extensions.Handlers.GetCategoryCollectionHandler
{
    [DependencyName(nameof(OverwriteNavigationLinks))]
    public class OverwriteNavigationLinks : HandlerBase<GetCategoryCollectionParameter, GetCategoryCollectionResult>
    {
        public override int Order => 900;

        public override GetCategoryCollectionResult Execute(IUnitOfWork unitOfWork, GetCategoryCollectionParameter parameter, GetCategoryCollectionResult result)
        {
            var navLinks = new List<NavLinkDto>();

            var staticCategories = unitOfWork.GetRepository<StaticCategory>().GetTable();
            var topLevel = staticCategories.Where(c => c.ParentId == null).ToList();
            var secondLevel = staticCategories.Where(c => c.ParentId != null).ToList();

            foreach(var cat in topLevel)
            {
                var navLink = new NavLinkDto()
                {
                    LinkText = cat.Name,
                    Url = cat.UrlSegment,
                };
                navLink.Properties.Add("IsByArea", cat.ByArea ? "true" : "false");
                navLink.NavLinks = secondLevel
                    .Where(s => s.ParentId == cat.Id)
                    .Select(s =>
                   {
                       return new NavLinkDto()
                       {
                           LinkText = s.Name,
                           Url = s.UrlSegment
                       };
                   })
                    .ToList();
                navLinks.Add(navLink);
            }

            result.NavLinks = new ReadOnlyCollection<NavLinkDto>(navLinks);

            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}