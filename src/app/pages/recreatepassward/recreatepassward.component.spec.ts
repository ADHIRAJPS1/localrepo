import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RecreatepasswardComponent } from "./recreatepassward.component";

describe("RecreatepasswardComponent", () => {
    let component: RecreatepasswardComponent;
    let fixture: ComponentFixture<RecreatepasswardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecreatepasswardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecreatepasswardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
