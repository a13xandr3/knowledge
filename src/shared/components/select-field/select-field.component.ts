import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { SelectOption } from 'src/shared/models/select-option.model';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent implements OnChanges {
  @Input() options: ReadonlyArray<SelectOption<any>> = [];
  @Input() placeholder = 'Select an option';
  @Input() value: any = null;
  @Input() matcher?:ErrorStateMatcher;

  @Output() valueChange = new EventEmitter<SelectOption<any> | null>();

  selected = new FormControl<any | null>(null);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.selected.setValue(this.value ?? null, { emitEvent: false });
    }
  } 
  onSelectionChange(ev: MatSelectChange): void {
    const val = ev.value;
    const found = this.options.find(o => o.value === val) ?? null;
    this.valueChange.emit(found);
  }
  clear(): void {
    this.selected.setValue(null);
    this.valueChange.emit(null);
  }
}
