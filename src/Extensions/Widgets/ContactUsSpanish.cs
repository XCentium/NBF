using Insite.ContentLibrary.ContentFields;
using Insite.ContentLibrary.Widgets;
using Insite.Data.Entities;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Extensions.Widgets
{
    [DisplayName("NBF - Contact Us - Spanish Widget")]
    public class ContactUsSpanish : ContentWidget
    {       

        [RichTextContentField(IsRequired = true)]
        public virtual string HelpText
        {
            get
            {
                return this.GetValue<string>(nameof(HelpText), "Si Ud. necesita ayuda para ordenar,<br>llame 800 - 517 - 9531.<br>Lunes a Viernes<br>9:30 am - 6 pm<br>Hora Centro", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(HelpText), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Required Text")]
        public virtual string RequiredText
        {
            get
            {
                return this.GetValue<string>(nameof(RequiredText), "Requisitos", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(RequiredText), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Name Prompt")]
        public virtual string NamePrompt
        {
            get
            {
                return this.GetValue<string>(nameof(NamePrompt), "Nombre completo", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(NamePrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Company Prompt")]
        public virtual string CompanyPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(CompanyPrompt), "Nombre de compañia", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(CompanyPrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Zip Prompt")]
        public virtual string ZipPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(ZipPrompt), "Código postal", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ZipPrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Email Prompt")]
        public virtual string EmailPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(EmailPrompt), "Dirección de correo electrónico", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(EmailPrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Phone Prompt")]
        public virtual string PhonePrompt
        {
            get
            {
                return this.GetValue<string>(nameof(PhonePrompt), "Teléfono", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(PhonePrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Contact Method Prompt")]
        public virtual string ContactMethodPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(ContactMethodPrompt), "Por favor, pongase en contacto por", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(ContactMethodPrompt), value, FieldType.Contextual);
            }
        }

        [ListContentField(DisplayName = "Contact Methods", IsRequired = true)]
        public virtual List<string> ContactMethods
        {
            get
            {
                return this.GetValue<List<string>>(nameof(ContactMethods), new List<string>() { "Email", "Teléfono" }, FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>(nameof(ContactMethods), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Order Number Prompt")]
        public virtual string OrderNumberPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(OrderNumberPrompt), "Número de orden", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(OrderNumberPrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Priority Code Prompt")]
        public virtual string PriorityCodePrompt
        {
            get
            {
                return this.GetValue<string>(nameof(PriorityCodePrompt), "Código de prioridad", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(PriorityCodePrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Subject Prompt")]
        public virtual string SubjectPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(SubjectPrompt), "Sujeto", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(SubjectPrompt), value, FieldType.Contextual);
            }
        }

        [ListContentField(DisplayName = "Subject Options", IsRequired = true)]
        public virtual List<string> SubjectOptions
        {
            get
            {
                return this.GetValue<List<string>>(nameof(SubjectOptions), new List<string>() { "Tema de facturas ", "Carreras", "Muestras de color", "Servicios de diseño", "Daños", "Lista de envoi – agregar, modificación, cancelar", "Cambios", "Estado de orden", "Preguntas sobre ventas/productos", "Problemas técnicos ", "Cancelar una orden", "Otro tema" }, FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>(nameof(SubjectOptions), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Comments Prompt")]
        public virtual string CommentsPrompt
        {
            get
            {
                return this.GetValue<string>(nameof(CommentsPrompt), "Por favor, escriba sus commentarios, sugerencias o sus preguntas abajo y oprima el boton 'Enviar' cuando Ud. termine.", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(CommentsPrompt), value, FieldType.Contextual);
            }
        }

        [TextContentField(IsRequired = true, DisplayName = "Email Me Text")]
        public virtual string EmailMeText
        {
            get
            {
                return this.GetValue<string>(nameof(EmailMeText), "Envíame actualizaciones de email con ofertas especiales e información de productos nuevos.", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>(nameof(EmailMeText), value, FieldType.Contextual);
            }
        }
               

        [ListContentField(DisplayName = "Send Email To", InvalidRegExMessage = "Invalid Email Address", IsRequired = true, RegExValidation = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*")]
        public virtual List<string> EmailTo
        {
            get
            {
                return this.GetValue<List<string>>("EmailTo", new List<string>(), FieldType.Contextual);
            }
            set
            {
                this.SetValue<List<string>>("EmailTo", value, FieldType.Contextual);
            }
        }

        public virtual string EmailToValue
        {
            get
            {
                return string.Join(",", this.EmailTo.ToArray());
            }
        }

        
        [TextContentField(IsRequired = true, DisplayName ="Submit Button Text")]
        public virtual string SubmitButtonText
        {
            get
            {
                return this.GetValue<string>("SubmitButtonText", "Enviar", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("SubmitButtonText", value, FieldType.Contextual);
            }
        }

        [RichTextContentField(IsRequired = true)]
        public virtual string SuccessMessage
        {
            get
            {
                return this.GetValue<string>("SuccessMessage", "<p>¡Gracias por someter la oja! Responderémos muy pronto</p>", FieldType.Contextual);
            }
            set
            {
                this.SetValue<string>("SuccessMessage", value, FieldType.Contextual);
            }
        }

        public virtual string EmailAddressRegexPattern
        {
            get
            {
                return "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
            }
        }

        public virtual string PhoneRegexPattern
        {
            get
            {
                return "^([\\(\\)/\\-\\.\\+\\s]*\\d\\s?(ext)?[\\(\\)/\\-\\.\\+\\s]*){10,}$";
            }
        }
    }
}
