import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: "tag-input",
    templateUrl: "./tag-input.component.html",
    styleUrls: ["./tag-input.component.css"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: TagInput
        }
    ]
})
export class TagInput implements ControlValueAccessor {

    @Input() label: string;
    @Input() tags: Array<string>;
    tag: string;

    constructor() {
    }

    onChange = (tags) => { };

    onTouched = () => { };

    touched = false;

    disabled = false;

    writeValue(keywords: string) {
        if (keywords && keywords.length) {
            this.tags = keywords.split(',');
        }
        else {
            this.tags = [];
        }
    }

    registerOnChange(onChange: any) {
        this.onChange = onChange;
    }

    markAsTouched() {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    setDisabledState(disabled: boolean) {
        this.disabled = disabled;
    }

    registerOnTouched(onTouched: any) {
        this.onTouched = onTouched;
    }

    removeTag(k) {
        this.markAsTouched();
        let ind = this.tags.indexOf(k);

        if (ind >= 0) {
            this.tags.splice(ind, 1);
        }

        this.onChange(this.tags.join(','));
    }

    addTag() {
        this.markAsTouched();
        let k = this.tag;

        if (this.tags.indexOf(k) < 0) {
            this.tags.push(k);
        }

        this.onChange(this.tags.join(','));
        this.tag = '';
    }

}
