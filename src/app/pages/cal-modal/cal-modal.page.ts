import { Component, AfterViewInit } from '@angular/core';
import { ModalController , NavParams} from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements AfterViewInit {
  calendar = {
    locale: 'th-TH',
    mode: 'month',
    currentDate: new Date(),
  };
  viewTitle: string;

  event = {
    title: '',
    desc: '',
    image: '',
    startTime: null,
    endTime: '',
    allDay: false,
  };

  modalReady = false;

  constructor(private modalCtrl: ModalController,private navParams: NavParams) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;
    }, 1);
  }

  save() {
    this.modalCtrl.dismiss({ event: this.event });
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    console.log('ev: ', ev);

    this.event.startTime = new Date(ev.selectedTime).toISOString;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
