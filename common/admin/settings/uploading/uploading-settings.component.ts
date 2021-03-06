import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {SettingsPanelComponent} from '../settings-panel.component';
import {GenericBackendResponse} from '@common/core/types/backend-response';

@Component({
    selector: 'uploading-settings',
    templateUrl: './uploading-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'settings-panel'},
})
export class UploadingSettingsComponent extends SettingsPanelComponent implements OnInit {
    public allowedExtensions: string[] = [];
    public blockedExtensions: string[] = [];
    public serverMaxUploadSize: string;

    ngOnInit() {
        this.allowedExtensions = this.settings.getJson('uploads.allowed_extensions', []);
        this.blockedExtensions = this.settings.getJson('uploads.blocked_extensions', []);
        this.getServerMaxUploadSize();
    }

    public saveSettings() {
        this.setJson('uploads.allowed_extensions', this.allowedExtensions);
        this.setJson('uploads.blocked_extensions', this.blockedExtensions);
        super.saveSettings();
    }

    private getServerMaxUploadSize() {
        this.http.get<GenericBackendResponse<{maxSize: string}>>('uploads/server-max-file-size').subscribe(response => {
            this.serverMaxUploadSize = response.maxSize;
        });
    }
}
