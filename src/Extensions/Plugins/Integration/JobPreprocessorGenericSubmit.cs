using Insite.Cart.Services.Pipelines;
using Insite.Cart.Services.Pipelines.Parameters;
using Insite.Common.Helpers;
using Insite.Core.Interfaces.Data;
using Insite.Core.Interfaces.Dependency;
using Insite.Data.Entities;
using Insite.Integration.WebService.Interfaces;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data;
using System.Linq;
using System.Reflection;
using Insite.Integration.WebService;

namespace Extensions.Plugins.Integration
{
    //Insite's GenericSubmit Preprocessor. 
    public class JobPreprocessorGenericSubmit : IJobPreprocessor, ITransientLifetime, IDependency, IExtension
    {

        protected readonly IUnitOfWork UnitOfWork;
        protected readonly ICartPipeline CartPipeline;

        public JobPreprocessorGenericSubmit(IUnitOfWorkFactory unitOfWorkFactory, ICartPipeline cartPipeline)
        {
            this.UnitOfWork = unitOfWorkFactory.GetUnitOfWork();
            this.CartPipeline = cartPipeline;
        }

        public IJobLogger JobLogger { get; set; }

        public IntegrationJob IntegrationJob { get; set; }

        public virtual IntegrationJob Execute()
        {
            try
            {
                this.UnitOfWork.DataProvider.EnableLazyLoading();
                DataSet dataset = new DataSet();
                foreach (JobDefinitionStep jobDefinitionStep in (IEnumerable<JobDefinitionStep>)this.IntegrationJob.JobDefinition.JobDefinitionSteps.OrderBy<JobDefinitionStep, int>((Func<JobDefinitionStep, int>)(s => s.Sequence)))
                {
                    JobDefinitionStep step = jobDefinitionStep;
                    if (string.IsNullOrEmpty(step.ObjectName))
                        throw new ArgumentException(IntegrationMessages.StepObjectNameRequiredExceptionMessage);
                    Type typeForClassName = this.UnitOfWork.DataProvider.GetTypeForClassName(step.ObjectName);
                    if (typeForClassName == (Type)null)
                        throw new ArgumentException(IntegrationMessages.StepObjectNameRequiredExceptionMessage);
                    object[] keyValues = this.GetKeyValues(step, typeForClassName);
                    IRepository repository = this.UnitOfWork.GetRepository(typeForClassName);
                    object obj = repository.GetType().GetMethod("GetByNaturalKey").Invoke((object)repository, new object[1]
                    {
            (object) keyValues
                    });
                    if (obj == null)
                        throw new ArgumentException(string.Format(IntegrationMessages.UnableToRetrieveObjectExceptionMessage, (object)step.ObjectName, (object)string.Join(",", ((IEnumerable<object>)keyValues).Select<object, string>((Func<object, string>)(k => k.ToString())).ToArray<string>())));
                    DataSet dataSet = new DataSet(typeForClassName.Name);
                    if (typeForClassName == typeof(CustomerOrder))
                    {
                        CustomerOrder customerOrder = obj as CustomerOrder;
                        dataSet = this.CartPipeline.GetCartDataSet(new GetCartDataSetParameter()
                        {
                            Cart = customerOrder
                        }).DataSet;
                    }
                    else if (typeForClassName == typeof(Customer))
                    {
                        Customer customer = obj as Customer;
                        DataTable dataTableFromList = ObjectHelper.GetDataTableFromList((IList)new ArrayList()
            {
              obj
            }, typeForClassName);
                        DataRow dataRow = dataTableFromList.AsEnumerable().First<DataRow>();
                        dataTableFromList.Columns.Add("DefaultWarehouseName", typeof(string));
                        dataTableFromList.Columns.Add("State", typeof(string));
                        dataTableFromList.Columns.Add("PrimarySalespersonNumber", typeof(string));
                        if (customer.DefaultWarehouse != null)
                            dataRow["DefaultWarehouseName"] = (object)customer.DefaultWarehouse.Name;
                        if (customer.State != null)
                            dataRow["State"] = (object)customer.State.Abbreviation;
                        if (customer.PrimarySalesperson != null)
                            dataRow["PrimarySalespersonNumber"] = (object)customer.PrimarySalesperson.SalespersonNumber;
                        dataSet.Tables.Add(dataTableFromList);
                        dataSet.Tables.Add(ObjectHelper.GetDataTableFromList((IList)customer.CustomProperties.ToList<CustomProperty>(), typeof(CustomProperty), "CustomerId", new Guid?(customer.Id)));
                        if (customer.Country != null)
                            dataSet.Tables.Add(ObjectHelper.GetDataTableFromList((IList)new ArrayList()
              {
                (object) customer.Country
              }, typeof(Country)));
                    }
                    else
                    {
                        DataTable dataTableFromList = ObjectHelper.GetDataTableFromList((IList)new ArrayList()
            {
              obj
            }, typeForClassName);
                        dataSet.Tables.Add(dataTableFromList);
                    }
                    foreach (DataTable table in (InternalDataCollectionBase)dataSet.Tables)
                    {
                        table.Columns.Add("StepSequence");
                        foreach (DataRow row in (InternalDataCollectionBase)table.Rows)
                            row["StepSequence"] = (object)step.Sequence;
                    }
                    dataset.Merge(dataSet);
                    ICollection<IntegrationJobParameter> integrationJobParameters = this.IntegrationJob.IntegrationJobParameters;
                    foreach (IntegrationJobParameter integrationJobParameter in integrationJobParameters.Where<IntegrationJobParameter>((Func<IntegrationJobParameter, bool>)(integrationJobParameter =>
                    {
                        if (integrationJobParameter.JobDefinitionStepParameter != null)
                            return integrationJobParameter.JobDefinitionStepParameter.JobDefinitionStep.Id.Equals(step.Id);
                        return false;
                    })))
                        integrationJobParameter.JobDefinitionStepParameter.Value = integrationJobParameter.Value;
                }
                this.IntegrationJob.InitialData = XmlDatasetManager.ConvertDatasetToXml(dataset);
            }
            finally
            {
                this.UnitOfWork.DataProvider.DisableLazyLoading();
            }
            return this.IntegrationJob;
        }

        protected virtual object[] GetKeyValues(JobDefinitionStep jobDefinitionStep, Type modelType)
        {
            Collection<object> source = new Collection<object>();
            foreach (PropertyInfo propertyInfo in ((IEnumerable<PropertyInfo>)modelType.GetProperties()).Where<PropertyInfo>((Func<PropertyInfo, bool>)(pi => ((IEnumerable<object>)pi.GetCustomAttributes(typeof(NaturalKeyFieldAttribute), false)).Any<object>())).OrderBy<PropertyInfo, int>((Func<PropertyInfo, int>)(pi => ((NaturalKeyFieldAttribute)pi.GetCustomAttributes(typeof(NaturalKeyFieldAttribute), false)[0]).Order)).ToList<PropertyInfo>())
            {
                PropertyInfo naturalKeyField = propertyInfo;
                IntegrationJobParameter integrationJobParameter = this.IntegrationJob.IntegrationJobParameters.FirstOrDefault<IntegrationJobParameter>((Func<IntegrationJobParameter, bool>)(m =>
                {
                    if (m.JobDefinitionStepParameter != null && m.JobDefinitionStepParameter.JobDefinitionStep.Sequence == jobDefinitionStep.Sequence)
                        return m.JobDefinitionStepParameter.Name.Equals(naturalKeyField.Name, StringComparison.OrdinalIgnoreCase);
                    return false;
                }));
                if (integrationJobParameter == null)
                    throw new ArgumentException(string.Format(IntegrationMessages.ParameterRequiredExceptionMessage, (object)naturalKeyField.Name));
                source.Add((object)integrationJobParameter.Value);
            }
            if (source.Count == 0)
                throw new ArgumentException(string.Format(IntegrationMessages.ParameterRequiredExceptionMessage, (object)"all"));
            return source.ToArray<object>();
        }
    }

    public class IntegrationMessages
    {
        /// <summary>The exception message that is thrown when a null value is passed in for IntegrationJob.</summary>
        public static string IntegrationJobRequiredExceptionMessage = "Integration Job required";
        /// <summary>The exception message that is thrown when a null value is passed in for JobDefinition.</summary>
        public static string JobDefinitionRequiredExceptionMessage = "Job Definition required";
        /// <summary>The exception message that is thrown when a parameter is required for processing.</summary>
        public static string ParameterRequiredExceptionMessage = "Integration Job Parameter {0} required";
        /// <summary>
        /// The exception message that is thrown when the JobDefinitionStep.ObjectName is null or an empty string, or
        /// when we can not get the type from reflection.
        /// </summary>
        public static string StepObjectNameRequiredExceptionMessage = "Valid Object Name on Integration Job Step is required";
        /// <summary>The exception message that is thrown when</summary>
        public static string UnableToRetrieveObjectExceptionMessage = "Unable to retrieve {0} Information from the Database for Key {1}";
        /// <summary>The exception message that is thrown when we can not retrieve the model object by natural key.</summary>
        public static string UnableToRetrieveDataSetExceptionMessage = "Unable to retrieve {0} DataSet Information";
    }
}
