import { EditModalPage } from './../edit-modal/edit-modal.page';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  id: string;
  title: string;
  imageURL: string;
  description: string;
  start: string;
  end: string;
  allDay: string;
  updatadata: any;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public afDB: AngularFireDatabase,
    public alertController: AlertController
  ) {
    this.title = navParams.get('title');
    this.imageURL = navParams.get('imageURL');
    this.description = navParams.get('description');
    this.allDay = navParams.get('allDay');
    this.start = formatDate(navParams.get('startTime'), 'medium', 'th-TH');
    this.end = formatDate(navParams.get('endTime'), 'medium', 'th-TH');
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  async presentAlertConfirm() {
    console.log('Click');
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Message <strong>คุณต้องการยืนยันที่จะลบหรือไม่</strong>!!!',
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'ยืนยัน',
          handler: () => {
            const tutorialsRef = this.afDB.list('Events');
            tutorialsRef.remove(this.id);
            this.modalController.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }

  // async presentAlertPrompt() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: 'Prompt!',
  //     inputs: [
  //       {
  //         name: 'ชื่อ',
  //         type: 'text',
  //         value: this.title,
  //       },
  //       {
  //         name: 'คําอธิบาย',
  //         type: 'text',
  //         value: this.description,
  //       },
  //       {
  //         name: 'paragraph',
  //         id: 'paragraph',
  //         type: 'textarea',
  //         placeholder: 'Placeholder 3'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           console.log('Confirm Cancel');
  //         }
  //       }, {
  //         text: 'Ok',
  //         handler: () => {
  //           console.log('Confirm Ok');
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  // }

  async edit() {
    console.log('edit');

    const modal = await this.modalController.create({
      component: EditModalPage,
      cssClass: 'edit-modal',
      componentProps: {
        id: this.id,
        title: this.title,
        imageURL: this.imageURL,
        description: this.description,
        start: this.start,
        end: this.end,
        allDay: this.allDay,
      },
    });

    await modal.present();
    modal.onDidDismiss().then((result) => {
      this.title = result.data.title;
      this.description = result.data.des;
    });
  }
}
