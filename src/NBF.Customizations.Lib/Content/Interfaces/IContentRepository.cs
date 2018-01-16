using NBF.Customizations.Lib.Api.Content.Models;
using Insite.Catalog.Services.Results;
using Insite.Data.Entities;
using System.Collections.Generic;

namespace NBF.Customizations.Lib.Api.Content.Interfaces
{
    public interface IContentRepository
    {
        List<string> GetContentTags();
    }
}
