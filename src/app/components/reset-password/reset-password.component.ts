import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  NgForm,
  Validators,
} from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  @Output() infoReset: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {}

  resetPasswordForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  get email(): AbstractControl | null {
    return this.resetPasswordForm.get('email');
  }

  onSubmit(form) {
    let email = form.value['email'];
    this.sendNotification(true);

    this.usersService.resetPassword(email);
  }

  sendNotification(statut) {
    this.infoReset.emit(statut);
  }
}
