module insite.dealers {
    "use strict";

    export class NbfDealerCollectionController extends DealerCollectionController {
       
        protected setDealersMarkers(): void {
            this.dealers.forEach((dealer, i) => {
                const marker = this.createMarker(dealer.latitude, dealer.longitude, `<span class='ico ico-Pin loc-marker'><span class="number">${this.getDealerNumber(i)}</span></span>`);

                google.maps.event.addListener(marker, "click", () => {
                    this.onDealerMarkerClick(marker, dealer);
                });
            });
        }
        
    }

    angular
        .module("insite")
        .controller("DealerCollectionController", NbfDealerCollectionController);
}