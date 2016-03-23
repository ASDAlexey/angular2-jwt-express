import {Component, OnInit} from 'angular2/core';
import {FormBuilder, Validators, ControlGroup, Control} from 'angular2/common';
import {UserService} from "./services/user.service.ts";

@Component({
  selector: 'login',
  template: require('./templates/login.html'),
  //styles: [require('./login.css')],
  //directives: []
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  form:ControlGroup;
  user = {};
  // user = {username: '', password: ''};

  constructor(private _formBuilder:FormBuilder, private _userService:UserService) {

  }

  onSubmit() {
    // this.user = this.form.value;
    this._userService.login(this.form.value)
      .subscribe(
        response => this.user = response.user,
        error => console.log(error)
      )
  }

  ngOnInit():any {
    this.form = this._formBuilder.group({
      'username': ['', Validators.required],//[default value,Validators.required]
      'password': ['', Validators.compose([
        Validators.required,
        hasNumbers
      ])],
    });
  }
}
function hasNumbers(control:Control):{[s:string]:boolean} {
  if (!control.value.match('\\d+')) {
    return {noNumber: true};
  }
}
