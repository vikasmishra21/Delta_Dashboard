import { Directive, ElementRef, Input, OnChanges} from '@angular/core';

@Directive({
  selector: '[TextStyling]'
})
export class TextStyling implements OnChanges {
  @Input("TextStyling") textToStyle: string;
  constructor(private elementRef: ElementRef) { }

  ngOnChanges(){
    this.SetStyle();
  }
  private SetStyle(){
    let note = ["(Removed 2Q20)", "(Added 2Q20)"];
    let index = null;
    note.forEach(element => {
      if((index == null || index == -1) && this.textToStyle != undefined){
        index = this.textToStyle.indexOf(element);
      }
    });
    
    if(index > -1 && index != null && this.textToStyle != undefined){
      let textToEdit = this.textToStyle.slice(0, index);
      let htmlText = this.textToStyle.slice(index, this.textToStyle.length);
      this.elementRef.nativeElement.innerHTML = textToEdit + "<span style='font-size: 9px;'><I>"+htmlText+"<I></span>";
    }
  }
}
