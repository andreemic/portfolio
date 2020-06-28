import { Component, OnInit } from '@angular/core';

import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.email
  ]);
  msgFormControl = new FormControl('', [
    Validators.required
  ]);

  name: string;
  error = false;
  sent = false;

  clearForm() {
    this.name = '';
    this.emailFormControl.setValue('');
    this.msgFormControl.setValue('');
  }
  async sendForm() {
    if (this.isEmpty() || this.msgFormControl.hasError('required') 
        || this.emailFormControl.hasError('required') || this.emailFormControl.hasError('email')) {
      return;
    }

    const message = {
      email: this.emailFormControl.value,
      name: this.name,
      text: this.msgFormControl.value
    };
    const response = await fetch('https://andreev.work/contact/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify(message)
    });

    this.sent = true;
    if (response.ok) {
      this.clearForm();
      this.emailFormControl.reset();
      this.msgFormControl.reset();
      this.msgFormControl.reset();
    } else {
      this.error = true;
    } 
  }
  isEmpty() {
    let is_empty = !(this.name || this.emailFormControl.value || this.msgFormControl.value);
    return is_empty;
  }
  formInput() {
    if (this.sent) {
      this.sent = false;
      this.error = false;
    }
  }

  constructor() { }

  ngOnInit(): void {
  }

}
