interface JQuery {
    isotope(options?: JQueryIsotope.IIsotopeOptions): JQuery;
}
declare module JQueryIsotope {
    interface IIsotopeOptions {
        itemSelector?: string;
        masonry?: IMasonryOption;
        filter?: string;
    }
    interface IMasonryOption {
        horizontalOrder?: boolean;
        gutter?: string;
    }
}