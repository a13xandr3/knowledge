import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-mat-chips',
  templateUrl: './mat-chips.component.html',
  styleUrls: ['./mat-chips.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatChipsComponent),
      multi: true
    }
  ]
})
export class MatChipsComponent implements ControlValueAccessor, OnInit {

  @Input() public label!: string;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  chipCtrl = new FormControl('');
  filteredChips!: Observable<string[]>;

  chips: string[] = [];
  
  private _allChips: string[] = [];

  @Input() 
  set allChips(v: string[] | undefined) {
    this._allChips = v ? v.slice() : [];
  }
  get allChips(): string[] { return this._allChips; }

  @ViewChild('chipInput') chipInput!: ElementRef<HTMLInputElement>;
  @Output() allChipsChange = new EventEmitter<string[]>();
  
  constructor() {
    this.filteredChips = this.chipCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => (value ? this._filter(value) : this.allChips.slice())),
    );
  }

  ngOnInit(): void {}
  
  //controlvalueAcessor impl
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // NORMALIZA e atualiza tanto o estado interno quanto o pai (allChips) e o form control
  writeValue(value: any): void {
    const normalized = this.normalizeIncoming(value);
    this.chips = normalized;
    // atualiza o parent ([(allChips)]) com o valor inicial, se necessário
    this.allChipsChange.emit(this.chips);
    // notifica o form (garante sincronização)
    this.onChange(this.chips);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) this.chipCtrl.disable({ emitEvent: false });
    else this.chipCtrl.enable({ emitEvent: false });
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '' ).trim();
    if(value && !this.chips.includes(value)) {
      this.chips.push(value);
      this._update();
    }
    event.chipInput!.clear();
    this.chipCtrl.setValue(null);
  }
  removeTag(tag: string): void {
    const index = this.chips.indexOf(tag);
    if ( index >= 0 ) {
      this.chips.splice(index, 1);
      this._update();
    }
  }
  chipSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if ( !this.chips.includes(value) ) {
      this.chips.push(value);
      this._update();
    }
    this.chipInput.nativeElement.value = '';
    this.chipCtrl.setValue(null);
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allChips.filter(chip => chip.toLowerCase().includes(filterValue));
  }
  private _update() {
    this.onChange(this.chips);
    this.onTouched();
    this.allChipsChange.emit(this.chips);
  }

  // --- Normalização robusta
  private normalizeIncoming(value: any): string[] {
    if (!value && value !== 0) return [];
    // caso venha já um array de strings ou mistas
    if (Array.isArray(value)) {
      return value.map(item => this.itemToString(item)).filter(Boolean);
    }
    // se veio um objeto { tags: [...]} ou { uris: [...] }
    if (typeof value === 'object') {
      if (Array.isArray(value.tags)) return value.tags.map((i: any) => this.itemToString(i)).filter(Boolean);
      if (Array.isArray(value.uris)) return value.uris.map((i: any) => this.itemToString(i)).filter(Boolean);
      // objeto simples -> tentar extrair propriedades conhecidas
      if (value.value) return [String(value.value)];
    }
    // string ou número único
    if (typeof value === 'string' || typeof value === 'number') {
      const s = String(value).trim();
      return s ? [s] : [];
    }
    return [];
  }

  private itemToString(item: any): string {
    if (typeof item === 'string') return item;
    if (typeof item === 'number') return String(item);
    if (item == null) return '';
    // objetos comuns: { value: 'x' } || { tag: 'x' } || { uri: 'x' }
    if (typeof item === 'object') {
      if (item.value) return String(item.value);
      if (item.tag) return String(item.tag);
      if (item.uri) return String(item.uri);
      // fallback: JSON string (evite isso se puder)
      try { return JSON.stringify(item); } catch { return ''; }
    }
    return '';
  }
}