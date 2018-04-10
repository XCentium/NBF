using Extensions.WebApi.PDF.Models;
using Insite.Core.Interfaces.Dependency;
using System.IO;
using System.Threading.Tasks;

namespace Extensions.WebApi.PDF.Interfaces
{
    public interface IPDFRepository: IExtension, IDependency
    {
        MemoryStream GetPdf(GetPdfParameter parameter);
    }
}
