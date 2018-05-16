module nbf.analytics {

    export class AnalyticsDataLayer {
        pageInfo: AnalyticsPageInfo = new AnalyticsPageInfo();
        cart: AnalyticsCart = new AnalyticsCart();
        product: AnalyticsProduct = new AnalyticsProduct();
        transaction: AnalyticsTransaction = new AnalyticsTransaction();
        profile: AnalyticsProfile = new AnalyticsProfile();
        events: AnalyticsDataEvent[] = [];
    }


    export class AnalyticsCart {
        cartID: string;
        price: AnalyticsCartPrice = new AnalyticsCartPrice();
        items: AnalyticsCartItem[] = [];
    }

    export class AnalyticsCartPrice {
        basePrice: number;
        promoCode: string;
        promoDiscount: number;
        bulkDiscount: number;
        totalDiscount: number;
        tax: number;
        estimatedShipping: number;
        estimatedTotal: number;
    }

    export class AnalyticsCartItem {
        productName: string;
        sku: string;
        productImage: string;
        vendor: string;
        collection: string;
        category: string;
        basePrice: number;
        promoDiscount: number;
        bulkDiscount: number;
        totalDiscount: number;
        finalPrice: number;
        quantity: number;
    }

    export class AnalyticsProduct {
        productInfo: AnalyticsProductInfo = new AnalyticsProductInfo();
        relatedProductsInfo: AnalyticsProductInfo[] = [];
    }

    export class AnalyticsProductInfo {
        productName: string;
        sku: string;
        productImage: string;
        vendor: string;
        collection: string;
        category: string;
        basePrice: number;
        salePrice: number;
    }

    export class AnalyticsPageInfo {
        //Must be unique across all pages
        pageName: string;
        //Page template being used (i.e. Product Page)
        pageType: string;
        siteSection: string;
        siteSubsection: string;
        destinationUrl: string;
        referringUrl: string;
        breadCrumbs: string[];
        isErrorPage: boolean;
        transId: string;
        internalSearch: AnalyticsPageSearchInfo;
    }

    export class AnalyticsPageSearchInfo {
        searchTerm: string;
        searchResults: number;
        filters: any;
    }

    export class AnalyticsTransaction {
        transactionId: string;
        shippingAddress: AnalyticsAddress = new AnalyticsAddress();
        billingAddress: AnalyticsAddress = new AnalyticsAddress();
        paymentMethod: string;
        total: AnalyticsTransactionTotal = new AnalyticsTransactionTotal();
        products: AnalyticsCartItem[] = [];
    }

    export class AnalyticsTransactionTotal {
        basePrice: number;
        promoCode: string;
        promoDiscount: number;
        bulkDiscount: number;
        tax: number;
        shipping: number;
        transactionTotal: number;
    }

    export class AnalyticsAddress {
        line1: string;
        line2: string;
        city: string;
        stateProvince: string;
        postalCode: string;
        country: string;
    }

    export class AnalyticsProfile {
        isAuthenticated: boolean;
        profileInfo: AnalyticsProfileInfo = new AnalyticsProfileInfo();
    }

    export class AnalyticsProfileInfo {
        profileId: string;
        email: string;
    }

    export class AnalyticsDataEvent {
        event: string;
        data: any;
    }
}