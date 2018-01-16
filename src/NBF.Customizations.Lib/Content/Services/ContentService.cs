using NBF.Customizations.Lib.Api.Content.Interfaces;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Interfaces.Localization;
using Insite.Core.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NBF.Customizations.Lib.Api.Content.Services
{
    public class ContentService : ServiceBase, IContentService, IInterceptable
    {
        private readonly IContentRepository _repository;
        public ContentService(IUnitOfWorkFactory unitOfWorkFactory, ITranslationLocalizer translationLocalizer,
                IContentRepository repository)
            :base(unitOfWorkFactory)
        {
            _repository = repository;
        }

        public async Task<List<string>> GetContentTags()
        {
            var result = new List<string>();
            result = await Task.FromResult<List<string>>(
                _repository.GetContentTags()
            );

            return result;
        }
    }
}
