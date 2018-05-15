using Insite.Cart.Services.Parameters;
using Insite.Cart.Services.Results;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Core.Services.Handlers;

namespace Extensions.Cart.Handlers
{
    [DependencyName("ProcessTermsCode")]
    public sealed class ProcessTermsCode : HandlerBase<UpdateCartParameter, UpdateCartResult>
    {
        public override int Order => 3250;

        public override UpdateCartResult Execute(IUnitOfWork unitOfWork, UpdateCartParameter parameter, UpdateCartResult result)
        {
            if (parameter.IsPaymentProfile)
            {
                result.GetCartResult.Cart.TermsCode = "CC";
            }
            return NextHandler.Execute(unitOfWork, parameter, result);
        }
    }
}
