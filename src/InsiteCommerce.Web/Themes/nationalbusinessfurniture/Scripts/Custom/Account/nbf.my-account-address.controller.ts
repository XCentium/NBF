module insite.account {
    "use strict";

    export class NbfMyAccountAddressController {
        billTo: BillToModel;
        countries: CountryModel[];
        shipTo: ShipToModel;
        billToInShipTos: ShipToModel;
        createNewShipTo: ShipToModel;
        shipToAddresses: ShipToModel[];
        isReadOnly = false;
        addressFields: AddressFieldCollectionModel;
        editAddressModel: ShipToModel;
        editMode = false;

        static $inject = ["$location", "$localStorage", "customerService", "websiteService", "sessionService", "queryString"];

        constructor(
            protected $location: ng.ILocaleService,
            protected $localStorage: common.IWindowStorage,
            protected customerService: customers.ICustomerService,
            protected websiteService: websites.IWebsiteService,
            protected sessionService: account.ISessionService,
            protected queryString: common.IQueryStringService) {
            this.init();
        }

        init(): void {
            this.websiteService.getAddressFields().then(
                (addressFieldCollection: AddressFieldCollectionModel) => { this.getAddressFieldsCompleted(addressFieldCollection); },
                (error: any) => { this.getAddressFieldsFailed(error); });
        }

        protected getAddressFieldsCompleted(addressFieldCollection: AddressFieldCollectionModel): void {
            this.addressFields = addressFieldCollection;
            this.getSession();
        }

        protected getAddressFieldsFailed(error: any): void {
        }

        getSession(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.getBillTo(session.shipTo);
        }

        protected getSessionFailed(error: any): void {
        }

        saveAddress(id: string): void {
            const valid = angular.element("#addressForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);

                return;
            }

            delete this.billTo.properties["edit"];
            this.billTo.shipTos.forEach(shipTo => {
                delete shipTo.properties["edit"];
            });

            this.scrollToElement(id);

            this.customerService.updateBillTo(this.billTo).then(
                (billTo: BillToModel) => { this.updateBillToCompleted(billTo); },
                (error: any) => { this.updateBillToFailed(error); });
        }

        protected updateBillToCompleted(billTo: BillToModel): void {
            this.editMode = false;
            if (this.shipTo.id !== this.billTo.id) {
                const shipTo = this.shipTo;
                if ((shipTo as any).shipTos) {
                    /* In the situation the user selects the billTo as the shipTo we need to remove the shipTos collection
                       from the object to prevent a circular reference when serializing the object. See the unshift command below. */
                    angular.copy(this.shipTo, shipTo);
                    delete (shipTo as any).shipTos;
                }

                this.customerService.addOrUpdateShipTo(shipTo).then(
                    (result: ShipToModel) => { this.addOrUpdateShipToCompleted(result); },
                    (error: any) => { this.addOrUpdateShipToFailed(error); });
            } else {
                (angular.element("#saveSuccess") as any).foundation("reveal", "open");
            }
        }

        protected updateBillToFailed(error: any): void {
            this.editMode = false;
        }

        protected addOrUpdateShipToCompleted(result: any): void {
            if (this.shipTo.isNew) {
                const isNewShipTo = this.queryString.get("isNewShipTo");
                if (isNewShipTo === "true") {
                    this.$localStorage.set("createdShipToId", result.id);
                    (<any>this.$location).search("isNewShipTo", null);
                } else {
                    this.getBillTo(result);
                }
            }

            (angular.element("#saveSuccess") as any).foundation("reveal", "open");
        }

        protected addOrUpdateShipToFailed(error: any): void {
        }

        getBillTo(selectedShipTo?: ShipToModel): void {
            this.customerService.getBillTo("shiptos,validation,country,state").then(
                (billTo: BillToModel) => { this.getBillToCompleted(billTo, selectedShipTo); },
                (error: any) => { this.getBillToFailed(error); });
        }

        protected getBillToCompleted(billTo: BillToModel, selectedShipTo?: ShipToModel): void {
            this.billTo = billTo;
            this.websiteService.getCountries("states").then(
                (countryCollection: CountryCollectionModel) => { this.getCountriesCompleted(countryCollection, selectedShipTo); },
                (error: any) => { this.getCountriesFailed(error); });
        }

        protected getBillToFailed(error: any): void {
        }

        protected getCountriesCompleted(countryCollection: CountryCollectionModel, selectedShipTo?: ShipToModel): void {
            this.countries = countryCollection.countries;

            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.billTo);
            }

            this.setObjectToReference(this.countries, this.billTo, "country");
            if (this.billTo.country) {
                this.setObjectToReference(this.billTo.country.states, this.billTo, "state");
            }

            const shipTos = this.billTo.shipTos;

            shipTos.forEach(shipTo => {
                this.setObjectToReference(this.countries, shipTo, "country");
                if (shipTo.country) {
                    this.setObjectToReference(shipTo.country.states, shipTo, "state");
                }

                if (shipTo.id === this.billTo.id) {
                    this.billToInShipTos = shipTo;
                }
            });

            // Remove bill to and create new from list of shipTos
            if (this.billToInShipTos) {
                this.billTo.label = this.billToInShipTos.label;
                shipTos.splice(shipTos.indexOf(this.billToInShipTos), 1); // remove the billto that's in the shiptos array

                this.createNewShipTo = shipTos.filter(x => x.label === "Create New")[0];
                shipTos.splice(shipTos.indexOf(this.createNewShipTo), 1);
            }

            const isNewShipTo = this.queryString.get("isNewShipTo");
            const createdShipToId = this.$localStorage.get("createdShipToId");
            if (createdShipToId) {
                shipTos.forEach(shipTo => {
                    if (shipTo.id === createdShipToId) {
                        this.shipTo = shipTo;
                    }
                });

                this.$localStorage.remove("createdShipToId");
            }
            else if (isNewShipTo === "true") {
                shipTos.forEach(shipTo => {
                    if (shipTo.isNew) {
                        this.shipTo = shipTo;
                    }
                });
                this.focusOnFirstEnabledShipToInput();
            }
            else if (selectedShipTo) {
                shipTos.forEach(shipTo => {
                    if (shipTo.id === selectedShipTo.id) {
                        this.shipTo = shipTo;
                    }
                });
            } else {
                this.shipTo = shipTos[0];
            }

            if (this.shipTo && this.shipTo.id === this.billTo.id) {
                // Don't allow editing the Bill To from the Ship To column.  Only allow
                // editing of Bill To from the Bill To column. So, if ship to is the bill to change
                // the ship to fields to readonly.
                this.isReadOnly = true;
            }
            this.shipToAddresses = shipTos;
        }

        protected getCountriesFailed(error: any): void {
        }

        setObjectToReference(references, object, objectPropertyName): void {
            references.forEach(reference => {
                if (object[objectPropertyName] && (reference.id === object[objectPropertyName].id)) {
                    object[objectPropertyName] = reference;
                }
            });
        }

        setStateRequiredRule(prefix: string, address: any): void {
            const isRequired = address.country != null && address.country.states.length > 0;
            setTimeout(() => {
                $(`#${prefix}state`).rules("add", { required: isRequired });
            }, 100);

        }

        checkSelectedShipTo(): void {
            if (this.billToAndShipToAreSameCustomer()) {
                this.isReadOnly = true;
            } else {
                this.isReadOnly = false;
            }

            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.shipTo);
                this.setStateRequiredRule("st", this.shipTo);
            }

            this.updateAddressFormValidation();
        }

        protected onlyOneCountryToSelect(): boolean {
            return this.countries.length === 1;
        }

        protected selectFirstCountryForAddress(address: BaseAddressModel): void {
            if (!address.country) {
                address.country = this.countries[0];
            }
        }

        protected billToAndShipToAreSameCustomer(): boolean {
            return this.shipTo.id === this.billTo.id;
        }

        protected updateAddressFormValidation(): void {
            this.resetAddressFormValidation();
            this.updateValidationRules("stfirstname", this.shipTo.validation.firstName);
            this.updateValidationRules("stlastname", this.shipTo.validation.lastName);
            this.updateValidationRules("stattention", this.shipTo.validation.attention);
            this.updateValidationRules("stcompanyName", this.shipTo.validation.companyName);
            this.updateValidationRules("staddress1", this.shipTo.validation.address1);
            this.updateValidationRules("staddress2", this.shipTo.validation.address2);
            this.updateValidationRules("staddress3", this.shipTo.validation.address3);
            this.updateValidationRules("staddress4", this.shipTo.validation.address4);
            this.updateValidationRules("stcountry", this.shipTo.validation.country);
            this.updateValidationRules("ststate", this.shipTo.validation.state);
            this.updateValidationRules("stcity", this.shipTo.validation.city);
            this.updateValidationRules("stpostalCode", this.shipTo.validation.postalCode);
            this.updateValidationRules("stphone", this.shipTo.validation.phone);
            this.updateValidationRules("stfax", this.shipTo.validation.fax);
            this.updateValidationRules("stemail", this.shipTo.validation.email);
        }

        protected resetAddressFormValidation(): void {
            $("#addressForm").validate().resetForm();
        }

        protected updateValidationRules(fieldName, rules): void {
            const convertedRules = this.convertValidationToJQueryRules(rules);
            this.updateValidationRulesForField(fieldName, convertedRules);
        }

        protected convertValidationToJQueryRules(rules: FieldValidationDto): JQueryValidation.RulesDictionary {
            if (rules.maxLength) {
                return {
                    required: rules.isRequired,
                    maxlength: rules.maxLength
                };
            }

            return {
                required: rules.isRequired
            };
        }

        protected updateValidationRulesForField(fieldName: string, rules: JQueryValidation.RulesDictionary): void {
            $(`#${fieldName}`).rules("remove", "required,maxlength");
            $(`#${fieldName}`).rules("add", rules);
        }

        private focusOnFirstEnabledShipToInput() {
            setTimeout(() => {
                const formInput = $(".shipping-info input:enabled:first");
                if (formInput.length) {
                    formInput.focus();
                }
            });
        }

        editBtAddress(address: BillToModel) {
            this.shipTo = this.billToInShipTos;
            address.properties["edit"] = "true";
            this.editMode = true;
        }

        editAddress(address: ShipToModel) {
            this.shipTo = address;
            address.properties["edit"] = "true";
            this.editMode = true;
        }

        cancelEdit(address: ShipToModel, id: string) {
            address.properties["edit"] = "false";
            this.editMode = false;
            this.scrollToElement(id);
        }

        createAddress() {
            this.createNewShipTo.properties["edit"] = "true";
            this.shipTo = this.createNewShipTo;
            this.editMode = true;
        }

        scrollToElement(id: string) {
            setTimeout(() => {
                $("html, body").animate({
                        scrollTop: ($(`#shipTo${id}`).offset().top)
                    },500);
            },100);
        }
    }

    angular
        .module("insite")
        .controller("NbfMyAccountAddressController", NbfMyAccountAddressController);
}