using Insite.Catalog.Services;
using Insite.Catalog.Services.Parameters;
using Insite.Catalog.Services.Results;
using Insite.Catalog.SystemSettings;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Plugins.Catalog;
using Insite.Core.Plugins.Search;
using Insite.Core.Plugins.Search.Dtos;
using Insite.Core.Providers;
using Insite.Core.Services;
using Insite.Core.Services.Handlers;
using Insite.Core.SystemSetting.Groups.Catalog;
using Insite.Data.Entities;
using System;
using System.Linq;

namespace Extensions.Handlers.GetAutocompleteHandler
{
    [DependencyName("HideSwatchesFromAutocomplete")]
    public sealed class HideSwatchesFromAutocomplete : HandlerBase<GetAutocompleteParameter, GetAutocompleteResult>
    {
        private readonly AutocompleteSettings autocompleteSettings;
        private readonly CatalogGeneralSettings catalogGeneralSettings;
        private readonly ICatalogPathBuilder catalogPathBuilder;
        private readonly IProductSearchProvider productSearchProvider;
        private readonly IProductService productService;

        public HideSwatchesFromAutocomplete(AutocompleteSettings autocompleteSettings, CatalogGeneralSettings catalogGeneralSettings, ICatalogPathBuilder catalogPathBuilder, IProductSearchProvider productSearchProvider, IProductService productService)
        {
            this.autocompleteSettings = autocompleteSettings;
            this.catalogGeneralSettings = catalogGeneralSettings;
            this.catalogPathBuilder = catalogPathBuilder;
            this.productSearchProvider = productSearchProvider;
            this.productService = productService;
        }

        public override int Order
        {
            get
            {
                return 450;
            }
        }

        private int MinimumAutocompleteResults { get; set; } = 1;

        private int MaximumAutocompleteResults { get; set; } = 10;

        public override GetAutocompleteResult Execute(IUnitOfWork unitOfWork, GetAutocompleteParameter parameter, GetAutocompleteResult result)
        {
            parameter.

            return this.NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
