using Extensions.Enums.Listrak;
using Insite.Core.Services;
using System.Collections.Generic;

namespace Extensions.WebApi.Listrak.Models
{
    public class SendTransationalMessageParameter : ParameterBase
    {
        public TransactionalMessageEnum Message { get; set; }
        public string EmailAddress { get; set; }
        public List<SegmentationFieldParameter> SegmentationFields { get; set; }
    }
}
