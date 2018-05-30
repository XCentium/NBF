// --------------------------------------------------------------------------------------------------------------------
// <copyright file="JobPreprocessorLookupInformation.cs" company="Insite Software">
//   Copyright © 2018. Insite Software. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace Insite.Integration.WebService.PlugIns.Preprocessor
{
    using System.Collections.Generic;
    using System.Data;
    using System.Data.Entity;
    using System.IO;
    using System.Linq;

    using Insite.Common.Helpers;
    using Insite.Core.Interfaces.Data;
    using Insite.Core.Interfaces.Dependency;
    using Insite.Core.Plugins.StorageProvider;
    using Insite.Core.Security;
    using Insite.Data.Entities;
    using Insite.Data.Repositories.Interfaces;
    //using Insite.IdentityServer.AspNetIdentity;
    using Insite.Integration.WebService.Interfaces;

    /// <summary>The job pre-processor lookup information.</summary>
    [DependencyName("NBFLookupInformation")]
    public class JobPreprocessorNBFLookupInformation : IJobPreprocessor
    {
        /// <summary>Injected in <see cref="IUnitOfWork" />.</summary>
        protected readonly IUnitOfWork UnitOfWork;

        protected readonly ISystemStorageProvider SystemStorageProvider;

        /// <summary>Initializes a new instance of the <see cref="JobPreprocessorLookupInformation"/> class. Public constructor with all dependencies injected in.</summary>
        /// <param name="unitOfWorkFactory">The unit Of Work Factory.</param>
        /// <param name="systemStorageProvider">The system storage provider.</param>
        public JobPreprocessorNBFLookupInformation(IUnitOfWorkFactory unitOfWorkFactory, ISystemStorageProvider systemStorageProvider)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.SystemStorageProvider = systemStorageProvider;
        }

        /// <summary>Gets or sets the job logger.</summary>
        public IJobLogger JobLogger { get; set; }

        /// <summary>Gets or sets the integration job.</summary>
        public IntegrationJob IntegrationJob { get; set; }

        /// <summary>The execute.</summary>
        /// <returns>The <see cref="IntegrationJob"/>.</returns>
        public virtual IntegrationJob Execute()
        {
            var productLookupDataTable = new DataTable("ProductLookup");
            productLookupDataTable.Columns.Add("ErpNumber");
            productLookupDataTable.Columns.Add("ProductId");
            productLookupDataTable.PrimaryKey = new[] { productLookupDataTable.Columns["ErpNumber"] };

            foreach (var product in this.UnitOfWork.GetRepository<Product>().GetTable().AsNoTracking().Where(p => p.ErpManaged).Select(o =>
                new { o.ErpNumber, o.Id }).ToList())
            {
                productLookupDataTable.Rows.Add(product.ErpNumber, product.Id);
            }

            var dataSet = new DataSet();
            dataSet.Tables.Add(productLookupDataTable);
            this.IntegrationJob.InitialData = XmlDatasetManager.ConvertDatasetToXml(dataSet);

            return this.IntegrationJob;
        }
    }
}