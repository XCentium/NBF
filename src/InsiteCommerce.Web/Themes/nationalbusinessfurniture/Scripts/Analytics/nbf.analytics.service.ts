import ICartService = insite.cart.ICartService;

module nbf.analytics {

    export interface IAnalyticsEventHandler {
        handleAnalyticsEvent(event: AnalyticsEvent, data: AnalyticsDataLayer): void;
    }

    export class AnalyticsService {

        static $inject = ["$window"];

        private _handlers: IAnalyticsEventHandler[] = [];

        constructor(protected $window: ng.IWindowService) {
            this.AddHandler(new AdobeAnalytics());
        }

        get Data(): AnalyticsDataLayer {
            if (!this.$window["digitalData"]) {
                this.$window["digitalData"] = new AnalyticsDataLayer();
            }
            return this.$window["digitalData"];
        }
        set Data(dataLayer: AnalyticsDataLayer) {
            this.$window["digitalData"] = dataLayer;
        }

        get PageInfo(): AnalyticsPageInfo {
            return this.Data.pageInfo;
        }
        set PageInfo(pageInfo: AnalyticsPageInfo) {
            this.Data.pageInfo = pageInfo;
        }

        get Cart(): AnalyticsCart {
            return this.Data.cart;
        }
        set Cart(cart: AnalyticsCart) {
            this.Data.cart = cart;
        }

        get Product() {
            return this.Data.product;
        }
        set Product(product: AnalyticsProduct) {
            this.Data.product = product;
        }

        get Transaction() {
            return this.Data.transaction;
        }
        set Transaction(transaction: AnalyticsTransaction) {
            this.Data.transaction = transaction;
        }

        get Profile() {
            return this.Data.profile;
        }
        set Profile(profile: AnalyticsProfile) {
            this.Data.profile = profile;
        }     

        public AddHandler(handler: IAnalyticsEventHandler) {
            this._handlers.push(handler);
        }

        public RemoveHandler(handler: IAnalyticsEventHandler) {
            this._handlers = this._handlers.filter(h => h !== handler);
        }

        public FireEvent(event: AnalyticsEvent) {
            for (var handler of this._handlers) {
                handler.handleAnalyticsEvent(event, this.Data);
                window.console.dir("fireEvent - pageLoad");
                console.dir(this.Data);
            }
        }

    }
    angular
        .module("insite")
        .service("analyticsService", AnalyticsService);



    //Should be an enum, but the version of typescript available is archaic.. 
    export const AnalyticsEvents = {
        PageLoad: "PageLoad" as AnalyticsEvent,
        SwatchRequest: "SwatchRequest" as AnalyticsEvent,
        CatalogRequest: "CatalogRequest" as AnalyticsEvent,
        QuoteRequest: "QuoteRequest" as AnalyticsEvent,
        MiniCartQuoteRequest: "MiniCartQuoteRequest" as AnalyticsEvent,
        InternalSearch: "InternalSearch" as AnalyticsEvent,
        SuccessfulSearch: "SuccessfulSearch" as AnalyticsEvent,
        FailedSearch: "FailedSearch" as AnalyticsEvent,
        ContactUsInitiated: "ContactUsInitiated" as AnalyticsEvent,
        ContactUsCompleted: "ContactUsCompleted" as AnalyticsEvent,
        AccountCreation: "AccountCreation" as AnalyticsEvent,
        CheckoutAccountCreation: "CheckoutAccountCreation" as AnalyticsEvent,
        Login: "Login" as AnalyticsEvent,
        CrossSellSelected: "CrossSellSelected" as AnalyticsEvent,
        EmailSignUp: "EmailSignUp" as AnalyticsEvent,
        LiveVideoChatStarted: "LiveVideoChatStarted" as AnalyticsEvent,
        LiveTextChatStarted: "LiveTextChatStarted" as AnalyticsEvent,
        ProductAddedToCart: "ProductAddedToCart" as AnalyticsEvent,
        CheckoutInitiated: "CheckoutInitiated" as AnalyticsEvent,
        Selected360View: "Selected360View" as AnalyticsEvent,
        AddProductToWishlist: "AddProductToWishlist" as AnalyticsEvent,
        SaveOrderFromCartPage: "SaveOrderFromCartPage" as AnalyticsEvent,
        ContinueShoppingFromCartPage: "ContinueShoppingFromCartPage" as AnalyticsEvent,
        ReadReviewsSelected: "ReadReviewsSelected" as AnalyticsEvent,
        MiniCartHover: "MiniCartHover" as AnalyticsEvent,
        SaveCart: "SaveCart" as AnalyticsEvent        
    }

    export type AnalyticsEvent = "PageLoad" | "ProductPageView" | "SwatchRequest" | "CatalogRequest" | "QuoteRequest" | "MiniCartQuoteRequest" | "InternalSearch" | "SuccessfulSearch" | 
        "FailedSearch" | "ContactUsInitiated" | "ContactUsCompleted" | "AccountCreation" | "CheckoutAccountCreation" | "Login" | "CrossSellSelected" | "EmailSignUp" | "LiveVideoChatStarted" | 
        "LiveTextChatStarted" | "ProductAddedToCart" | "CheckoutInitiated" | "ProductQuestionAsked" | "Selected360View" | "AddProductToWishlist" | "SaveOrderFromCartPage" | "ContinueShoppingFromCartPage" |
        "ReadReviewsSelected" | "MiniCartHover" | "SaveCart";

}