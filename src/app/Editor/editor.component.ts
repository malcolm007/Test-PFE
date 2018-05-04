import {Component, OnInit} from '@angular/core'

@Component({
selector:'editor',
templateUrl:'./editor.component.html'
})
export class EditorComponent implements OnInit{
    ngOnInit(): void {
     $.getScript('./assets/editorMain.js');
    }
}