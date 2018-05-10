module insite.dashboard {
    "use strict";

    export class NbfDashboardViewController {
        dashboardIsHomepage: boolean;
        isSalesPerson: boolean;
        canRequestQuote: boolean;
        canViewOrders: boolean;
        wishListCollection: WishListModel[] = [];
        quickLinks: DashboardPanelModel[];
        links: DashboardPanelModel[];
        panels: DashboardPanelModel[];

        static $inject = ["$scope", "wishListService", "sessionService", "dashboardService", "$attrs", "cartService"];

        constructor(
            protected $scope: ng.IScope,
            protected wishListService: wishlist.WishListService,
            protected sessionService: account.ISessionService,
            protected dashboardService: IDashboardService,
            protected $attrs: IDashboardViewAttributes,
            protected cartService: cart.ICartService) {
            this.init();
        }

        init(): void {
            this.sessionService.getSession().then(
                (session: SessionModel) => { this.getSessionCompleted(session); },
                (error: any) => { this.getSessionFailed(error); }
            );

            const cart = this.cartService.getLoadedCurrentCart();
            if (cart) {
                this.onCartLoaded(cart);
            } else {
                this.$scope.$on("cartLoaded", (event, newCart: CartModel) => {
                    this.onCartLoaded(newCart);
                });
            }

            this.wishListService.getWishLists().then(
                (wishListCollection: WishListCollectionModel) => { this.getWishListCollectionCompleted(wishListCollection); },
                (error: any) => { this.getWishListCollectionFailed(error); });

            this.dashboardService.getDashboardPanels().then(
                (dashboardPanelCollection: DashboardPanelCollectionModel) => { this.getDashboardPanelsCompleted(dashboardPanelCollection); },
                (error: any) => { this.getDashboardPanelsFailed(error); });
        }

        protected onCartLoaded(cart: CartModel): void {
            this.canRequestQuote = cart.canRequestQuote;
        }

        protected getSessionCompleted(session: SessionModel): void {
            this.isSalesPerson = session.isSalesPerson;
            this.canViewOrders = !session.userRoles || session.userRoles.indexOf("Requisitioner") === -1;
            this.setDashboardIsHomepage(session);
        }

        protected getSessionFailed(error: any): void {
        }

        protected getWishListCollectionCompleted(wishListCollection: WishListCollectionModel): void {
            const wishListCount = wishListCollection.wishListCollection.length;
            if (wishListCount > 0) {
                this.wishListCollection = wishListCollection.wishListCollection;
            }
        }

        protected getWishListCollectionFailed(error: any): void {
        }

        protected getDashboardPanelsCompleted(dashboardPanelCollection: DashboardPanelCollectionModel): void {
            this.links = dashboardPanelCollection.dashboardPanels.filter((x) => { return !x.isPanel; });
            this.panels = dashboardPanelCollection.dashboardPanels.filter((x) => { return x.isPanel; });
            this.quickLinks = dashboardPanelCollection.dashboardPanels.filter((x) => { return x.isQuickLink; });

            this.panels.push({
                isPanel: true, url: "/Customer-Services/Catalog-Mailing-Preferences/", text: "My Catalog Preferences", panelType: "Account Settings",
                quickLinkText: "My Catalog Mailing Preferences", count: null, isQuickLink: true, order: 300, quickLinkOrder: 300,
                openInNewTab: false
            });
        }

        protected getDashboardPanelsFailed(error: any): void {
        }

        changeDashboardHomepage($event): void {
            const checkbox = $event.target;
            const session = {} as SessionModel;
            session.dashboardIsHomepage = checkbox.checked;
            this.sessionService.updateSession(session).then(
                (updatedSession: SessionModel) => { this.changeDashboardHomepageCompleted(updatedSession); },
                (error: any) => { this.changeDashboardHomepageFailed(error); });
        }

        protected setDashboardIsHomepage(session: SessionModel): void {
            this.dashboardIsHomepage = session.dashboardIsHomepage;
        }

        protected changeDashboardHomepageCompleted(session: SessionModel): void {
            this.setDashboardIsHomepage(session);
        }

        protected changeDashboardHomepageFailed(error: any): void {
        }

        getCssClass(panelType: string): string {
            if (panelType === "Orders") {
                return "db-li-oapp";
            }
            if (panelType === this.$attrs.requisitionPanelType) {
                return "db-li-req";
            }
            if (panelType === this.$attrs.quotePanelType) {
                return "db-li-quotes";
            }
            if (panelType === "Invoices") {
                return "db-li-invoices";
            }
            if (panelType === "Payment Options") {
                return "db-li-payment-options";
            }
            if (panelType === "My Addresses") {
                return "db-li-addresses";
            }
            if (panelType === "Account Settings") {
                return "db-li-settings";
            }
            if (panelType === "Favorites") {
                return "db-li-favorites";
            }
            if (panelType === "OrderApprovals") {
                return "db-li-order-approval";
            }
            return "";
        }
    }

    angular
        .module("insite")
        .controller("NbfDashboardViewController", NbfDashboardViewController);
}