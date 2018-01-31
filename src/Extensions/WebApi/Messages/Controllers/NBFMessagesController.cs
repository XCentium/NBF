using System;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Description;
using Insite.Core.Interfaces.Data;
using Insite.Core.Plugins.Utilities;
using Insite.Core.WebApi;
using Insite.Data.Entities;
using Extensions.WebApi.Messages.Interfaces;
using Extensions.WebApi.Messages.Models;

namespace Extensions.WebApi.Messages.Controllers
{
    [RoutePrefix("api/nbf/sitemessages")]
    public class NBFMessagesController : BaseApiController
    {
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        private readonly IMessagesService _messagesService;

        public NBFMessagesController(ICookieManager cookieManager, IUnitOfWorkFactory unitOfWorkFactory, IMessagesService messagesService)
          : base(cookieManager)
        {
            _messagesService = messagesService;
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        [Route("CreateMessage", Name = "CreateMessage"), HttpPost]
        [ResponseType(typeof(string))]
        public string CreateMessage(CreateMessageParameter parameter)
        {
            var a = this._messagesService.CreateMessage(parameter);

            return a.ToString();
        }
    }
}
