module insite.cart {
    "use strict";
    import SessionService = insite.account.ISessionService;
    import ShipToModel = Insite.Customers.WebApi.V1.ApiModels.ShipToModel;

    export class NbfCheckoutController {
        cart: CartModel;
        cartId: string;
        countries: CountryModel[];
        selectedShipTo: ShipToModel;
        shipTos: ShipToModel[];
        continueCheckoutInProgress = false;
        isReadOnly = false;
        account: AccountModel;
        initialIsSubscribed: boolean;
        addressFields: AddressFieldCollectionModel;
        customerSettings: any;
        cartUri: string;
        initialShipToId: string;
        step: number = 0;

        static $inject = [
            "$scope",
            "$window",
            "cartService",
            "customerService",
            "websiteService",
            "coreService",
            "queryString",
            "accountService",
            "settingsService",
            "$timeout",
            "$q",
            "sessionService",
            "$localStorage"
        ];

        constructor(
            protected $scope: ICartScope,
            protected $window: ng.IWindowService,
            protected cartService: ICartService,
            protected customerService: customers.ICustomerService,
            protected websiteService: websites.IWebsiteService,
            protected coreService: core.ICoreService,
            protected queryString: common.IQueryStringService,
            protected accountService: account.IAccountService,
            protected settingsService: core.ISettingsService,
            protected $timeout: ng.ITimeoutService,
            protected $q: ng.IQService,
            protected sessionService: SessionService,
            protected $localStorage: common.IWindowStorage) {
            this.init();
        }

        init(): void {
            this.cartId = this.queryString.get("cartId");

            this.websiteService.getAddressFields().then(
                (model: AddressFieldCollectionModel) => { this.getAddressFieldsCompleted(model); });

            this.accountService.getAccount().then(
                (account: AccountModel) => { this.getAccountCompleted(account); },
                (error: any) => { this.getAccountFailed(error); });

            this.settingsService.getSettings().then(
                (settingsCollection: core.SettingsCollection) => { this.getSettingsCompleted(settingsCollection); },
                (error: any) => { this.getSettingsFailed(error); });


            ($(document) as any).foundation({
                accordion: {
                    // specify the class used for accordion panels
                    content_class: "content",
                    // specify the class used for active (or open) accordion panels
                    active_class: "active",
                    // allow multiple accordion panels to be active at the same time
                    multi_expand: true,
                    // allow accordion panels to be closed by clicking on their headers
                    // setting to false only closes accordion panels when another is opened
                    toggleable: false
                }
            });

            $(".accordion-navigation a").click(e => {
                if (e.target.id.indexOf(this.step.toString()) === -1) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });
        }

        protected getSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.customerSettings = settingsCollection.customerSettings;
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getAddressFieldsCompleted(addressFields: AddressFieldCollectionModel): void {
            this.addressFields = addressFields;

            this.cartService.expand = "shiptos,validation";
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => { this.getCartCompleted(cart); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getCartCompleted(cart: CartModel): void {
            this.cartService.expand = "";
            this.cart = cart;
            this.initialShipToId = this.cart.shipTo.id;

            this.websiteService.getCountries("states").then(
                (countryCollection: CountryCollectionModel) => { this.getCountriesCompleted(countryCollection); },
                (error: any) => { this.getCountriesFailed(error); });
        }

        protected getCartFailed(error: any): void {
            this.cartService.expand = "";
        }

        protected getAccountCompleted(account: AccountModel): void {
            this.account = account;
            this.initialIsSubscribed = account.isSubscribed;
        }

        protected getAccountFailed(error: any): void {
        }

        protected getCountriesCompleted(countryCollection: CountryCollectionModel) {
            this.countries = countryCollection.countries;
            this.setUpBillTo();
            this.setUpShipTos();
            this.setSelectedShipTo();
        }

        protected getCountriesFailed(error: any): void {
        }

        protected setUpBillTo(): void {
            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.cart.billTo);
                this.setStateRequiredRule("bt", this.cart.billTo);
            }

            this.replaceObjectWithReference(this.cart.billTo, this.countries, "country");
            if (this.cart.billTo.country) {
                this.replaceObjectWithReference(this.cart.billTo, this.cart.billTo.country.states, "state");
            }
        }

        protected setUpShipTos(): void {
            this.shipTos = angular.copy(this.cart.billTo.shipTos);

            let shipToBillTo: ShipToModel = null;
            this.shipTos.forEach(shipTo => {
                if (shipTo.country && shipTo.country.states) {
                    this.replaceObjectWithReference(shipTo, this.countries, "country");
                    this.replaceObjectWithReference(shipTo, shipTo.country.states, "state");
                }

                if (shipTo.id === this.cart.billTo.id) {
                    shipToBillTo = shipTo;
                }
            });

            // if this billTo was returned in the shipTos, replace the billTo in the shipTos array
            // with the actual billto object so that updating one side updates the other side
            if (shipToBillTo) {
                this.cart.billTo.label = shipToBillTo.label;
                this.shipTos.splice(this.shipTos.indexOf(shipToBillTo), 1); // remove the billto that's in the shiptos array
                this.shipTos.unshift(this.cart.billTo as any as ShipToModel); // add the actual billto to top of array
            }
        }

        protected setSelectedShipTo(): void {
            this.selectedShipTo = this.cart.shipTo;

            this.shipTos.forEach(shipTo => {
                if (this.cart.shipTo && shipTo.id === this.cart.shipTo.id || !this.selectedShipTo && shipTo.isNew) {
                    this.selectedShipTo = shipTo;
                }
            });

            if (this.selectedShipTo && this.selectedShipTo.id === this.cart.billTo.id) {
                // don't allow editing the billTo from the shipTo side if the billTo is selected as the shipTo
                this.isReadOnly = true;
            }
        }

        checkSelectedShipTo(): void {
            if (this.billToAndShipToAreSameCustomer()) {
                this.isReadOnly = true;
            } else {
                this.isReadOnly = false;
            }

            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.selectedShipTo);
                this.setStateRequiredRule("st", this.selectedShipTo);
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
            return this.selectedShipTo.id === this.cart.billTo.id;
        }

        protected updateAddressFormValidation(): void {
            this.resetAddressFormValidation();
            this.updateValidationRules("stfirstname", this.selectedShipTo.validation.firstName);
            this.updateValidationRules("stlastname", this.selectedShipTo.validation.lastName);
            this.updateValidationRules("stattention", this.selectedShipTo.validation.attention);
            this.updateValidationRules("stcompanyName", this.selectedShipTo.validation.companyName);
            this.updateValidationRules("staddress1", this.selectedShipTo.validation.address1);
            this.updateValidationRules("staddress2", this.selectedShipTo.validation.address2);
            this.updateValidationRules("staddress3", this.selectedShipTo.validation.address3);
            this.updateValidationRules("staddress4", this.selectedShipTo.validation.address4);
            this.updateValidationRules("stcountry", this.selectedShipTo.validation.country);
            this.updateValidationRules("ststate", this.selectedShipTo.validation.state);
            this.updateValidationRules("stcity", this.selectedShipTo.validation.city);
            this.updateValidationRules("stpostalCode", this.selectedShipTo.validation.postalCode);
            this.updateValidationRules("stphone", this.selectedShipTo.validation.phone);
            this.updateValidationRules("stfax", this.selectedShipTo.validation.fax);
            this.updateValidationRules("stemail", this.selectedShipTo.validation.email);
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

        setStateRequiredRule(prefix: string, address: any): void {
            const isRequired = address.country != null && address.country.states.length > 0;
            $(`#${prefix}state`).rules("add", { required: isRequired });
        }

        continueCheckout(continueUri: string, cartUri: string): void {
            const valid = $("#addressForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);

                return;
            }

            this.continueCheckoutInProgress = true;
            this.cartUri = cartUri;

            if (this.cartId) {
                continueUri += `?cartId=${this.cartId}`;
            }

            // if no changes, redirect to next step
            if (this.$scope.addressForm.$pristine) {
                this.coreService.redirectToPath(continueUri);
                return;
            }

            // if the ship to has been changed, set the shipvia to null so it isn't set to a ship via that is no longer valid
            if (this.cart.shipTo && this.cart.shipTo.id !== this.selectedShipTo.id) {
                this.cart.shipVia = null;
            }

            if (this.customerSettings.allowBillToAddressEdit) {
                this.customerService.updateBillTo(this.cart.billTo).then(
                    (billTo: BillToModel) => { this.updateBillToCompleted(billTo); },
                    (error: any) => { this.updateBillToFailed(error); });
            } else {
                this.updateShipTo();
            }
        }

        continueToStep2(cartUri: string): void {
            const valid = $("#addressForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);

                return;
            }

            this.continueCheckoutInProgress = true;
            this.cartUri = cartUri;

            // if no changes, redirect to next step
            if (this.$scope.addressForm.$pristine) {
                this.loadStep2();
                return;
            }

            // if the ship to has been changed, set the shipvia to null so it isn't set to a ship via that is no longer valid
            if (this.cart.shipTo && this.cart.shipTo.id !== this.selectedShipTo.id) {
                this.cart.shipVia = null;
            }

            if (this.customerSettings.allowBillToAddressEdit) {
                this.customerService.updateBillTo(this.cart.billTo).then(
                    (billTo: BillToModel) => { this.updateBillToCompleted(billTo); },
                    (error: any) => { this.updateBillToFailed(error); });
            } else {
                this.updateShipTo();
            }
        }

        protected updateBillToCompleted(billTo: BillToModel): void {
            this.updateShipTo(true);
        }

        protected updateBillToFailed(error: any): void {
            this.continueCheckoutInProgress = false;
        }

        protected updateShipTo(customerWasUpdated?: boolean): void {
            if (this.customerSettings.allowShipToAddressEdit) {
                const shipToMatches = this.cart.billTo.shipTos.filter(shipTo => { return shipTo.id === this.selectedShipTo.id; });
                if (shipToMatches.length === 1) {
                    this.cart.shipTo = this.selectedShipTo;
                }

                if (this.cart.shipTo.id !== this.cart.billTo.id) {
                    this.customerService.addOrUpdateShipTo(this.cart.shipTo).then(
                        (shipTo: ShipToModel) => { this.addOrUpdateShipToCompleted(shipTo, customerWasUpdated); },
                        (error: any) => { this.addOrUpdateShipToFailed(error); });
                } else {
                    this.updateSession(this.cart, customerWasUpdated);
                }
            } else {
                this.updateSession(this.cart, customerWasUpdated);
            }
        }

        protected addOrUpdateShipToCompleted(shipTo: ShipToModel, customerWasUpdated?: boolean): void {
            if (this.cart.shipTo.isNew) {
                this.cart.shipTo = shipTo;
            }

            this.updateSession(this.cart, customerWasUpdated);
        }

        protected addOrUpdateShipToFailed(error: any): void {
            this.continueCheckoutInProgress = false;
        }

        protected getCartAfterChangeShipTo(cart: CartModel): void {
            this.cartService.expand = "cartlines,shiptos,validation";
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => { this.getCartAfterChangeShipToCompleted(cart); },
                (error: any) => { this.getCartAfterChangeShipToFailed(error); });
        }

        protected getCartAfterChangeShipToCompleted(cart: CartModel): void {
            this.cartService.expand = "";
            this.cart = cart;

            if (!cart.canCheckOut) {
                this.coreService.displayModal(angular.element("#insufficientInventoryAtCheckout"), () => {
                    this.loadStep2();
                });

                this.$timeout(() => {
                    this.coreService.closeModal("#insufficientInventoryAtCheckout");
                }, 3000);
            } else {
                if (this.initialIsSubscribed !== this.account.isSubscribed) {
                    this.accountService.updateAccount(this.account).then(
                        (response: AccountModel) => { this.updateAccountCompleted(this.cart); },
                        (error: any) => { this.updateAccountFailed(error); });
                } else {
                    this.loadStep2();
                }
            }
        }

        protected getCartAfterChangeShipToFailed(error: any): void {
            this.continueCheckoutInProgress = false;
        }

        protected updateSession(cart: CartModel, customerWasUpdated?: boolean): void {
            this.sessionService.setCustomer(this.cart.billTo.id, this.cart.shipTo.id, false, customerWasUpdated).then(
                (session: SessionModel) => { this.updateSessionCompleted(session, this.cart); },
                (error: any) => { this.updateSessionFailed(error); });
        }

        protected updateAccountCompleted(cart: CartModel): void {
            this.loadStep2();
        }

        protected updateAccountFailed(error: any): void {
            this.continueCheckoutInProgress = false;
        }

        protected replaceObjectWithReference(model, references, objectPropertyName): void {
            references.forEach(reference => {
                if (model[objectPropertyName] && reference.id === model[objectPropertyName].id) {
                    model[objectPropertyName] = reference;
                }
            });
        }

        protected updateSessionCompleted(session: SessionModel, cart: CartModel) {
            if (session.isRestrictedProductRemovedFromCart) {
                this.$localStorage.set("hasRestrictedProducts", true.toString());
                this.loadStep2();
            } else {
                this.getCartAfterChangeShipTo(this.cart);
            }
        }

        protected updateSessionFailed(error) {
            this.continueCheckoutInProgress = false;
        }

        protected redirectTo(continueUri: string) {
            if (this.initialShipToId === this.cart.shipTo.id) {
                this.coreService.redirectToPath(continueUri);
            } else {
                this.coreService.redirectToPathAndRefreshPage(continueUri);
            }
        }

        protected loadStep2() {
            $("#nav1expanded").hide();
            $("#nav1min").show();
            this.step = 2;
            $("#payment").addClass("active");
            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: $("#nav1").offset().top
            }, 200);
        }
    }

    angular
        .module("insite")
        .controller("NbfCheckoutController", NbfCheckoutController);
}