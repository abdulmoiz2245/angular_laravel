import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AnalyticsHeaderData} from '../../types/analytics-response';
import {Settings} from '@common/core/config/settings.service';
import {AnalyticsService} from '@common/admin/analytics/analytics.service';
import {ActivatedRoute} from '@angular/router';
import {AnalyticsChannel} from '@common/core/config/app-config';

@Component({
    selector: 'analytics-host',
    templateUrl: './analytics-host.component.html',
    styleUrls: ['./analytics-host.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsHostComponent implements OnInit {
    public headerData: AnalyticsHeaderData[];
    public channels: AnalyticsChannel[] = [];

    constructor(
        public settings: Settings,
        public analytics: AnalyticsService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        this.channels = this.settings.get('vebto.admin.analytics.channels');
        this.analytics.headerData$.subscribe(data => {
            this.headerData = data;
        });
    }

    public onChannelChange() {
        const channel = this.route.firstChild.snapshot.routeConfig.path;
        this.analytics.getData(channel);
    }
}
