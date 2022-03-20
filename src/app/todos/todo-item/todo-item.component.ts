import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import * as actions from '../todo.actions';

import { Todo } from '../models/todo.models';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css']
})
export class TodoItemComponent implements OnInit {

  @Input() todo!: Todo;
  todoMutable!: Todo;

  @ViewChild('inputFisico') txtInputFisico!: ElementRef;

  chkCompletado!: FormControl;
  txtInput!: FormControl;

  editando: boolean = false;

  constructor( private store: Store<AppState>) { }

  ngOnInit(): void {
    this.todoMutable = {...this.todo};
    this.chkCompletado = new FormControl( this.todoMutable.completado );
    this.txtInput = new FormControl( this.todoMutable.texto, Validators.required );
    
    this.chkCompletado.valueChanges.subscribe( valor => {
      this.store.dispatch( actions.toggle( { id: this.todoMutable.id }) );
    });
  
  }

  editar() {
    this.editando = true;
    this.txtInput.setValue( this.todo.texto );

    setTimeout(() => {
      this.txtInputFisico.nativeElement.select();
    }, 1);
  }
  terminarEdicion() {
    this.editando = false;

    if( this.txtInput.invalid ) { return; }
    if( this.txtInput.value === this.todoMutable.texto ) { return; }


    this.store.dispatch(
      actions.editar( {
        id: this.todoMutable.id,
        texto: this.txtInput.value
      })
    )
  }

  borrar() {
    this.store.dispatch( actions.borrar({ id: this.todo.id } ) );
  }

}
