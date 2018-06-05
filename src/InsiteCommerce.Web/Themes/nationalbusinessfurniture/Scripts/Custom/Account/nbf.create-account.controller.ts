module insite.account {
    "use strict";

    export class NbfCreateAccountController {
        createError: string;
        email: string;
        isSubscribed: boolean;
        password: string;
        returnUrl: string;
        settings: AccountSettingsModel;
        session: SessionModel;

        userFirstName: string;
        userLastName: string;
        userPhone: string;

        //Address form variables
        billTo: BillToModel;
        countries: CountryModel[];
        shipTo: ShipToModel;
        isReadOnly = false;
        addressFields: AddressFieldCollectionModel;
        shipToSameAsBillTo = true;

        static $inject = [
            "accountService",
            "sessionService",
            "coreService",
            "settingsService",
            "queryString",
            "accessToken",
            "spinnerService",
            "$q",
            "websiteService",
            "customerService",
            "$localStorage",
            "$location",
            "nbfGuestActivationService",
            "listrakService",
            "$rootScope"
        ];

        constructor(
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected coreService: core.ICoreService,
            protected settingsService: core.ISettingsService,
            protected queryString: common.IQueryStringService,
            protected accessToken: common.IAccessTokenService,
            protected spinnerService: core.SpinnerService,
            protected $q: ng.IQService,
            protected websiteService: websites.IWebsiteService,
            protected customerService: customers.ICustomerService,
            protected $localStorage: common.IWindowStorage,
            protected $location: ng.ILocaleService,
            protected nbfGuestActivationService: nbf.guest.INbfGuestActivationService,
            protected listrakService: nbf.listrak.IListrakService,
            protected $rootScope: ng.IRootScopeService) {
            this.init();
        }

        init(): void {
            this.returnUrl = this.queryString.get("returnUrl");

            this.getSession();

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });
        }

        isUnauthenticated() {
            return this.session && !this.session.isAuthenticated;
        }

        getAddressFields() {
            this.websiteService.getAddressFields().then(
                (addressFieldCollection: AddressFieldCollectionModel) => { this.getAddressFieldsCompleted(addressFieldCollection); },
                (error: any) => { this.getAddressFieldsFailed(error); });
        }

        getSession() {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); });
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.session = session;
            if (this.isUnauthenticated()) {
                this.useTempGuest();
            } else {
                this.getAddressFields();
            }
        }

        protected getSessionFailed(error: any): void {
        }

        useTempGuest(): void {
            const account = { isGuest: true } as AccountModel;
            this.spinnerService.show("mainLayout", true);
            this.accountService.createAccount(account).then(
                (createdAccount: AccountModel) => { this.createGuestAccountCompleted(createdAccount); },
                (error: any) => { this.createGuestAccountFailed(error); });
        }

        protected createGuestAccountCompleted(account: AccountModel): void {
            this.$localStorage.set("guestId", account.password);
            this.accessToken.generate(account.userName, account.password).then(
                (accessTokenDto: common.IAccessTokenDto) => { this.generateAccessTokenForGuestAccountCreationCompleted(accessTokenDto); },
                (error: any) => { this.generateAccessTokenForGuestAccountCreationFailed(error); });
        }

        protected createGuestAccountFailed(error: any): void {
            
        }

        protected generateAccessTokenForGuestAccountCreationCompleted(accessTokenDto: common.IAccessTokenDto): void {
            this.accessToken.set(accessTokenDto.accessToken);
            this.spinnerService.hide("mainLayout");
            //this.getSession();
            this.getAddressFields();
        }

        protected generateAccessTokenForGuestAccountCreationFailed(error: any): void {

        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.settings = settingsCollection.accountSettings;
        }

        protected getSettingsFailed(error: any): void {
        }

        createAccount(): void {
            this.createError = "";

            const valid = $("#createAccountForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);
                return;
            }

            this.spinnerService.show("mainLayout", true);

            this.nbfGuestActivationService.checkUserName(this.email).then(
                (response) => {
                    if (response) {
                        this.createError = "User name already exists";
                        this.spinnerService.hide("mainLayout");
                    } else {
                        this.accountService.getAccount().then(
                            (account: AccountModel) => {
                                const newAccount = {
                                    email: this.email,
                                    userName: this.email,
                                    password: this.password,
                                    firstName: this.userFirstName,
                                    lastName: this.userLastName,
                                    isSubscribed: this.isSubscribed,
                                    billToId: this.billTo.id as System.Guid,
                                    shipToId: this.shipTo.id as System.Guid
                                } as AccountModel;

                                //AccountModel has no value for phone, assign to user's billto address
                                this.billTo.phone = this.userPhone;
                                this.shipTo.phone = this.userPhone;
                                this.billTo.email = this.email;
                                this.shipTo.email = this.email;

                                this.nbfGuestActivationService
                                    .createAccountFromGuest(account.id, newAccount, this.billTo, this.shipTo).then(
                                    (accountResult: AccountModel) => { this.createAccountCompleted(accountResult); },
                                        (error: any) => { this.createAccountFailed(error); }
                                    );
                            },
                            (error: any) => { this.createAccountFailed(error); });
                    }
                });
        }

        protected createAccountCompleted(account: AccountModel): void {
            this.$rootScope.$broadcast("AnalyticsEvent", "AccountCreation");
            const currentContext = this.sessionService.getContext();
            currentContext.billToId = account.billToId;
            currentContext.shipToId = account.shipToId;
            this.listrakService.CreateContact(account.email, "account");
            this.sessionService.setContext(currentContext);
            this.sessionService.getSession().then(() => {
                this.coreService.redirectToPathAndRefreshPage(this.returnUrl);
            });
        }

        protected createAccountFailed(error: any): void {
            this.spinnerService.hide("mainLayout");
            this.createError = error.message;
        }

        //ADDRESS CONTROLLER METHODS

        protected getAddressFieldsCompleted(addressFieldCollection: AddressFieldCollectionModel): void {
            this.addressFields = addressFieldCollection;
            this.addressFields.billToAddressFields.email.isVisible = false;
            this.addressFields.shipToAddressFields.email.isVisible = false;
            this.addressFields.billToAddressFields.phone.isVisible = false;
            this.addressFields.shipToAddressFields.phone.isVisible = false;
            this.getBillTo(this.session.shipTo);
        }

        protected getAddressFieldsFailed(error: any): void {
        }
        

        save(): void {
            const valid = angular.element("#createAccountForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);

                return;
            }
        }

        protected updateBillToCompleted(billTo: BillToModel): void {
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

                this.coreService.redirectToPathAndRefreshPage(this.returnUrl);
            }
        }

        protected updateBillToFailed(error: any): void {
            alert("fail");
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


            this.coreService.redirectToPathAndRefreshPage(this.returnUrl);
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

            let billToInShipTos: ShipToModel;
            shipTos.forEach(shipTo => {
                this.setObjectToReference(this.countries, shipTo, "country");
                if (shipTo.country) {
                    this.setObjectToReference(shipTo.country.states, shipTo, "state");
                }

                if (shipTo.id === this.billTo.id) {
                    billToInShipTos = shipTo;
                }
            });

            // if allow ship to billing address, remove the billto returned in the shipTos array and put in the actual billto object
            // so that updating one side updates the other side
            if (billToInShipTos) {
                this.billTo.label = billToInShipTos.label;
                shipTos.splice(shipTos.indexOf(billToInShipTos), 1); // remove the billto that's in the shiptos array
                shipTos.unshift((this.billTo as any) as ShipToModel); // add the actual billto to top of array
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
            if (this.shipToSameAsBillTo) {
                this.shipTo = this.billTo.shipTos[0];
                this.isReadOnly = true;
            } else {
                this.shipTo = this.billTo.shipTos[1];
                this.isReadOnly = false;
            }

            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.shipTo);
                this.setStateRequiredRule("st", this.shipTo);
            }

            this.updateFormValidation();
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

        protected updateFormValidation(): void {
            this.resetFormValidation();
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

        protected resetFormValidation(): void {
            $("#createAccountForm").validate().resetForm();
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
    }

    angular
        .module("insite")
        .controller("NbfCreateAccountController", NbfCreateAccountController);
}