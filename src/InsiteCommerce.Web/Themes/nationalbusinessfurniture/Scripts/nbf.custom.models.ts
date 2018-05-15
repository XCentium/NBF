declare module Extensions.WebApi {
    import Guid = System.Guid;

    import IAppRunService = insite.IAppRunService;

    class AnalyticsDataModel {
        pageInfo: {
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
            internalSearch: {
                searchTerm: string;
                searchResults: number;
            }
        };
        cart: {
            cartID: string;
            price: {
                basePrice: number;
                promoCode: string;
                promoDiscount: number;
                bulkDiscount: number;
                totalDiscount: number;
                tax: number;
                estimatedShipping: number;
                estimatedTotal: number;
            }
            items: [
                {
                    productName: string;
                    sku: string;
                    description: string;
                    productImage: string;
                    vendor: string;
                    collection: string;
                    category: string;
                    basePrice: number;
                    promoDiscount: number;
                    bulkDiscount: number;
                    totalDiscount: number;
                    finalPrice: number;
                }
            ]
        };
        product: {
            productInfo: {
                productName: string;
                sku: string;
                description: string;
                productImage: string;
                vendor: string;
                collection: string;
                category: string;
                basePrice: number;
                salePrice: number;
            }
            relatedProductsInfo: [
                {
                    productName: string;
                    sku: string;
                    description: string;
                    productImage: string;
                    vendor: string;
                    collection: string;
                    category: string;
                    basePrice: number;
                    salePrice: number;
                }
            ]
        };
        transaction: {
            transactionId: string;
            shippingAddress: {
                line1: string;
                line2: string;
                city: string;
                stateProvince: string;
                postalCode: string;
                country: string;
            }
            billingAddress: {
                line1: string;
                line2: string;
                city: string;
                stateProvince: string;
                postalCode: string;
                country: string;
            }
            paymentMethod: string;
            total: {
                basePrice: number;
                promoCode: string;
                promoDiscount: number;
                bulkDiscount: number;
                tax: number;
                shipping: number;
                transactionTotal: number;
            }
        };
        profile: {
            isAuthenticated: boolean;
            profileInfo: {
                profileId: string;
                email: string;
            }
        };
    }
}