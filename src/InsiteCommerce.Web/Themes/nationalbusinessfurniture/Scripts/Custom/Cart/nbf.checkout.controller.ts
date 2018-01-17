﻿module insite.cart {
    "use strict";
    import SessionService = account.ISessionService;
    import ShipToModel = Insite.Customers.WebApi.V1.ApiModels.ShipToModel;
    import StateModel = Insite.Websites.WebApi.V1.ApiModels.StateModel;

    export interface INbfCheckoutControllerAttributes extends ng.IAttributes {
        cartUrl: string;
    }

    export class NbfCheckoutController {
        //Address Variables
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

        //Review and Pay Variables
        cartIdParam: string;
        creditCardBillingCountry: CountryModel;
        creditCardBillingState: StateModel;
        promotions: PromotionModel[];
        promotionAppliedMessage: string;
        promotionErrorMessage: string;
        promotionCode: string;
        submitErrorMessage: string;
        submitting: boolean;
        cartUrl: string;
        cartSettings: CartSettingsModel;
        pageIsReady = false;
        showQuoteRequiredProducts: boolean;

        //Confirmation Variables
        showRfqMessage: boolean;
        order: OrderModel;

        //Account Creation Variables
        password: string;
        createError: string;

        orderNumber: string;

        static $inject = [
            "$scope",
            "$window",
            "cartService",
            "promotionService",
            "customerService",
            "websiteService",
            "coreService",
            "spinnerService",
            "$attrs",
            "queryString",
            "orderService",
            "accountService",
            "settingsService",
            "$timeout",
            "$q",
            "sessionService",
            "$localStorage",
            "accessToken"
        ];

        constructor(
            protected $scope: ICartScope,
            protected $window: ng.IWindowService,
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected customerService: customers.ICustomerService,
            protected websiteService: websites.IWebsiteService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService,
            protected $attrs: IReviewAndPayControllerAttributes,
            protected queryString: common.IQueryStringService,
            protected orderService: order.IOrderService,
            protected accountService: account.IAccountService,
            protected settingsService: core.ISettingsService,
            protected $timeout: ng.ITimeoutService,
            protected $q: ng.IQService,
            protected sessionService: SessionService,
            protected $localStorage: common.IWindowStorage,
            protected accessToken: common.IAccessTokenService) {
            this.init();
        }

        init(): void {
            this.cartId = this.queryString.get("cartId");

            //this.orderNumber = window.location.hash ? window.location.hash.replace('#', '') : '';

            //if (this.orderNumber.length > 0) {
            //    this.orderService.getOrder(this.orderNumber, "").then(
            //    (order: OrderModel) => {
            //        // this.loadStep3();
            //    },
            //    (error: any) => { alert("Not Found") });
            //}

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
            if (this.cart.shipTo && this.cart.shipTo.id) {
                this.initialShipToId = this.cart.shipTo.id;
            }

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
                        () => { this.updateAccountCompleted(this.cart); },
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
            this.continueCheckoutInProgress = false;

            this.reviewAndPayInit();

        }

        editAddresses() {
            $("#nav1expanded").show();
            $("#nav1min").hide();
            $("#payment").removeClass("active");
            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: $("#nav1").offset().top
            }, 200);
        }

        //Review and Pay Functionality

        reviewAndPayInit(): void {
            this.$scope.$on("cartChanged", (event: ng.IAngularEvent) => this.onCartChanged(event));

            this.cartUrl = this.$attrs.cartUrl;
            this.cartId = this.queryString.get("cartId") || "current";

            this.getCart(true);

            $("#reviewAndPayForm").validate();

            this.$scope.$watch("vm.cart.paymentOptions.creditCard.expirationYear", (year: number) => { this.onExpirationYearChanged(year); });
            this.$scope.$watch("vm.cart.paymentOptions.creditCard.useBillingAddress", (useBillingAddress: boolean) => { this.onUseBillingAddressChanged(useBillingAddress); });
            this.$scope.$watch("vm.creditCardBillingCountry", (country: CountryModel) => { this.onCreditCardBillingCountryChanged(country); });
            this.$scope.$watch("vm.creditCardBillingState", (state: StateModel) => { this.onCreditCardBillingStateChanged(state); });

            this.onUseBillingAddressChanged(true);

            this.settingsService.getSettings().then(
                (settings: core.SettingsCollection) => { this.getCartSettingsCompleted(settings); },
                (error: any) => { this.getCartSettingsFailed(error); });

            this.websiteService.getCountries("states").then(
                (countryCollection: CountryCollectionModel) => { this.getCountriesCompletedForReviewAndPay(countryCollection); },
                (error: any) => { this.getCountriesFailedForReviewAndPay(error); });
        }

        protected onCartChanged(event: ng.IAngularEvent): void {
            this.getCart();
        }

        protected onExpirationYearChanged(year: number): void {
            if (year) {
                const now = new Date();
                const minMonth = now.getFullYear() === year ? now.getMonth() : 0;
                $("#expirationMonth").rules("add", { min: minMonth });
                $("#expirationMonth").valid();
            }
        }

        protected onUseBillingAddressChanged(useBillingAddress: boolean): void {
            if (!useBillingAddress) {
                if (typeof (this.countries) !== "undefined" && this.countries.length === 1) {
                    this.creditCardBillingCountry = this.countries[0];
                }
            }
        }

        protected onCreditCardBillingCountryChanged(country: CountryModel): void {
            if (typeof (country) !== "undefined" && this.cart.paymentOptions) {
                if (country != null) {
                    this.cart.paymentOptions.creditCard.country = country.name;
                    this.cart.paymentOptions.creditCard.countryAbbreviation = country.abbreviation;
                } else {
                    this.cart.paymentOptions.creditCard.country = "";
                    this.cart.paymentOptions.creditCard.countryAbbreviation = "";
                }
            }
        }

        protected onCreditCardBillingStateChanged(state: StateModel): void {
            if (typeof (state) !== "undefined" && this.cart.paymentOptions) {
                if (state != null) {
                    this.cart.paymentOptions.creditCard.state = state.name;
                    this.cart.paymentOptions.creditCard.stateAbbreviation = state.abbreviation;
                } else {
                    this.cart.paymentOptions.creditCard.state = "";
                    this.cart.paymentOptions.creditCard.stateAbbreviation = "";
                }
            }
        }

        protected getCartSettingsCompleted(settingsCollection: core.SettingsCollection): void {
            this.cartSettings = settingsCollection.cartSettings;
        }

        protected getCartSettingsFailed(error: any): void {
        }

        protected getCountriesCompletedForReviewAndPay(countryCollection: CountryCollectionModel) {
            this.countries = countryCollection.countries;
        }

        protected getCountriesFailedForReviewAndPay(error: any): void {
        }

        getCart(isInit?: boolean): void {
            this.cartService.expand = "cartlines,shipping,tax,carriers,paymentoptions";
            if (this.$localStorage.get("hasRestrictedProducts") === true.toString()) {
                this.cartService.expand += ",restrictions";
            }
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => { this.getCartCompletedForReviewAndPay(cart, isInit); },
                (error: any) => { this.getCartFailed(error); });
        }

        protected getCartCompletedForReviewAndPay(cart: CartModel, isInit: boolean): void {
            this.cartService.expand = "";
            let paymentMethod: Insite.Cart.Services.Dtos.PaymentMethodDto;
            let transientCard: Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto;

            if (this.cart && this.cart.paymentOptions) {
                paymentMethod = this.cart.paymentMethod;
                transientCard = this.saveTransientCard();
            }

            this.cart = cart;

            const hasRestrictions = cart.cartLines.some(o => o.isRestricted);
            // if cart does not have cartLines or any cartLine is restricted, go to Cart page
            if (!this.cart.cartLines || this.cart.cartLines.length === 0 || hasRestrictions) {
                this.coreService.redirectToPath(this.cartUrl);
            }

            if (isInit) {
                this.showQuoteRequiredProducts = this.cart.status !== "Cart";
            }

            this.cartIdParam = this.cart.id === "current" ? "" : `?cartId=${this.cart.id}`;

            if (transientCard) {
                this.restoreTransientCard(transientCard);
            }

            this.setUpCarrier(isInit);
            this.setUpShipVia(isInit);
            this.setUpPaymentMethod(isInit, paymentMethod || this.cart.paymentMethod);
            this.setUpPayPal(isInit);

            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => { this.getCartPromotionsCompleted(promotionCollection); },
                (error: any) => { this.getCartPromotionsFailed(error); });

            if (!isInit) {
                this.pageIsReady = true;
            }
        }

        protected saveTransientCard(): Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto {
            return {
                cardType: this.cart.paymentOptions.creditCard.cardType,
                cardHolderName: this.cart.paymentOptions.creditCard.cardHolderName,
                cardNumber: this.cart.paymentOptions.creditCard.cardNumber,
                expirationMonth: this.cart.paymentOptions.creditCard.expirationMonth,
                expirationYear: this.cart.paymentOptions.creditCard.expirationYear,
                securityCode: this.cart.paymentOptions.creditCard.securityCode,
                useBillingAddress: this.cart.paymentOptions.creditCard.useBillingAddress,
                address1: this.cart.paymentOptions.creditCard.address1,
                city: this.cart.paymentOptions.creditCard.city,
                state: this.cart.paymentOptions.creditCard.state,
                stateAbbreviation: this.cart.paymentOptions.creditCard.stateAbbreviation,
                postalCode: this.cart.paymentOptions.creditCard.postalCode,
                country: this.cart.paymentOptions.creditCard.country,
                countryAbbreviation: this.cart.paymentOptions.creditCard.countryAbbreviation
            };
        }

        protected restoreTransientCard(transientCard: Insite.Core.Plugins.PaymentGateway.Dtos.CreditCardDto): void {
            this.cart.paymentOptions.creditCard.cardType = transientCard.cardType;
            this.cart.paymentOptions.creditCard.cardHolderName = transientCard.cardHolderName;
            this.cart.paymentOptions.creditCard.cardNumber = transientCard.cardNumber;
            this.cart.paymentOptions.creditCard.expirationMonth = transientCard.expirationMonth;
            this.cart.paymentOptions.creditCard.expirationYear = transientCard.expirationYear;
            this.cart.paymentOptions.creditCard.securityCode = transientCard.securityCode;
        }

        protected setUpCarrier(isInit: boolean): void {
            this.cart.carriers.forEach(carrier => {
                if (carrier.id === this.cart.carrier.id) {
                    this.cart.carrier = carrier;
                    if (isInit) {
                        this.updateCarrier();
                    }
                }
            });
        }

        protected setUpShipVia(isInit: boolean): void {
            if (this.cart.carrier && this.cart.carrier.shipVias) {
                this.cart.carrier.shipVias.forEach(shipVia => {
                    if (shipVia.id === this.cart.shipVia.id) {
                        this.cart.shipVia = shipVia;
                    }
                });
            }
        }

        protected setUpPaymentMethod(isInit: boolean, selectedMethod: Insite.Cart.Services.Dtos.PaymentMethodDto): void {
            if (selectedMethod) {
                this.cart.paymentOptions.paymentMethods.forEach(paymentMethod => {
                    if (paymentMethod.name === selectedMethod.name) {
                        this.cart.paymentMethod = paymentMethod;
                    }
                });
            } else if (this.cart.paymentOptions.paymentMethods.length === 1) {
                this.cart.paymentMethod = this.cart.paymentOptions.paymentMethods[0];
            }
        }

        protected setUpPayPal(isInit: boolean): void {
            const payerId = this.queryString.get("PayerID").toUpperCase();
            const token = this.queryString.get("token").toUpperCase();

            if (payerId && token) {
                this.cart.paymentOptions.isPayPal = true;
                this.cart.status = "Cart";
                this.cart.paymentOptions.payPalToken = token;
                this.cart.paymentOptions.payPalPayerId = payerId;
                this.cart.paymentMethod = null;
            }
        }
        
        protected getCartPromotionsCompleted(promotionCollection: PromotionCollectionModel): void {
            this.promotions = promotionCollection.promotions;
        }

        protected getCartPromotionsFailed(error: any): void {
        }

        updateCarrier(): void {
            if (this.cart.carrier && this.cart.carrier.shipVias) {
                if (this.cart.carrier.shipVias.length === 1 && this.cart.carrier.shipVias[0] !== this.cart.shipVia) {
                    this.cart.shipVia = this.cart.carrier.shipVias[0];
                    this.updateShipVia();
                } else if (this.cart.carrier.shipVias.length > 1 &&
                    this.cart.carrier.shipVias.every(sv => sv.id !== this.cart.shipVia.id) &&
                    this.cart.carrier.shipVias.filter(sv => sv.isDefault).length > 0) {
                    this.cart.shipVia = this.cart.carrier.shipVias.filter(sv => sv.isDefault)[0];
                    this.updateShipVia();
                } else {
                    this.pageIsReady = true;
                }
            } else {
                this.pageIsReady = true;
            }
        }

        updateShipVia(): void {
            this.cartService.updateCart(this.cart).then(
                (cart: CartModel) => { this.updateShipViaCompleted(cart); },
                (error: any) => { this.updateShipViaFailed(error); });
        }

        protected updateShipViaCompleted(cart: CartModel): void {
            this.getCart();
        }

        protected updateShipViaFailed(error: any): void {
        }

        submit(signInUri: string): void {
            this.submitting = true;
            this.submitErrorMessage = "";


            if (!this.validateReviewAndPayForm()) {
                this.submitting = false;
                return;
            }

            var pass = $("#CreateNewAccountInfo_Password").val();
            if (pass) {
                const newAccount = {
                    email: this.cart.billTo.email,
                    userName: this.cart.billTo.email,
                    password: pass,
                    isSubscribed: true,
                    firstName: this.cart.billTo.firstName,
                    lastName: this.cart.billTo.lastName
                } as AccountModel;
                var cart = this.cart;

                this.sessionService.signOut().then(() => {
                    this.accountService.createAccount(newAccount).then(
                        (createdAccount: AccountModel) => {
                            this.createAccountFromGuestCompleted(createdAccount, pass, signInUri, cart);
                        },
                        (error: any) => {
                            this.createAccountFailed(error);
                        });
                });
            } else {
                this.submitOrder(signInUri);
            }
        }

        protected submitOrder(signInUri: string) {
            this.sessionService.getIsAuthenticated().then(
                (isAuthenticated: boolean) => { this.getIsAuthenticatedForSubmitCompleted(isAuthenticated, signInUri); },
                (error: any) => { this.getIsAuthenticatedForSubmitFailed(error); });
        }

        protected getIsAuthenticatedForSubmitCompleted(isAuthenticated: boolean, signInUri: string): void {
            if (!isAuthenticated) {
                this.coreService.redirectToPath(`${signInUri}?returnUrl=${this.coreService.getCurrentPath()}`);
                return;
            }
            if (this.cart.requiresApproval) {
                this.cart.status = "AwaitingApproval";
            } else {
                this.cart.status = "Submitted";
            }

            this.cart.requestedDeliveryDate = this.formatWithTimezone(this.cart.requestedDeliveryDate);


            debugger;

            this.spinnerService.show("mainLayout", true);
            this.cartService.updateCart(this.cart, true).then(
                (cart: CartModel) => { this.submitCompleted(cart); },
                (error: any) => { this.submitFailed(error); });
        }

        private formatWithTimezone(date: string): string {
            return date ? moment(date).format() : date;
        }

        protected getIsAuthenticatedForSubmitFailed(error: any): void {
        }

        protected submitCompleted(cart: CartModel): void {
            debugger;
            this.cart.id = cart.id;
            this.cartService.getCart();
            this.loadStep3();
            this.spinnerService.hide();
        }

        protected submitFailed(error: any): void {
            this.submitting = false;
            this.cart.paymentOptions.isPayPal = false;
            this.submitErrorMessage = error.message;
            this.spinnerService.hide();
        }

        submitPaypal(returnUri: string, signInUri: string): void {
            this.submitErrorMessage = "";
            this.cart.paymentOptions.isPayPal = true;

            setTimeout(() => {
                if (!this.validateReviewAndPayForm()) {
                    this.cart.paymentOptions.isPayPal = false;
                    return;
                }

                this.sessionService.getIsAuthenticated().then(
                    (isAuthenticated: boolean) => { this.getIsAuthenticatedForSubmitPaypalCompleted(isAuthenticated, returnUri, signInUri); },
                    (error: any) => { this.getIsAuthenticatedForSubmitPaypalFailed(error); });
            }, 0);
        }

        protected getIsAuthenticatedForSubmitPaypalCompleted(isAuthenticated: boolean, returnUri: string, signInUri: string): void {
            if (!isAuthenticated) {
                this.coreService.redirectToPath(`${signInUri}?returnUrl=${this.coreService.getCurrentPath()}`);
                return;
            }

            this.spinnerService.show("mainLayout", true);
            this.cart.paymentOptions.isPayPal = true;
            this.cart.paymentOptions.payPalPaymentUrl = this.$window.location.host + returnUri;
            this.cart.paymentMethod = null;
            this.cart.status = "PaypalSetup";
            this.cartService.updateCart(this.cart, true).then(
                (cart: CartModel) => { this.submitPaypalCompleted(cart); },
                (error: any) => { this.submitPaypalFailed(error); });
        }

        protected getIsAuthenticatedForSubmitPaypalFailed(error: any): void {
            this.cart.paymentOptions.isPayPal = false;
        }

        protected submitPaypalCompleted(cart: CartModel): void {
            // full redirect to paypal
            this.$window.location.href = cart.paymentOptions.payPalPaymentUrl;
        }

        protected submitPaypalFailed(error: any): void {
            this.cart.paymentOptions.isPayPal = false;
            this.submitErrorMessage = error.message;
            this.spinnerService.hide();
        }

        protected validateReviewAndPayForm(): boolean {
            const valid = $("#reviewAndPayForm").validate().form();
            if (!valid) {
                $("html, body").animate({
                    scrollTop: $("#reviewAndPayForm").offset().top
                }, 300);
                return false;
            }
            return true;
        }

        protected createAccountFromGuestCompleted(account: AccountModel, pass: string, signInUri: string, cart: CartModel): void {
            this.account = account;
            this.accessToken.generate(this.account.userName, pass).then(
                (accessToken: common.IAccessTokenDto) => { this.generateAccessTokenCompleted(account, accessToken, signInUri, cart); },
                (error: any) => { this.createAccountFailed(error); });
        }

        protected generateAccessTokenCompleted(account: AccountModel, accessToken: common.IAccessTokenDto, signInUri: string, cart: CartModel): void {
            this.accessToken.set(accessToken.accessToken);
            const currentContext = this.sessionService.getContext();
            currentContext.billToId = account.billToId;
            currentContext.shipToId = account.shipToId;
            cart.billTo.id = currentContext.billToId.toString();
            cart.billTo.isGuest = false;
            cart.shipTo.id = currentContext.shipToId.toString();
            cart.shipTo.isDefault = true;
            this.sessionService.setContext(currentContext);

            this.cart = cart;
            this.cart.initiatedByUserName = account.id;
            this.customerService.updateBillTo(this.cart.billTo).then(
                (billTo: BillToModel) => { this.updateGuestBillToCompleted(billTo, signInUri); },
                (error: any) => { this.updateGuestBillToFailed(error); });
        }

        protected updateGuestBillToCompleted(billTo: BillToModel, signInUri): void {
            this.updateGuestShipTo(signInUri, true);
        }

        protected updateGuestBillToFailed(error: any): void {
            
        }

        protected updateGuestShipTo(signInUri: string, customerWasUpdated?: boolean): void {
            if (this.customerSettings.allowShipToAddressEdit) {
                const shipToMatches = this.cart.billTo.shipTos.filter(shipTo => { return shipTo.id === this.selectedShipTo.id; });
                if (shipToMatches.length === 1) {
                    this.cart.shipTo = this.selectedShipTo;
                }

                if (this.cart.shipTo.id !== this.cart.billTo.id) {
                    this.customerService.addOrUpdateShipTo(this.cart.shipTo).then(
                        (shipTo: ShipToModel) => { this.addOrUpdateGuestShipToCompleted(shipTo, signInUri, customerWasUpdated ) },
                        (error: any) => { this.addOrUpdateGuestShipToFailed(error); });
                } else {
                    this.updateGuestSession(this.cart, signInUri, customerWasUpdated);
                }
            } else {
                this.updateGuestSession(this.cart, signInUri, customerWasUpdated);
            }
        }

        protected addOrUpdateGuestShipToCompleted(shipTo: ShipToModel, signInUri: string, customerWasUpdated?: boolean): void {
            if (this.cart.shipTo.isNew) {
                this.cart.shipTo = shipTo;
            }
            this.updateGuestSession(this.cart, signInUri, true);
        }

        protected addOrUpdateGuestShipToFailed(error: any): void {
            
        }

        protected updateGuestSession(cart: CartModel, signInUri: string, customerWasUpdated?: boolean): void {
            console.log(this.cart.billTo.id + "-" + this.cart.shipTo.id);
            this.sessionService.setCustomer(this.cart.billTo.id, this.cart.shipTo.id, false, customerWasUpdated).then(
                (session: SessionModel) => { this.updateGuestSessionCompleted(session, this.cart, signInUri); },
                (error: any) => { this.updateGuestSessionFailed(error); });
        }

        protected updateGuestSessionCompleted(session: SessionModel, cart: CartModel, signInUri: string) {
            debugger;
            if (session.isRestrictedProductRemovedFromCart) {
                this.$localStorage.set("hasRestrictedProducts", true.toString());
                this.submitOrder(signInUri);
            } else {
                this.getCartAfterGuestChangeShipTo(this.cart, signInUri);
            }
        }

        protected updateGuestSessionFailed(error) {
            
        }

        protected updateGuestAccountCompleted(cart: CartModel, signInUri: string): void {
            this.submitOrder(signInUri);
        }

        protected updateGuestAccountFailed(error: any): void {
            
        }

        protected getCartAfterGuestChangeShipTo(cart: CartModel, signInUri: string): void {
            debugger;
            this.cartService.expand = "cartlines,shiptos,validation";
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => { this.getCartAfterGuestChangeShipToCompleted(cart, signInUri); },
                (error: any) => { this.getCartAfterGuestChangeShipToFailed(error); });
        }

        protected getCartAfterGuestChangeShipToCompleted(cart: CartModel, signInUri: string): void {
            debugger;
            this.cartService.expand = "";
            this.cart = cart;

            if (!cart.canCheckOut) {
                this.coreService.displayModal(angular.element("#insufficientInventoryAtCheckout"), () => {
                    this.submitOrder(signInUri);
                });

                this.$timeout(() => {
                    this.coreService.closeModal("#insufficientInventoryAtCheckout");
                }, 3000);
            } else {
                if (this.initialIsSubscribed !== this.account.isSubscribed) {
                    this.accountService.updateAccount(this.account).then(
                        () => { this.updateGuestAccountCompleted(this.cart, signInUri); },
                        (error: any) => { this.updateGuestAccountFailed(error); });
                } else {
                    this.submitOrder(signInUri);
                }
            }
        }

        protected getCartAfterGuestChangeShipToFailed(error: any): void {
            
        }

        protected createAccountFailed(error: any): void {
            this.createError = error.message;
            this.submitting = false;
        }

        applyPromotion(): void {
            this.promotionAppliedMessage = "";
            this.promotionErrorMessage = "";

            this.promotionService.applyCartPromotion(this.cartId, this.promotionCode).then(
                (promotion: PromotionModel) => { this.applyPromotionCompleted(promotion); },
                (error: any) => { this.applyPromotionFailed(error); });
        }

        protected applyPromotionCompleted(promotion: PromotionModel): void {
            if (promotion.promotionApplied) {
                this.promotionAppliedMessage = promotion.message;
            } else {
                this.promotionErrorMessage = promotion.message;
            }

            this.getCart();
        }

        protected applyPromotionFailed(error: any): void {
            this.promotionErrorMessage = error.message;
            this.getCart();
        }

        protected loadStep3() {
            $("#nav2expanded").hide();
            $(".edit").hide();
            $("#nav2min").show();

            $("#confirmation").addClass("active");
            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: $("#nav1").offset().top
            }, 200);
            
            this.orderConfirmationInit();
        }

        //Order Confirmation Functionality

        orderConfirmationInit() {
            this.cartService.expand = "cartlines,carriers";

            this.cartService.getCart(this.cart.id).then(
                (confirmedCart: CartModel) => { this.getConfirmedCartCompleted(confirmedCart); },
                (error: any) => { this.getConfirmedCartFailed(error); });

            // get the current cart to update the mini cart
            this.cartService.expand = "";

            this.cartService.getCart().then(
                (cart: CartModel) => { this.getCartCompletedOrderConfirmed(cart); },
                (error: any) => { this.getCartFailedOrderConfirmed(error); });
        }

        protected getConfirmedCartCompleted(confirmedCart: CartModel): void {
            this.cart = confirmedCart;

            if (window.hasOwnProperty("dataLayer")) {
                const data = {
                    "event": "transactionComplete",
                    "transactionId": this.cart.orderNumber,
                    "transactionAffiliation": this.cart.billTo.companyName,
                    "transactionTotal": this.cart.orderGrandTotal,
                    "transactionTax": this.cart.totalTax,
                    "transactionShipping": this.cart.shippingAndHandling,
                    "transactionProducts": []
                };

                const cartLines = this.cart.cartLines;
                for (let key in cartLines) {
                    if (cartLines.hasOwnProperty(key)) {
                        const cartLine = cartLines[key];
                        data.transactionProducts.push({
                            "sku": cartLine.erpNumber,
                            "name": cartLine.shortDescription,
                            "price": cartLine.pricing.unitNetPrice,
                            "quantity": cartLine.qtyOrdered
                        });
                    }
                }

                (window as any).dataLayer.push(data);
            }

            //Add for refresh:
            //window.location.hash = this.cart.orderNumber;

            this.orderService.getOrder(this.cart.orderNumber, "").then(
                (order: OrderModel) => { this.getOrderCompleted(order); },
                (error: any) => { this.getOrderFailed(error); });

            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => { this.getCartPromotionsCompleted(promotionCollection); },
                (error: any) => { this.getConfirmedCartFailed(error); });
        }

        protected getConfirmedCartFailed(error: any): void {
        }

        protected getOrderCompleted(orderHistory: OrderModel): void {
            this.order = orderHistory;
        }

        protected getOrderFailed(error: any): void {
        }

        protected getCartCompletedOrderConfirmed(cart: CartModel): void {
            this.showRfqMessage = cart.canRequestQuote && cart.quoteRequiredCount > 0;
        }

        protected getCartFailedOrderConfirmed(error: any): void {
        }
    }

    angular
        .module("insite")
        .controller("NbfCheckoutController", NbfCheckoutController);
}