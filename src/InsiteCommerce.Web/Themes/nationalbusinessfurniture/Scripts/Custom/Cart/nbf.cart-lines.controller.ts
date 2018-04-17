module insite.cart {
    "use strict";

    export class NbfCartLinesController extends CartLinesController {
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
    }

    angular
        .module("insite")
        .controller("CartLinesController", NbfCartLinesController);
}