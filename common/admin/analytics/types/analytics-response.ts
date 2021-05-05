import {SiteAnalyticsData} from './site-analytics-data';

export interface AnalyticsHeaderData {
    icon: string;
    name: string;
    type: 'number'|'fileSize';
    value: number;
}

export interface AnalyticsResponse {
    mainData: SiteAnalyticsData;
    headerData: AnalyticsHeaderData[];
}
