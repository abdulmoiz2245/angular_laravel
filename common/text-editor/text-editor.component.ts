import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {TinymceTextEditor} from './editors/tinymce-text-editor.service';
import {HtmlTextEditor} from './editors/html-text-editor.service';
import {Settings} from '../core/config/settings.service';
import {OverlayPanel} from '../core/ui/overlay-panel/overlay-panel.service';
import {ColorpickerPanelComponent} from '../core/ui/color-picker/colorpicker-panel.component';
import {openUploadWindow} from '../uploads/utils/open-upload-window';
import {UploadQueueService} from '../uploads/upload-queue/upload-queue.service';
import {TextEditorImageValidator} from './validation/text-editor-image-validator';
import {UploadInputTypes} from '../uploads/upload-input-config';
import {CurrentUser} from '../auth/current-user';
import {BOTTOM_POSITION} from '../core/ui/overlay-panel/positions/bottom-position';
import {ucFirst} from '../core/utils/uc-first';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

export interface LinkAttrs {
    text: string;
    href: string;
    target?: string;
}

@Component({
    selector: 'text-editor',
    templateUrl: './text-editor.component.html',
    styleUrls: ['./text-editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextEditorComponent implements OnDestroy, AfterViewInit {
    @ViewChild('visualArea', { static: true }) visualTextArea: ElementRef;
    @ViewChild('sourceArea', { static: true }) sourceTextArea: ElementRef;

    public sourceAreaControl = new FormControl();
    public activeEditor = 'visual';
    private editor: any;

    @Input() showAdvancedControls = false;
    @Input() basic = false;
    @Input() minHeight: number|string = 183;
    @Input() maxHeight = 530;
    @Input() inlineUploadType: string;

    @Output() onChange: EventEmitter<string> = new EventEmitter();
    @Output() onCtrlEnter = new EventEmitter();
    @Output() onFileUpload = new EventEmitter();

    constructor(
        private tinyMceEditor: TinymceTextEditor,
        private htmlEditor: HtmlTextEditor,
        public currentUser: CurrentUser,
        private uploadQueue: UploadQueueService,
        private settings: Settings,
        private renderer: Renderer2,
        public el: ElementRef,
        private overlayPanel: OverlayPanel,
        private imageValidator: TextEditorImageValidator,
    ) {
        if (this.settings.get('text_editor_driver', 'TinymceTextEditor') === 'TinymceTextEditor') {
            this.editor = this.tinyMceEditor;
        } else {
            this.editor = this.htmlEditor;
        }
    }

    ngAfterViewInit() {
        this.bootTextEditor();
    }

    ngOnDestroy() {
        this.destroyEditor();
    }

    public reset() {
        this.editor.reset();
    }

    public focus() {
        this.editor.focus();
    }

    public hasUndo(): boolean {
        return this.editor.hasUndo();
    }

    public hasRedo(): boolean {
        return this.editor.hasRedo();
    }

    /**
     * Queries the current state for specified text editor command.
     * For example if the current selection is "bold".
     */
    public queryCommandState(name: string): boolean|number {
        return this.editor.queryCommandState(name);
    }

    public execCommand(name: string, value: string|number = null) {
        this.editor.execCommand(name, value);
    }

    /**
     * Insert information container of specified type into the editor.
     */
    public insertInfoContainer(type: string) {
        // TODO: refactor into shortcodes maybe if need more of similar buttons in the future
        // TODO: translate once angular translation service is available
        this.insertContents(
            `<div class="widget widget-${type}"><div class="title">${ucFirst(type)}:</div><br></div>`
        );
    }

    public showColorPicker(command: string, origin: HTMLElement) {
        this.overlayPanel.open(ColorpickerPanelComponent, {origin: new ElementRef(origin), position: BOTTOM_POSITION})
            .valueChanged().pipe(debounceTime(50)).subscribe(color => {
                this.execCommand(command, color);
            });
    }

    public showVisualEditor() {
        if ( ! this.editor.tinymceInstance.contentAreaContainer || this.activeEditor === 'visual') return;

        this.activeEditor = 'visual';

        this.renderer.setStyle(this.editor.tinymceInstance.contentAreaContainer, 'display', 'block');
        this.renderer.setStyle(this.sourceTextArea.nativeElement, 'display', 'none');

        this.editor.focus();
    }

    public showSourceEditor() {
        if ( ! this.editor.tinymceInstance.contentAreaContainer || this.activeEditor === 'source') return;

        this.activeEditor = 'source';

        this.renderer.setStyle(this.sourceTextArea.nativeElement, 'height', this.editor.tinymceInstance.contentAreaContainer.offsetHeight + 'px');
        this.renderer.setStyle(this.sourceTextArea.nativeElement, 'display', 'block');
        this.renderer.setStyle(this.editor.tinymceInstance.contentAreaContainer, 'display', 'none');

        this.sourceAreaControl.setValue(this.editor.getContents({source_view: true}));
    }

    public openFileUploadDialog() {
        openUploadWindow({multiple: true}).then(fileList => {
            this.onFileUpload.emit(fileList);
        });
    }

    public openInsertImageModal() {
        const params = {
            uri: 'uploads/images',
            validator: this.imageValidator,
            httpParams: {type: this.inlineUploadType}
        };

        openUploadWindow({types: [UploadInputTypes.image]}).then(files => {
            this.uploadQueue.start(files, params).subscribe(response => {
                this.insertImage(this.settings.getBaseUrl(true) + response.fileEntry.url);
            });
        });
    }

    public getContents(): string {
        return this.editor.getContents();
    }

    public setContents(contents: string) {
        this.editor.setContents(contents);
    }

    public insertContents(contents) {
        this.editor.insertContents(contents);
    }

    public insertImage(url: string) {
        this.editor.insertImage(url);
    }

    public insertLink(attrs: LinkAttrs) {
        const target = attrs.target || 'self';
        this.insertContents(`<a href="${attrs.href}" target="${target}">${attrs.text}</a>`);
    }

    public destroyEditor() {
        this.editor.destroyEditor();
    }

    private bootTextEditor() {
        this.editor.setConfig({
            textAreaEl: this.visualTextArea,
            editorEl: this.el,
            minHeight: this.minHeight,
            maxHeight: this.maxHeight,
            onChange: this.onChange,
            onCtrlEnter: this.onCtrlEnter,
            showAdvancedControls: this.showAdvancedControls,
        });
    }
}
