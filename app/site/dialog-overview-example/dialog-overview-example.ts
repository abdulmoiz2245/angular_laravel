import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppHttpClient} from '@common/core/http/app-http-client.service';
import {finalize, tap} from 'rxjs/operators';
import {PeopleService} from '../people/people.service';
import {Select, Store} from '@ngxs/store';
import {TitleUrlsService} from '../../site/titles/title-urls.service';
import {PersonState} from '../people/state/person-state';
import {Settings} from '../../../common/core/config/settings.service';

export interface DialogData {
  message: string;  
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'dialog-overview-example',
  templateUrl: 'dialog-overview-example.html',
  styleUrls: ['dialog-overview-example.css'],
})
export class DialogOverviewExample {
  
  message: string;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '375px',
      data: {message: this.message}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.message = result;
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['dialog-overview-example.css'],
})
export class DialogOverviewExampleDialog {

  constructor(
    private people:PeopleService,
    public urls: TitleUrlsService, 
    private settings: Settings,
    private store: Store,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  SendMessage(){

    if(!this.sendMail()){
      alert("Try again Later");
      this.dialogRef.close();
    }
  }

  public sendMail(){

    const person = this.store.selectSnapshot(PersonState.person);
        
    var routeLink=this.urls.mediaItem(person);
  
    

    return this.people.suggestMessage(this.data.message,routeLink[1],routeLink[2]).subscribe(data => {
      if(data.status){
        alert("Message Received");
        this.dialogRef.close();
      }else{
        alert("Try again Later");
        this.dialogRef.close();
      }

    });
  }

}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */