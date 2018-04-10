using Extensions.WebApi.PDF.Interfaces;
using Extensions.WebApi.PDF.Models;
using Insite.Core.Interfaces.Data;
using Insite.Core.Services;
using System.IO;
using System.Threading.Tasks;

namespace Extensions.WebApi.PDF.Services
{
    public class PDFService : ServiceBase, IPDFService
    {
        private readonly IPDFRepository _repository;

        public PDFService(IUnitOfWorkFactory unitOfWorkFactory, IPDFRepository repository) : base(unitOfWorkFactory)
        {
            _repository = repository;
        }

        [Transaction]
        public MemoryStream GetPdf(GetPdfParameter parameter)
        {
            return this._repository.GetPdf(parameter);
        }
    }
}
