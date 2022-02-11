import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-accordion",
  templateUrl: "./accordion.component.html",
  styleUrls: ["./accordion.component.css"],
})
export class AccordionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input()
  name: string;

  @Input()
  accordionDataId: string;

  @Output()
  editData = new EventEmitter();

  @Output()
  deleteData = new EventEmitter();

  hideContent: boolean = true;

  editAccordionContent() {
    this.editData.emit(this.accordionDataId);
  }

  deleteAccordionContent() {
    this.deleteData.emit(this.accordionDataId);
  }
}
