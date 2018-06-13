module nbf.checkout {
    "use strict";
    import SessionService = insite.account.ISessionService;
    import ShipToModel = Insite.Customers.WebApi.V1.ApiModels.ShipToModel;
    import StateModel = Insite.Websites.WebApi.V1.ApiModels.StateModel;
    import CountryModel = Insite.Websites.WebApi.V1.ApiModels.CountryModel;
    import TaxExemptParams = insite.account.TaxExemptParams;

    export interface INbfCheckoutControllerAttributes extends ng.IAttributes {
        cartUrl: string;
    }

    export class NbfCheckoutController {
        //Address Variables
        cart: CartModel;
        cartId: string;
        queryCartId: string;
        countries: CountryModel[];
        selectedShipTo: ShipToModel;
        shipTos: ShipToModel[];
        continueCheckoutInProgress = false;
        shipToIsReadOnly = false;
        account: AccountModel;
        initialIsSubscribed: boolean;
        addressFields: AddressFieldCollectionModel;
        customerSettings: any;
        cartUri: string;
        initialShipToId: string;
        step = 0;
        billToSameAsShipToSelected = true;
        isGuest: boolean;
        emailReadOnly = true;

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
        submitSuccessUri: string;
        isCloudPaymentGateway: boolean;
        isInvalidCardNumber: boolean;
        isInvalidSecurityCode: boolean;
        isInvalidCardNumberOrSecurityCode: boolean;
        paypalIndication: string;

        //Confirmation Variables
        showRfqMessage: boolean;
        order: OrderModel;

        //Account Creation Variables
        createError: string;
        userFound = false;
        newUser = false;
        hideSignIn = false;

        //Split Payment variables
        paymentAmount: number;
        remainingTotal: number;
        totalPaymentAmount = 0.0;
        remainingTotalDisplay: string = '';
        paymentAmountDisplay: string = '';
        totalPaymentsDisplay: string = '';
        cc1Display: string = '';
        cc2Display: string = '';

        //Tax Exempt variables
        isTaxExempt = false;
        taxExemptChoice = false;
        taxExemptFileName: string;
        file: any;
        fileData: any = {};
        errorMessage: string;
        success: boolean = false;
        $form: JQuery;

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
            "sessionService",
            "$localStorage",
            "nbfGuestActivationService",
            "nbfPaymentService",
            "termsAndConditionsPopupService",
            "nbfEmailService",
            "productService",
            "$element",
            "$rootScope",
            "nbfTaxExemptService",
            "ipCookie",
            "$location",
            "accessToken"
        ];

        constructor(
            protected $scope: insite.cart.ICartScope,
            protected $window: ng.IWindowService,
            protected cartService: insite.cart.ICartService,
            protected promotionService: insite.promotions.IPromotionService,
            protected customerService: insite.customers.ICustomerService,
            protected websiteService: insite.websites.IWebsiteService,
            protected coreService: insite.core.ICoreService,
            protected spinnerService: insite.core.ISpinnerService,
            protected $attrs: insite.cart.IReviewAndPayControllerAttributes,
            protected queryString: insite.common.IQueryStringService,
            protected orderService: insite.order.IOrderService,
            protected accountService: insite.account.IAccountService,
            protected settingsService: insite.core.ISettingsService,
            protected $timeout: ng.ITimeoutService,
            protected sessionService: SessionService,
            protected $localStorage: insite.common.IWindowStorage,
            protected nbfGuestActivationService: guest.INbfGuestActivationService,
            protected nbfPaymentService: cart.INbfPaymentService,
            protected termsAndConditionsPopupService: insite.cart.ITermsAndConditionsPopupService,
            protected nbfEmailService: email.INbfEmailService,
            protected productService: insite.catalog.IProductService,
            protected $element: ng.IRootElementService,
            protected $rootScope: ng.IRootScopeService,
            protected nbfTaxExemptService: insite.account.INbfTaxExemptService,
            protected ipCookie: any,
            protected $location: ng.ILocaleService,
            protected accessToken: insite.common.IAccessTokenService
        ) {
            this.init();
        }

        init(): void {
            this.queryCartId = this.queryString.get("cartId");
            this.paypalIndication = this.queryString.get("paypalCancel");

            this.cartUrl = this.$attrs.cartUrl;

            this.websiteService.getAddressFields().then(
                (model: AddressFieldCollectionModel) => { this.getAddressFieldsCompleted(model); });

            this.accountService.getAccount().then(
                (account: AccountModel) => { this.getAccountCompleted(account); });

            this.settingsService.getSettings().then(
                (settingsCollection: insite.core.SettingsCollection) => {
                    this.getSettingsCompleted(settingsCollection);
                });

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

            $(".masked-phone").mask("999-999-9999", { autoclear: false });

            this.$form = $("#taxExemptFileUpload");
            this.$form.removeData("validator");
            this.$form.removeData("unobtrusiveValidation");
            $.validator.unobtrusive.parse(this.$form);

            var self = this;
            document.getElementById("taxExemptFileUpload").onchange = function () {
                self.setFile(this);
            };

            this.$scope.$watch("vm.cart.paymentMethod", (newVal, oldVal, scope: any) => {
                if (newVal && !scope.analyticsPaymentMethodSelected) {
                    this.$rootScope.$broadcast("AnalyticsEvent", "BillingMethodSelected");
                    scope.analyticsPaymentMethodSelected = true;
                }
            });
        }

        protected getSettingsCompleted(settingsCollection: insite.core.SettingsCollection): void {
            this.customerSettings = settingsCollection.customerSettings;
        }

        protected getSettingsFailed(error: any): void {
        }

        protected getAddressFieldsCompleted(addressFields: AddressFieldCollectionModel): void {

            this.addressFields = addressFields;

            this.cartService.expand = "shiptos,validation,cartlines";

            if (this.queryCartId) {
                this.cartService.getCart(this.queryCartId).then(
                    (cart: CartModel) => {
                        this.getCartCompleted(cart);
                        if (cart.status === "Submitted") {
                            this.loadStep4();
                        }

                    },
                    () => { this.getCartInitial(this.cartId) });
            } else if (this.paypalIndication) {
                this.cartService.getCart(this.queryCartId).then(
                    (cart: CartModel) => {
                        this.getCartCompleted(cart);
                        this.reviewAndPayInit();
                        setTimeout(() => {
                            this.loadStep3();
                        },
                            200);
                    }, () => { this.getCartInitial(this.cartId) });
            } else {
                this.getCartInitial(this.cartId);
            }
        }

        protected getCartInitial(cartId: string) {
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => {
                    this.getCartCompleted(cart);
                    this.paymentAmountDisplay = this.convertToCurrency(cart.orderGrandTotal);
                    this.setPaymentAmounts();
                },
                (error: any) => { this.getCartFailed(error); });
        }

        protected setPaymentAmounts() {

            this.remainingTotal = this.cart.orderGrandTotal;
            if (this.cart.properties["cc1"]) {
                var cc1Amount = Number(this.cart.properties["cc1"]);
                this.remainingTotal -= cc1Amount;
                this.cc1Display = this.convertToCurrency(cc1Amount);

                this.totalPaymentsDisplay;
                this.totalPaymentAmount += cc1Amount;
            }
            if (this.cart.properties["cc2"]) {
                var cc2Amount = Number(this.cart.properties["cc2"]);
                this.remainingTotal -= cc2Amount;
                this.cc2Display = this.convertToCurrency(cc2Amount);
                this.totalPaymentAmount += cc2Amount;
            }
            this.totalPaymentsDisplay = this.convertToCurrency(this.totalPaymentAmount);
            this.paymentAmount = this.remainingTotal;
            this.remainingTotalDisplay = this.convertToCurrency(this.remainingTotal);
        }

        protected convertToCurrency(amount: number): string {
            return "$" + amount.toFixed(2).replace(/./g, (c, i, a) => i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c);
        }

        protected getCartCompleted(cart: CartModel): void {

            this.cartService.expand = "";
            this.cart = cart;

            if (cart && cart.cartLines && cart.cartLines.length > 0 && cart.status == "Cart") {
                this.$rootScope.$broadcast("AnalyticsEvent", "CheckoutInitiated");
            }
            const hasRestrictions = cart.cartLines.some(o => o.isRestricted);
            // if cart does not have cartLines or any cartLine is restricted, go to Cart page
            if (!this.cart.cartLines || this.cart.cartLines.length === 0 || hasRestrictions) {
                this.coreService.redirectToPath(this.cartUrl);
            }

            this.setPaymentAmounts();

            if (this.cart.billTo) {
                if (this.cart.billTo.properties["taxExemptFileName"]) {
                    this.isTaxExempt = true;
                    this.taxExemptChoice = true;
                    this.taxExemptFileName = this.cart.billTo.properties["taxExemptFileName"];
                }
                this.isGuest = cart.billTo.isGuest;
            }

            if (this.cart.shipTo && this.cart.shipTo.id) {
                this.initialShipToId = this.cart.shipTo.id;
            }

            if ((!this.cart.billTo || this.cart.shipTo) && this.cart.totalTax === 0) {
                this.cart.totalTaxDisplay = "TBD";
            }

            this.websiteService.getCountries("states").then(
                (countryCollection: CountryCollectionModel) => { this.getCountriesCompleted(countryCollection); });

            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => {
                    this.getCartPromotionsCompleted(promotionCollection);
                });

            this.updateCartLineAttributes();

            this.updateCartLineSwatchProductUrl();
        }

        protected updateCartLineAttributes() {
            let baseProductErpNumbers = this.cart.cartLines.map(x => x.erpNumber.split("_")[0]);
            const expand = ["attributes"];
            const parameter: insite.catalog.IProductCollectionParameters = { erpNumbers: baseProductErpNumbers };
            this.productService.getProducts(parameter, expand).then(
                (productCollection: ProductCollectionModel) => {
                    this.cart.cartLines.forEach(cartLine => {
                        let erpNumber = cartLine.erpNumber.split("_")[0];
                        let baseProduct = productCollection.products.find(x => x.erpNumber === erpNumber);

                        if (baseProduct) {
                            cartLine.properties["GSA"] = this.isAttributeValue(baseProduct, "GSA", "Yes") ? "Yes" : "No";
                            cartLine.properties["ShipsToday"] = this.isAttributeValue(baseProduct, "Ships Today", "Yes") ? "Yes" : "No";
                        }
                    });

                    //this.$scope.$apply();
                },
                () => { });
        }

        protected updateCartLineSwatchProductUrl() {
            let baseProductErpNumbers = this.cart.cartLines
                .filter(x => x.erpNumber.indexOf(":") >= 0)
                .map(x => x.erpNumber.split(":")[0]);

            if (baseProductErpNumbers.length > 0) {
                const expand = ["attributes"];
                const parameter: insite.catalog.IProductCollectionParameters = { erpNumbers: baseProductErpNumbers };
                this.productService.getProducts(parameter, expand).then(
                    (productCollection: ProductCollectionModel) => {
                        this.cart.cartLines.forEach(cartLine => {
                            if (cartLine.erpNumber.indexOf(":") >= 0) {
                                let erpNumber = cartLine.erpNumber.split(":")[0];
                                let baseProduct = productCollection.products.find(x => x.erpNumber === erpNumber);

                                if (baseProduct) {
                                    cartLine.productUri = baseProduct.productDetailUrl;
                                    cartLine.uri = baseProduct.productDetailUrl;
                                }
                            }
                        });
                    }, () => { });
            }
        }

        protected getCartFailed(error: any): void {
            this.cartService.expand = "";
        }

        protected getAccountCompleted(account: AccountModel): void {
            this.account = account;
            this.initialIsSubscribed = account.isSubscribed;
        }

        protected getCountriesCompleted(countryCollection: CountryCollectionModel) {
            this.countries = countryCollection.countries;
            this.setUpBillTo();
            this.setUpShipTos();
            this.setSelectedShipTo();
        }

        protected setUpBillTo(): void {
            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.cart.billTo);
                this.setStateRequiredRule("bt", this.cart.billTo);
            }

            this.replaceObjectWithReference(this.cart.billTo, this.countries, "country");
            this.replaceObjectWithReference(this.cart.billTo, this.cart.billTo.country.states, "state");
        }

        protected setUpShipTos(): void {
            this.shipTos = angular.copy(this.cart.billTo.shipTos);

            let shipToBillTo: ShipToModel = null;

            this.shipTos.forEach(shipTo => {
                if (!shipTo.country) {
                    shipTo.country = this.countries[0];
                }
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
                this.shipTos.splice(this.shipTos.indexOf(shipToBillTo),
                    1); // remove the billto that's in the shiptos array
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
                this.billToSameAsShipToSelected = true;
            }
        }

        checkSelectedShipTo(): void {
            if (this.isGuest) {
                if (!this.billToSameAsShipToSelected) {
                    this.shipTos.forEach(shipTo => {
                        if (shipTo.isNew) {
                            shipTo.email = this.selectedShipTo.email;
                            shipTo.firstName = this.selectedShipTo.firstName;
                            shipTo.lastName = this.selectedShipTo.lastName;
                            shipTo.companyName = this.selectedShipTo.companyName;
                            shipTo.address1 = this.selectedShipTo.address1;
                            shipTo.address2 = this.selectedShipTo.address2;
                            shipTo.city = this.selectedShipTo.city;
                            shipTo.state = this.selectedShipTo.state;
                            shipTo.country = this.selectedShipTo.country;
                            shipTo.postalCode = this.selectedShipTo.postalCode;
                            shipTo.phone = this.selectedShipTo.phone;
                            this.selectedShipTo = shipTo;
                        }
                    });
                }
            }

            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.selectedShipTo);
                this.setStateRequiredRule("st", this.selectedShipTo);
            }

            if (this.billToAndShipToAreSameCustomer() && !this.isGuest) {
                this.shipToIsReadOnly = true;
            } else {
                this.shipToIsReadOnly = false;
            }

            if (this.onlyOneCountryToSelect()) {
                this.selectFirstCountryForAddress(this.cart.billTo);
                this.setStateRequiredRule("bt", this.cart.billTo);
            }

            this.updateAddressFormValidation();
        }

        protected updateBillTo(): void {
            this.cart.billTo.email = this.selectedShipTo.email;
            if (this.billToSameAsShipToSelected) {
                this.cart.billTo.firstName = this.selectedShipTo.firstName;
                this.cart.billTo.lastName = this.selectedShipTo.lastName;
                this.cart.billTo.companyName = this.selectedShipTo.companyName;
                this.cart.billTo.address1 = this.selectedShipTo.address1;
                this.cart.billTo.address2 = this.selectedShipTo.address2;
                this.cart.billTo.city = this.selectedShipTo.city;
                this.cart.billTo.state = this.selectedShipTo.state;
                this.cart.billTo.country = this.selectedShipTo.country;
                this.cart.billTo.postalCode = this.selectedShipTo.postalCode;
                this.cart.billTo.phone = this.selectedShipTo.phone;
            } else {
                var bt = this.shipTos[0];
                this.cart.billTo.firstName = bt.firstName;
                this.cart.billTo.lastName = bt.lastName;
                this.cart.billTo.companyName = bt.companyName;
                this.cart.billTo.address1 = bt.address1;
                this.cart.billTo.address2 = bt.address2;
                this.cart.billTo.city = bt.city;
                this.cart.billTo.state = bt.state;
                this.cart.billTo.country = bt.country;
                this.cart.billTo.postalCode = bt.postalCode;
                this.cart.billTo.phone = bt.phone;
            }
        }

        protected billToAndShipToAreSameCustomer(): boolean {
            return this.selectedShipTo.id === this.cart.billTo.id;
        }

        protected onlyOneCountryToSelect(): boolean {
            return this.countries.length === 1;
        }

        protected selectFirstCountryForAddress(address: BaseAddressModel): void {
            if (!address.country) {
                address.country = this.countries[0];
            }
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
            this.updateValidationRules("btfirstname", this.selectedShipTo.validation.firstName);
            this.updateValidationRules("btlastname", this.selectedShipTo.validation.lastName);
            this.updateValidationRules("btattention", this.selectedShipTo.validation.attention);
            this.updateValidationRules("btcompanyName", this.selectedShipTo.validation.companyName);
            this.updateValidationRules("btaddress1", this.selectedShipTo.validation.address1);
            this.updateValidationRules("btaddress2", this.selectedShipTo.validation.address2);
            this.updateValidationRules("btaddress3", this.selectedShipTo.validation.address3);
            this.updateValidationRules("btaddress4", this.selectedShipTo.validation.address4);
            this.updateValidationRules("btcountry", this.selectedShipTo.validation.country);
            this.updateValidationRules("btstate", this.selectedShipTo.validation.state);
            this.updateValidationRules("btcity", this.selectedShipTo.validation.city);
            this.updateValidationRules("btpostalCode", this.selectedShipTo.validation.postalCode);
            this.updateValidationRules("btphone", this.selectedShipTo.validation.phone);
            this.updateValidationRules("btfax", this.selectedShipTo.validation.fax);
            this.updateValidationRules("btemail", this.selectedShipTo.validation.email);
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
            if (!address.country) {
                return;
            }

            const country = this.countries.filter((elem) => {
                return elem.id === address.country.id;
            });

            const isRequired = country != null && country.length > 0 && country[0].states.length > 0;
            setTimeout(() => {
                if (!isRequired) {
                    address.state = null;
                }
                if ($(`#${prefix}state`)) {
                    $(`#${prefix}state`).validate();
                    $(`#${prefix}state`).rules("add", { required: isRequired });
                }
            }, 100);
        }

        continueToStep2(cartUri: string): void {
            const valid = $("#addressForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);
                return;
            }

            this.spinnerService.show("mainLayout", true);
            this.updateBillTo();

            this.continueCheckoutInProgress = true;
            this.cartUri = cartUri;

            this.$rootScope.$broadcast("AnalyticsEvent", "ShippingBillingInfoComplete", null, null, { state: this.cart.billTo.state.abbreviation, zip: this.cart.billTo.postalCode });

            // if the ship to has been changed, set the shipvia to null so it isn't set to a ship via that is no longer valid
            if (this.cart.shipTo && this.cart.shipTo.id !== this.selectedShipTo.id) {
                this.cart.shipVia = null;
            }

            this.customerService.updateBillTo(this.cart.billTo).then(
                (billTo: BillToModel) => { this.updateBillToCompleted(billTo); },
                (error: any) => { this.updateBillToFailed(error); });

            this.updateShipTo(true);
        }

        continueToStep3(cartUri: string): void {
            const valid = $("#reviewAndPayForm").validate().form();
            if (!valid) {
                angular.element("html, body").animate({
                    scrollTop: angular.element(".error:visible").offset().top
                }, 300);

                return;
            }
            this.spinnerService.show("mainLayout", true);

            this.loadStep3();
        }

        protected updateBillToCompleted(billTo: BillToModel): void {
            
        }

        protected updateBillToFailed(error: any): void {
            this.continueCheckoutInProgress = false;
        }

        protected updateShipTo(customerWasUpdated?: boolean): void {
            const shipToMatches = this.cart.billTo.shipTos.filter(shipTo => {
                return shipTo.id === this.selectedShipTo.id;
            });
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
        }

        protected addOrUpdateShipToCompleted(shipTo: ShipToModel, customerWasUpdated?: boolean): void {
            if (this.cart.shipTo.isNew) {
                this.cart.shipTo = shipTo;
            }

            this.updateSession(this.cart, customerWasUpdated);

            if (!this.$scope.$$phase) {
                this.$scope.$apply();
            }
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
                this.coreService.displayModal(angular.element("#insufficientInventoryAtCheckout"),
                    () => {
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

            this.updateCartLineAttributes();
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
                this.coreService.displayModal(angular.element("#removedProductsFromCart"),
                    () => {
                        if (session.isRestrictedProductExistInCart) {
                            this.$localStorage.set("hasRestrictedProducts", true.toString());
                        }
                        this.redirectTo(this.cartUri);
                    });
                this.$timeout(() => {
                    this.coreService.closeModal("#removedProductsFromCart");
                },
                    5000);
                return;
            }

            if (session.isRestrictedProductExistInCart) {
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

        editAddresses(e) {
            e.stopPropagation();
            e.preventDefault();
            this.userFound = false;

            this.selectFirstCountryForAddress(this.selectedShipTo);
            this.setStateRequiredRule("st", this.selectedShipTo);
            this.selectFirstCountryForAddress(this.cart.billTo);
            this.setStateRequiredRule("bt", this.cart.billTo);

            $("#nav1expanded,#nav2expanded").show();
            $("#nav1min,#nav2min,#nav1 .edit,#nav2 .edit").hide();

            $("#shipping").removeClass("active");
            $("#nav1").addClass("active");
            $("#nav2").removeClass("active");
            $("#nav3").removeClass("active");
            $("#payment").removeClass("active");
            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: $("#nav1").offset().top
            }, 200);
        }

        editShipping(e) {
            e.stopPropagation();
            e.preventDefault();

            $("#nav2expanded").show();
            $("#nav2min, #nav2 .edit").hide();

            $("#payment").removeClass("active");
            $("#nav2").addClass("active");
            $("#nav1").removeClass("active");
            $("#nav3").removeClass("active");
            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: $("#nav2").offset().top
            },
                200);
        }

        //Review and Pay Functionality

        reviewAndPayInit(): void {
            this.spinnerService.hide("mainLayout");

            this.$scope.$on("cartChanged", (event: ng.IAngularEvent) => this.onCartChanged(event));

            this.cartId = this.queryString.get("cartId") || "current";

            this.getCart(true);

            $("#reviewAndPayForm").validate();

            this.$scope.$watch("vm.cart.paymentOptions.creditCard.expirationYear",
                (year: number) => { this.onExpirationYearChanged(year); });
            this.$scope.$watch("vm.cart.paymentOptions.creditCard.useBillingAddress",
                (useBillingAddress: boolean) => { this.onUseBillingAddressChanged(useBillingAddress); });
            this.$scope.$watch("vm.creditCardBillingCountry",
                (country: CountryModel) => { this.onCreditCardBillingCountryChanged(country); });
            this.$scope.$watch("vm.creditCardBillingState",
                (state: StateModel) => { this.onCreditCardBillingStateChanged(state); });

            this.onUseBillingAddressChanged(true);

            this.settingsService.getSettings().then(
                (settings: insite.core.SettingsCollection) => {
                    this.getSettingsCompleted(settings);
                },
                (error: any) => {
                    this.getSettingsFailed(error);
                });
            this.updateCartLineAttributes();
        }

        protected onCartChanged(event: ng.IAngularEvent): void {
            this.getCart();
        }

        protected onExpirationYearChanged(year: number): void {
            if (year) {
                const now = new Date();
                const minMonth = now.getFullYear() === year ? now.getMonth() : 0;
                jQuery("#expirationMonth").rules("add", { min: minMonth });
                jQuery("#expirationMonth").valid();
            }
        }

        protected onUseBillingAddressChanged(useBillingAddress: boolean): void {
            if (!useBillingAddress) {
                if (typeof (this.countries) !== "undefined" && this.countries.length === 1) {
                    this.creditCardBillingCountry = this.countries[0];
                    this.onCreditCardBillingCountryChanged(this.creditCardBillingCountry);
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

        determineCardType() {
            // visa
            var re = new RegExp("^4");
            if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
                this.cart.paymentOptions.creditCard.cardType = this.cart.paymentOptions.cardTypes[0]["value"];
            // Mastercard 
            // Updated for Mastercard 2017 BINs expansion
            if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/
                .test(this.cart.paymentOptions.creditCard.cardNumber))
                this.cart.paymentOptions.creditCard.cardType = this.cart.paymentOptions.cardTypes[1]["value"];

            // AMEX
            re = new RegExp("^3[47]");
            if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
                this.cart.paymentOptions.creditCard.cardType = this.cart.paymentOptions.cardTypes[2]["value"];

            // Discover
            re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
            if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
                this.cart.paymentOptions.creditCard.cardType = this.cart.paymentOptions.cardTypes[3]["value"];

            if (this.cart.paymentOptions.creditCard.cardNumber === "")
                this.cart.paymentOptions.creditCard.cardType = null;

            //// Diners
            //re = new RegExp("^36");
            //if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
            //    return "Diners";

            //// Diners - Carte Blanche
            //re = new RegExp("^30[0-5]");
            //if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
            //    return "Diners - Carte Blanche";

            //// JCB
            //re = new RegExp("^35(2[89]|[3-8][0-9])");
            //if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
            //    return "JCB";

            //// Visa Electron
            //re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
            //if (this.cart.paymentOptions.creditCard.cardNumber.match(re) != null)
            //    return "Visa Electron";
        }

        protected getCartSettingsCompleted(settingsCollection: insite.core.SettingsCollection): void {
            this.cartSettings = settingsCollection.cartSettings;
        }

        protected getCountriesCompletedForReviewAndPay(countryCollection: CountryCollectionModel) {

        }

        getCart(isInit?: boolean): void {
            this.cartService.expand = "cartlines,shipping,tax,carriers,paymentoptions,shiptos,validation";
            if (this.$localStorage.get("hasRestrictedProducts") === true.toString()) {
                this.cartService.expand += ",restrictions";
            }
            this.cartService.getCart(this.cartId).then(
                (cart: CartModel) => {
                    this.getCartCompletedForReviewAndPay(cart, isInit);
                    $("#nav1expanded").hide();
                    $("#nav1").removeClass("active");
                    $("#nav1min, #nav1 .edit").show();

                    $("#shipping").addClass("active");
                    $("#nav2").addClass("active");
                    $("html:not(:animated), body:not(:animated)").animate({
                        scrollTop: $("#nav1").offset().top
                    }, 200);
                },
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

            if (!this.cart.shipVia || this.cart.shipVia.id == null) {
                this.cart.carrier = this.cart.carriers[0];
                this.cart.shipVia = this.cart.carrier.shipVias[0];
            }
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

            setTimeout(() => {
                this.setUpCloudPaymentGateway();
            }, 0, false);

            this.setUpBillTo();
            this.setUpShipTos();
            this.setSelectedShipTo();

            if (!isInit) {
                this.pageIsReady = true;
            }

            this.updateCartLineAttributes();
        }

        protected isAttributeValue(product: ProductDto, attrName: string, attrValue: string): boolean {
            let retVal = false;

            if (product && product.attributeTypes) {
                const attrType = product.attributeTypes.find(x => x.name === attrName && x.isActive === true);

                if (attrType) {
                    const matchingAttrValue = attrType.attributeValues.find(y => y.value === attrValue);

                    if (matchingAttrValue) {
                        retVal = true;
                    }
                }
            }
            return retVal;
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

        protected setUpPaymentMethod(isInit: boolean, selectedMethod: Insite.Cart.Services.Dtos.PaymentMethodDto):
            void {
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

        updateCarrier(): void {
            if (this.cart.carrier && this.cart.carrier.shipVias) {
                if (this.cart.carrier.shipVias.length === 1 && this.cart.carrier.shipVias[0].id !== this.cart.shipVia.id) {
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
                (cart: CartModel) => { this.updateShipViaCompleted(cart); });
        }

        protected updateShipViaCompleted(cart: CartModel): void {
            this.getCart();
        }

        submit(signInUri: string, emailTo: string): void {
            var self = this;

            this.submitting = true;
            this.submitErrorMessage = "";

            if (!this.validateReviewAndPayForm()) {
                this.submitting = false;
                return;
            }
            if (this.paymentAmount != this.remainingTotal) {
                var $validator = $("#reviewAndPayForm").validate(); //.invalid();
                var errors = { paymentAmount: "Cannot place order for less than the total." };
                /* Show errors on the form */
                $validator.showErrors(errors);
                this.submitting = false;
                return;
            }

            this.spinnerService.show("mainLayout", true);

            if (!this.isTaxExempt && this.taxExemptChoice && this.taxExemptFileName) {
                var params = {
                    customerNumber: this.cart.billTo.customerNumber,
                    customerSequence: this.cart.billTo.customerSequence,
                    emailTo: emailTo,
                    orderNumber: this.cart.orderNumber,
                    fileData: this.fileData.b64,
                    fileName: this.taxExemptFileName
                } as TaxExemptParams;

                this.nbfEmailService.sendTaxExemptEmail(params).then(() => {
                    this.handleGuestRegistration(signInUri);
                }, () => { this.errorMessage = "An error has occurred."; });
            } else if (!this.isTaxExempt && this.taxExemptChoice) {
                //tax exempt choice is yes but no file was uploaded
            } else {
                this.handleGuestRegistration(signInUri);
            }
        }

        protected handleGuestRegistration(signInUri: string) {
            var self = this;
            var pass = $("#CreateNewAccountInfo_Password").val();

            if (pass) {
                this.userFound = false;
                this.nbfGuestActivationService.checkUserName(this.cart.billTo.email).then(
                    (response) => {
                        if (response) {
                            this.userFound = true;
                            this.submitting = false;
                        } else {
                            const newAccount = {
                                email: this.cart.billTo.email,
                                userName: this.cart.billTo.email,
                                password: pass,
                                isSubscribed: true,
                                firstName: this.cart.billTo.firstName,
                                lastName: this.cart.billTo.lastName
                            } as AccountModel;

                            this.nbfGuestActivationService.createAccountFromGuest(this.account.id,
                                newAccount,
                                this.cart.billTo,
                                this.cart.shipTo).then((response) => {
                                    self.$rootScope.$broadcast("AnalyticsEvent", "CheckoutAccountCreation");
                                    this.newUser = true;
                                    this.setUpNewUserAndSubmit(signInUri, response, pass);
                                });
                        }
                    });
            } else {
                this.submitOrder(signInUri);
            }
        }

        protected submitOrder(signInUri: string) {
            if ((this.cart.cartLines.filter((line: CartLineModel) => line.erpNumber.search('^[^:]*[:][^:]*[:][^:]*$') > 0)).length > 0) {
                this.$rootScope.$broadcast("AnalyticsEvent", "SwatchRequest");
            }

            this.sessionService.getIsAuthenticated().then(
                (isAuthenticated: boolean) => {
                    this.getIsAuthenticatedForSubmitCompleted(isAuthenticated, signInUri);
                },
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

            if (this.ipCookie("CampaignID")) {
                this.cart.properties["CampaignID"] = this.ipCookie("CampaignID");
            }

            if (this.ipCookie("UserOmnitureTransID")) {
                this.cart.properties["UserOmnitureTransID"] = this.ipCookie("UserOmnitureTransID");
            }

            var oldCartLines = this.cart.cartLines;
            this.tokenizeCardInfoIfNeeded(oldCartLines);
        }

        protected tokenizeCardInfoIfNeeded(oldCartLines: CartLineModel[]) {
            if (this.isCloudPaymentGateway && this.cart.showCreditCard && this.cart.paymentMethod.isCreditCard) {
                (<any>window).sendHPCIMsg();
            } else {
                this.submitCart(oldCartLines);
            }
        }

        protected submitCart(oldCartLines: CartLineModel[]): void {
            this.cartService.updateCart(this.cart, true).then(
                (cart: CartModel) => { this.submitCompleted(cart, oldCartLines); },
                (error: any) => { this.submitFailed(error); });
        }

        private formatWithTimezone(date: string): string {
            return date ? moment(date).format() : date;
        }

        protected getIsAuthenticatedForSubmitFailed(error: any): void {
        }

        protected submitCompleted(cart: CartModel, oldCartLines: CartLineModel[]): void {
            this.cart.id = cart.id;
            this.cartService.getCart();

            this.$rootScope.$broadcast("AnalyticsEvent", "CheckoutComplete", null, null, { cart: cart, cartLines: oldCartLines });

            if (this.newUser) {
                this.$window.location.href = `${this.$window.location.href}?cartid=${this.cart.id}`;
            } else {
                if (history.pushState) {
                    var newurl = window.location.protocol +
                        "//" +
                        window.location.host +
                        window.location.pathname +
                        "?cartid=" +
                        this.cart.id;
                    window.history.pushState({ path: newurl }, "", newurl);
                }
                //this.cartService.getCart();
                this.loadStep4();
                this.spinnerService.hide();
            }
        }

        protected submitFailed(error: any): void {
            this.submitting = false;
            this.cart.paymentOptions.isPayPal = false;
            this.submitErrorMessage = error.message;
            this.spinnerService.hide();
        }

        submitPaypal(signInUri: string): void {
            this.submitErrorMessage = "";
            this.cart.paymentOptions.isPayPal = true;

            setTimeout(() => {
                if (!this.validateReviewAndPayForm()) {
                    this.cart.paymentOptions.isPayPal = false;
                    return;
                }

                this.sessionService.getIsAuthenticated().then(
                    (isAuthenticated: boolean) => {
                        this.getIsAuthenticatedForSubmitPaypalCompleted(isAuthenticated, signInUri);
                    },
                    (error: any) => { this.getIsAuthenticatedForSubmitPaypalFailed(error); });
            },
                0);
        }

        protected getIsAuthenticatedForSubmitPaypalCompleted(isAuthenticated: boolean,
            signInUri: string): void {
            if (!isAuthenticated) {
                this.coreService.redirectToPath(`${signInUri}?returnUrl=${this.coreService.getCurrentPath()}`);
                return;
            }

            this.spinnerService.show("mainLayout", true);
            this.cart.paymentOptions.isPayPal = true;
            var path = this.$window.location.host + this.coreService.getCurrentPath();
            if (path.indexOf("paypalCancel") < 0) {
                path += "?paypalCancel=true";
            }
            this.cart.paymentOptions.payPalPaymentUrl = path;
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
            if (!this.validatedCloudPaymentGateway()) {
                return false;
            }

            const valid = $("#reviewAndPayForm").validate().form();
            if (!valid) {
                jQuery("html, body").animate({
                    scrollTop: jQuery("#reviewAndPayForm").offset().top
                }, 300);
                return false;
            }

            return true;
        }

        protected validatedCloudPaymentGateway(): boolean {
            if (!this.isCloudPaymentGateway) {
                return true;
            }

            if (!this.cart.showCreditCard || !this.cart.paymentMethod.isCreditCard || this.cart.paymentMethod.name == 'Open_Credit') {
                return true;
            }

            if (this.isInvalidCardNumber || this.isInvalidSecurityCode || this.isInvalidCardNumberOrSecurityCode) {
                return false;
            }

            return true;
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


        setUpCloudPaymentGateway(): void {
            this.isCloudPaymentGateway = (<any>window).isCloudPaymentGateway;
            if (!this.isCloudPaymentGateway) {
                return;
            }

            (<any>window).hpciNoConflict = "N";
            (<any>window).hpciStatusReset();
            (<any>window).receiveHPCIMsg();

            (<any>window).hpciSiteSuccessHandlerV4 = (hpciMappedCCValue: string, hpciMappedCVVValue: string, hpciCCBINValue: string, hpciGtyTokenValue: string, hpciCCLast4Value: string, hpciGtyTokenAuthRespValue: string, hpciTokenRespEncrypt: string) => {
                this.$scope.$apply(() => {
                    if (!hpciMappedCCValue || !hpciMappedCVVValue) {
                        if (!hpciMappedCCValue) {
                            this.isInvalidCardNumber = true;
                        } else {
                            this.isInvalidSecurityCode = true;
                        }

                        (<any>window).hpciStatusReset();
                        this.submitFailed({ message: "" });
                        return;
                    }

                    this.cart.paymentOptions.creditCard.cardNumber = hpciMappedCCValue;
                    this.cart.paymentOptions.creditCard.securityCode = hpciMappedCVVValue;

                    var oldCartLines = this.cart.cartLines;
                    this.submitCart(oldCartLines);
                });
            };

            (<any>window).hpciSiteErrorHandler = (errorCode: string, errorMessage: string) => {
                this.$scope.$apply(() => {
                    this.isInvalidCardNumberOrSecurityCode = true;
                    (<any>window).hpciStatusReset();
                    this.submitFailed({ message: "" });
                });
            };

            (<any>window).hpciCCPreliminarySuccessHandlerV2 = (hpciCCTypeValue: string, hpciCCBINValue: string, hpciCCValidValue: string, hpciCCLengthValue: number, hpciCCEnteredLengthValue: number) => {
                this.$scope.$apply(() => {
                    this.isInvalidCardNumberOrSecurityCode = false;
                    if (hpciCCValidValue === "Y") {
                        this.isInvalidCardNumber = false;
                    } else {
                        this.isInvalidCardNumber = true;
                    }
                });
            };

            (<any>window).hpciCVVPreliminarySuccessHandlerV2 = (hpciCVVLengthValue: number, hpciCVVValidValue: string) => {
                this.$scope.$apply(() => {
                    this.isInvalidCardNumberOrSecurityCode = false;
                    if (hpciCVVValidValue === "Y") {
                        this.isInvalidSecurityCode = false;
                    } else {
                        this.isInvalidSecurityCode = true;
                    }
                });
            };
        }

        protected loadStep2() {
            this.continueCheckoutInProgress = false;
            this.hideSignIn = true;
            this.reviewAndPayInit();
        }

        protected loadStep3() {
            this.$rootScope.$broadcast("AnalyticsEvent", "ShippingMethodSelected");

            this.spinnerService.hide("mainLayout");
            this.hideSignIn = true;
            $("#nav1expanded").hide();
            $("#nav1min, #nav1 .edit").show();
            $("#nav2expanded").hide();
            $("#nav2min, #nav2 .edit").show();

            $("#nav1").removeClass("active");
            $("#nav2").removeClass("active");
            $("#payment").addClass("active");
            $("#nav3").addClass("active");
            $("html:not(:animated), body:not(:animated)").animate({
                scrollTop: $("#nav3").offset().top
            }, 200);

            this.continueCheckoutInProgress = false;
        }

        protected loadStep4() {
            this.hideSignIn = true;
            $("#nav1expanded,#nav2expanded,#nav3expanded,.edit").hide();
            $("#nav1,#nav2,#nav3").hide();
            $("#nav1min,#nav2min,#nav3min,#thankYou").show();
            $("#address,#shipping,#payment").addClass("active");

            $("#confirmation").addClass("active");

            //Commenting out the line below because #nav4 cannot be found and is throwing error
            //$("html:not(:animated), body:not(:animated)").animate({
            //        scrollTop: $("#nav4").offset().top
            //    },
            //    200);

            this.orderConfirmationInit();
        }

        //Order Confirmation Functionality
        orderConfirmationInit() {
            this.cartService.expand = "cartlines,carriers";

            this.cartService.getCart(this.cart.id).then(
                (confirmedCart: CartModel) => { this.getConfirmedCartCompleted(confirmedCart); });

            // get the current cart to update the mini cart
            this.cartService.expand = "";

            this.cartService.getCart().then(
                (cart: CartModel) => { this.getCartCompletedOrderConfirmed(cart); });
        }

        addPayment() {
            var model = {};
            model["orderNumber"] = this.cart.orderNumber;
            model["creditCard"] = this.cart.paymentOptions.creditCard;
            model["cartId"] = this.cart.id;
            model["paymentAmount"] = this.paymentAmount;
            model["paymentProfileId"] = this.cart.paymentMethod.name;
            var self = this;
            this.nbfPaymentService.addPayment(model).then((result) => {
                if (result.toLowerCase() === "true") {
                    var propName = "";
                    if (!self.cart.properties["cc1"]) {
                        propName = "cc1";
                        self.cart.properties[propName] = self.paymentAmount.toString();
                        self.cart.paymentOptions.creditCard.cardHolderName = "";
                        self.cart.paymentOptions.creditCard.cardNumber = "";
                        self.cart.paymentOptions.creditCard.securityCode = "";
                        self.cart.paymentOptions.creditCard.expirationYear = (new Date()).getFullYear();
                        self.cart.paymentOptions.creditCard.expirationMonth = (new Date()).getMonth() + 1;
                    } else if (!self.cart.properties["cc2"]) {
                        propName = "cc2";
                        self.cart.properties[propName] = self.paymentAmount.toString();
                    }

                    self.cartService.updateCart(self.cart).then(() => {
                        self.setPaymentAmounts();
                        this.paymentAmount = this.remainingTotal;
                        this.cart.paymentOptions.creditCard.cardType = null;
                    });
                }
            });
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


            this.orderService.getOrder(this.cart.orderNumber, "").then(
                (order: OrderModel) => { this.getOrderCompleted(order); });

            this.promotionService.getCartPromotions(this.cart.id).then(
                (promotionCollection: PromotionCollectionModel) => {
                    this.getCartPromotionsCompleted(promotionCollection);
                });

            this.updateCartLineAttributes();
        }

        protected getOrderCompleted(orderHistory: OrderModel): void {
            this.order = orderHistory;
        }

        protected getCartCompletedOrderConfirmed(cart: CartModel): void {
            this.showRfqMessage = cart.canRequestQuote && cart.quoteRequiredCount > 0;
        }

        openTerms() {
            const data = {
                showTermsAndConditionsPopup: true
            } as insite.cart.ITermsAndConditionsPopupServiceDisplayData;

            this.termsAndConditionsPopupService.display(data);
        };

        //Tax Exempt
        setFile(arg): boolean {
            this.errorMessage = "";

            if (!this.$form.valid()) {
                return false;
            }

            if (arg.files.length > 0) {
                this.file = arg.files[0];
                this.taxExemptFileName = this.file.name;

                let r = new FileReader();

                r.addEventListener("load", () => {
                    this.fileData.b64 = r.result.split(',')[1];
                    this.$scope.$apply();
                }, false);


                r.readAsDataURL(this.file); //once defined all callbacks, begin reading the file   

                this.updatebillToTaxExempt();

                setTimeout(() => {
                    this.$scope.$apply();
                });
            }
            return true;
        }

        openUpload() {
            setTimeout(() => {
                $("#taxExemptFileUpload").click();
            }, 100);
        }

        protected updatebillToTaxExempt() {
            this.spinnerService.show("mainLayout", true);
            this.cart.billTo.properties["taxExemptFileName"] = this.taxExemptFileName;

            this.nbfTaxExemptService.addTaxExempt(this.cart.billTo.id);

            this.customerService.updateBillTo(this.cart.billTo).then(
                () => { this.updatebillToTaxExemptCompleted(); },
                (error: any) => { this.updatebillToTaxExemptFailed(error); });

            this.spinnerService.hide();
        }

        protected updatebillToTaxExemptCompleted(): void {
            this.cartService.expand = "cartlines,shipping,tax,promotions,carriers,paymentoptions,shiptos,validation";
            this.cartService.getCart(this.cart.id).then((cart: CartModel) => {
                this.getCartCompletedForReviewAndPay(cart, false);
                this.spinnerService.hide();
            }, () => { this.spinnerService.hide(); });

            this.success = true;
        }

        protected updatebillToTaxExemptFailed(error: any): void {
            this.spinnerService.hide();
            this.submitErrorMessage = "An error uploading your file has occurred.";
        }

        protected setUpNewUserAndSubmit(signInUri: string, response: AccountModel, newPass: string) {
            if (response != null) {
                this.cart.billTo.isGuest = false;
                this.customerService.updateBillTo(this.cart.billTo).then(
                    (billTo: BillToModel) => {
                        if (this.cart.shipTo.id !== billTo.id) {
                            const shipTo = this.cart.shipTo;
                            if ((shipTo as any).shipTos) {
                                /* In the situation the user selects the billTo as the shipTo we need to remove the shipTos collection
                                   from the object to prevent a circular reference when serializing the object. See the unshift command below. */
                                angular.copy(this.cart.shipTo, shipTo);
                                delete (shipTo as any).shipTos;
                            }

                            this.customerService.addOrUpdateShipTo(shipTo).then(
                                (result: ShipToModel) => {
                                    this.$localStorage.set("createdShipToId", result.id);
                                    (<any>this.$location).search("isNewShipTo", null);
                                },
                                (error: any) => { this.addOrUpdateShipToFailed(error); });
                        }

                        var tempPass = this.$localStorage.get("guestId");
                        var userName = response.userName;
                        if (tempPass && userName) {
                            const session: SessionModel = {
                                password: tempPass,
                                newPassword: newPass,
                                userName: response.userName,
                                userLabel: response.userName,
                                email: response.email,
                                activateAccount: true
                            } as any;

                            this.sessionService.changePassword(session).then(
                                () => {
                                    var currentToken = this.accessToken.get();
                                    this.sessionService.signIn(currentToken, response.userName, newPass).then(
                                        (session: SessionModel) => {
                                            this.sessionService.setContextFromSession(session);
                                            if (session.isRestrictedProductExistInCart) {
                                                this.$localStorage.set("hasRestrictedProducts", true.toString());
                                            }
                                            this.submitOrder(signInUri);
                                        });
                                });
                        }
                    });
            }
        }
    }

    angular
        .module("insite")
        .filter("negate", (): (promoVal: any) => string => promoVal => `- ${promoVal}`)
        .controller("NbfCheckoutController", NbfCheckoutController);
}