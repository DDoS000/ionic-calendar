import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.page.html',
  styleUrls: ['./edit-modal.page.scss'],
})
export class EditModalPage implements OnInit {
  viewTitle: string;
  id: string;
  title: string;
  description: string;
  imageURL: string;
  start: string;
  end: string;
  allDay: boolean;
  constructor(
    public navParams: NavParams,
    private modalCtrl: ModalController,
    public db: AngularFireDatabase
  ) {
    this.id = navParams.get('id');
    this.title = navParams.get('title');
    this.imageURL = navParams.get('imageURL');
    this.description = navParams.get('description');
    this.start = navParams.get('startTime');
    this.end = navParams.get('endTime');
    this.allDay = navParams.get('allDay');
  }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  save() {
    const tutorialsRef = this.db.list('Events');
    tutorialsRef.update(this.id, {
      title: this.title,
      description: this.description,
    });
    this.modalCtrl.dismiss({ title: this.title, des: this.description});
  }
}
