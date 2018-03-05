using Insite.Core.Services;

namespace Extensions.WebApi.Listrak.Models
{
    public class SegmentationFieldParameter : ParameterBase
    {
        public int SegmentationFieldId { get; set; }
        public string Value { get; set; }
    }
}
