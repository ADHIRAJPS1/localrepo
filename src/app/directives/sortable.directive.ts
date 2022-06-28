import { Directive, EventEmitter, Input, Output } from "@angular/core";

export type SortColumn = "";
export type SortDirection = "asc" | "desc" | "";
const rotate: { [key: string]: SortDirection } = { asc: "desc", desc: "", "": "asc" };

export interface SortEvent {
    column: SortColumn | string;
    direction: SortDirection;
}

@Directive({
    selector: "th[sortable]",
    host: {
        "[class.asc]": 'direction === "asc"',
        "[class.desc]": 'direction === "desc"',
        "(click)": "rotate()",
    },
})
export class SortableHeaderDirective {
    @Input() sortable: SortColumn | string = "";
    @Input() direction: SortDirection = "";
    @Output() sort = new EventEmitter<SortEvent>();

    rotate() {
        if (this.sortable != "") {
            this.direction = rotate[this.direction];
            this.sort.emit({ column: this.sortable, direction: this.direction });
        }
    }
}