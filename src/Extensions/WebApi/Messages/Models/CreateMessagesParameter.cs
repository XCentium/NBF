using Insite.Core.Services;

namespace Extensions.WebApi.Messages.Models
{
    public class CreateMessageParameter : ParameterBase
    {
        public string Subject { get; set; }
        public string Message { get; set; }

        public string TargetRole { get; set; }
    }
}
