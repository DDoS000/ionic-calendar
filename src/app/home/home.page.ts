import { CalModalPage } from './../pages/cal-modal/cal-modal.page';
import { Component, ViewChild, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { EventPage } from '../event/event.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  eventSource = [];
  viewTitle: string;

  calendar = {
    locale: 'th-TH',
    mode: 'month',
    currentDate: new Date(),
  };

  selectedDate: Date;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private modalCtrl: ModalController,
    private modaledit: ModalController,
    public afDB: AngularFireDatabase
  ) {}

  ngOnInit() {
    this.loadEvent();
  }

  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  createRandomEvents() {
    var events = [];
    for (var i = 0; i < 50; i += 1) {
      var date = new Date();
      var eventType = Math.floor(Math.random() * 2);
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var startTime;
      var endTime;
      if (eventType === 0) {
        startTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + startDay
          )
        );
        if (endDay === startDay) {
          endDay += 1;
        }
        endTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + endDay
          )
        );
        events.push({
          title: 'ตลอดวัน - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: true,
        });
      } else {
        var startMinute = Math.floor(Math.random() * 24 * 60);
        var endMinute = Math.floor(Math.random() * 180) + startMinute;
        startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + startDay,
          0,
          date.getMinutes() + startMinute
        );
        endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + endDay,
          0,
          date.getMinutes() + endMinute
        );
        events.push({
          title: 'เหตุการณ์ - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: false,
        });
      }
    }
    this.eventSource = events;
  }

  removeEvents() {
    this.eventSource = [];
  }

  async openCalModal() {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
    });

    await modal.present();

    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        let event = result.data.event;
        if (event.allDay) {
          console.log("True");
          
          this.afDB.list('Events').push({
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.desc,
            imageURL: event.image,
            allDay: true,
          });
        } else {
          console.log("false");
          this.afDB.list('Events').push({
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.desc,
            imageURL: event.image,
            allDay: false,
          });
        }
        console.log('new');
      }
    });
  }

  loadEvent() {
    this.eventSource = [];
    this.afDB
      .list('Events')
      .snapshotChanges(['child_added'])
      .subscribe((actions) => {
        actions.forEach((action) => {
          console.log(action.key);
          this.eventSource.push({
            id: action.key,
            title: action.payload.exportVal().title,
            startTime: new Date(action.payload.exportVal().startTime),
            endTime: new Date(action.payload.exportVal().endTime),
            description: action.payload.exportVal().description,
            imageURL: action.payload.exportVal().imageURL,
          });
          this.myCal.loadEvents();
        });
      });
  }

  async onEventSelected(event: any) {
    console.log('Event: ' + JSON.stringify(event));
    const modal = await this.modaledit.create({
      component: EventPage,
      componentProps: event,
    });

    await modal.present();
    modal.onDidDismiss().then((result) => {
      this.loadEvent();
      console.log('reload');
    });
  }
}
