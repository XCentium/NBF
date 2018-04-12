import ICartService = insite.cart.ICartService;

module nbf.analytics {

    export class AdobeAnalyticsService {

        get Data(): AnalyticsDataLayer {
            if (window["digitalData"]) {
                window["digitalData"] = new AnalyticsDataLayer();
            }
            return window["digitalData"];
        }
        set Data(dataLayer: AnalyticsDataLayer) {
            window["digitalData"] = dataLayer;
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

        public PageLoad(): void {
            this.FireEvent("PageLoad");
        }

        public ViewProductPage(): void {
            this.FireEvent("ProductView");
        }

        public SwatchRequest(): void {
            this.FireEvent("SwatchRequest");
        }

        public CatalogRequest(): void {
            this.FireEvent("CatalogRequest");
        }

        public QuoteRequest(): void {
            this.FireEvent("QuoteRequest");
        }

        public MiniCartQuoteRequest(): void {
            this.FireEvent("MiniCartQuoteRequest");
        }

        public InternalSearch(): void {
            this.FireEvent("InternalSearch");
        }

        public SuccessfulSearch(): void {
            this.FireEvent("SuccessfulSearch");
        }

        public FailedSearch(): void {
            this.FireEvent("FailedSearch");
        }

        public ContactUsInitiated(): void {
            this.FireEvent("ContactUsInitiated");
        }

        public ContactUsCompleted(): void {
            this.FireEvent("ContactUsCompleted");
        }

        public AccountCreation(): void {
            this.FireEvent("AccountCreation");
        }

        public CheckoutAccountCreation(): void {
            this.FireEvent("CheckoutAccountCreation");
        }

        public Login(): void {
            this.FireEvent("Login");
        }

        public CrossSellSelected(): void {
            this.FireEvent("CrossSellSelected");
        }

        public EmailSignUp(): void {
            this.FireEvent("EmailSignUp");
        }

        public LiveVideoChatStarted(): void {
            this.FireEvent("LiveVideoChatStarted");
        }

        public LiveTextChatStarted(): void {
            this.FireEvent("LiveTextChatStarted");
        }

        public ProductAddedToCart(): void {
            this.FireEvent("ProductAddedToCart");
        }

        public CheckoutInitiated(): void {
            this.FireEvent("CheckoutInitiated");
        }

        public ProductQuestionAsked(): void {
            this.FireEvent("ProductQuestionAsked");
        }

        public Selected360View(): void {
            this.FireEvent("Selected360View");
        }

        public AddProductToWishlist(): void {
            this.FireEvent("AddProductToWishlist");
        }

        public SaveOrderFromCartPage(): void {
            this.FireEvent("SaveOrderFromCartPage");
        }

        public ContinueShoppingFromCartPage(): void {
            this.FireEvent("ContinueShoppingFromCartPage");
        }

        public ReadReviewsSelected(): void {
            this.FireEvent("ReadReviewsSelected");
        }

        public MiniCartHover(): void {
            this.FireEvent("MiniCartHover");
        }

        public SaveCart(): void {
            this.FireEvent("SaveCart");
        }

        private FireEvent(event: string) {
            console.log("Firing event: " + event);
            console.log(this.Data);
        }



    }

}