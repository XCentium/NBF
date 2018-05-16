module nbf.analytics {
    export class AdobeAnalytics implements IAnalyticsEventHandler {
        private get Satellite(): any {
            return window['_satellite'];
        }

        constructor() {
            this.Satellite.setDebug(true);
        }

        public handleAnalyticsEvent(event: AnalyticsEvent, data: AnalyticsDataLayer) {
            this.Satellite.track(event as string);
        }
    }
}