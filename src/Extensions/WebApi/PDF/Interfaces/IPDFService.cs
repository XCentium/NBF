using Extensions.WebApi.PDF.Models;
using Insite.Core.Interfaces.Dependency;
using System.IO;

namespace Extensions.WebApi.PDF.Interfaces
{
    public interface IPDFService : IDependency, IExtension
    {
        MemoryStream GetPdf(GetPdfParameter parameter);
    }
}
