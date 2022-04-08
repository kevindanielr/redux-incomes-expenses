import { Component } from '@angular/core';

import { IonTabs, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [
    './styles/tabs.page.scss'
  ]
})
export class TabsPage  {

  typeUser;
  private activeTab?: HTMLElement;

  constructor(public menu: MenuController) { }

  ionTabsDidChange(event) {
    console.log('ionTabsDidChange', event);
  }

  tabChange(tabsRef: IonTabs) {
    this.menu.enable(true);
    this.activeTab = tabsRef.outlet.activatedView.element;
  }

  ionViewWillLeave() {
    this.propagateToActiveTab('ionViewWillLeave');
  }
  
  ionViewDidLeave() {
    this.propagateToActiveTab('ionViewDidLeave');
  }
  
  ionViewWillEnter() {
    this.typeUser = JSON.parse(localStorage.getItem('userData')).rolId.rolId;
    console.log(this.typeUser);
    this.propagateToActiveTab('ionViewWillEnter');
  }
  
  ionViewDidEnter() {
    this.propagateToActiveTab('ionViewDidEnter');
  }
  
  private propagateToActiveTab(eventName: string) {    
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }
}
