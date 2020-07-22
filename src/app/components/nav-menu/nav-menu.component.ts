import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  @Input () checkIsUserAdmin:string;
  Snapshot: boolean;
  Performance: boolean;
  OverallBrand: boolean;
  Faucet: boolean;
  RecentPurchasers: boolean;
  Profiling: boolean;
  Respondents: boolean;
  Showerhead: boolean;
  ShowerheadResp: boolean;
  Toilet: boolean;
  ToiletResp: boolean;
  TubShowerUnit: boolean;
  TubResp: boolean;
  ToiletRecentPurchasers: boolean;
  ShowerheadRecentPurchasers: boolean;
  FaucetRecentPurchasers: boolean;
  isAddBlockerOn :boolean = false;
  // showAdPopup:boolean = false
  constructor() { }

  ngOnInit() {
    let element:any = document.getElementById('checkAids');
    if(element){
      if(element.children[0].offsetHeight == 0){
        this.isAddBlockerOn = true;
        // alert('close Ad Blocker');
      }
    }
  }
  // openPopup(id, i) {
  //   this.showAdPopup = !this.showAdPopup;
   
  // }
  closeADModal() {
    this.isAddBlockerOn = !this.isAddBlockerOn;
  }
  close() {
    const nav = document.getElementById('nav');
    nav.style.visibility = "hidden";
    nav.style.width = "0px"
  }

  activeTab = 'brand';


  brand(activeTab) {
    this.activeTab = activeTab;
  }

  ad(activeTab) {
    this.activeTab = activeTab;
  }

  highlight($event, id: string) {
    const allIcons = document.getElementsByClassName('nav-item');
    for (let i = 0; i < allIcons.length; i++) {
      allIcons[i].classList.remove('active');
    }
    var icon = document.getElementById(id);
    icon.classList.add('active');
  }
}
