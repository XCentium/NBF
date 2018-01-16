using System.Collections.Generic;
using System.Threading.Tasks;


namespace NBF.Customizations.Lib.Api.Content.Interfaces
{
    public interface IContentService
    {
        Task<List<string>> GetContentTags();        
    }

}