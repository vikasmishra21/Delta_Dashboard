import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shell/services/login.service';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { FilterHideService } from 'src/app/service/filter-hide.service';
import { FilterConfigService } from 'src/app/service/filter-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  headerName: string;
  hideTimePeriod: boolean;
  setBooleanFlag: Subscription;
  hideFilterTrendsFlag: boolean;
  displayFilters = { brandSelector: true };
  IsAdmin:boolean = false;

  constructor(private loginService: LoginService, private router: Router, private hideFilterTrends: FilterHideService, private filterconfig1: FilterConfigService) {
    this.headerName = 'BRAND SNAPSHOT';
    this.setBooleanFlag = this.hideFilterTrends.getBooleanFlag().subscribe((data) => {
      this.hideFilterTrendsFlag = data;
    });
  }

  ngOnInit() {
    const EncCode = sessionStorage.getItem('x-rc-project_auth_token');
    if(!EncCode){
      this.router.navigate['login']
    }else{
      let userDetail:any = JSON.parse(atob(EncCode.split('.')[1]));
      if(userDetail.Roleid == 16){
        this.IsAdmin = false;
      }else{
        this.IsAdmin = true;
      }
    }
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.setHeaderName(event.url);
          setTimeout(() => {
            // this.hideTimePeriod = false;
            this.displayFilters.brandSelector = true;
          }, 0);
        } else if (event instanceof NavigationStart) {
          this.displayFilters.brandSelector = false;
        }
      });
    this.setHeaderName(this.router.url);

    this.getBrowserName()


  }

  // methods defination
  logout() {
    this.loginService.logout();
    //this.router.navigate(['/login']);
  }

  openNavMenu() {
    const nav = document.getElementById('nav');
    nav.style.visibility = 'visible';
    nav.style.width = '300px';
  }

  openFilterMenu() {
    const nav = document.getElementById('filter-nav');
    nav.style.visibility = 'visible';
    nav.style.width = '300px';
    nav.style.right = '0px';
  }

  uploadFile() {
    this.router.navigateByUrl('home/uploadFile');
  }

  private setHeaderName(route: string) {
    switch (route.split('/')[2]) {
      case 'Overallsnapshot':
        this.headerName = 'BRAND SNAPSHOT';
        break;
      case 'brandHealth':
        this.headerName = 'BRAND HEALTH';
        break;
      case 'brandPerceptions':
        this.headerName = 'BRAND PERCEPTIONS';
        break;
      case 'touchpointRecall':
        this.headerName = 'TOUCHPOINT RECALL';
        break;
      case 'Demographics':
        this.headerName = 'DEMOGRAPHICS';
        break;
      case 'categoryBrandHealth':
        this.headerName = 'BRAND HEALTH - ' + route.split('/')[3].toUpperCase();
        break;
      case 'equity':
        this.headerName = 'BRAND EQUITY - ' + route.split('/')[3].toUpperCase();
        break;
      case 'consideration':
        this.headerName = 'BRAND CONSIDERATION - ' + route.split('/')[3].toUpperCase();
        break;
      case 'Snapshot':
        this.headerName = 'BRAND SNAPSHOT - ' + route.split('/')[3].toUpperCase();
        break;
      case 'RecentPurchase':
        this.headerName = 'RECENT PURCHASE - ' + route.split('/')[3].toUpperCase();
        break;
      case 'PurchaseReaction':
        this.headerName = 'PURCHASE REACTION - ' + route.split('/')[3].toUpperCase();
        break;
      case 'Disposition':
        this.headerName = 'PURCHASE DISPOSITION - ' + route.split('/')[3].toUpperCase();
        break;
      case 'Conversion':
        this.headerName = 'CONVERSION - ' + route.split('/')[3].toUpperCase();
        document.getElementById('Conversion').className += 'active';
        break;
      case 'ReasonRetailer':
        this.headerName = 'REASON FOR RETAILER - ' + route.split('/')[3].toUpperCase();
        break;
      case 'ReasonRecentPurchase':
        this.headerName = 'REASON FOR RECENT PURCHASE - ' + route.split('/')[3].toUpperCase();
        break;
      case 'AdDetails':
        this.headerName = 'AD DETAILS';
        break;
      case 'AdDiagnostics':
        this.headerName = 'AD DIAGNOSTICS';
        break;
      case 'AdDescriptor':
        this.headerName = 'AD DESCRIPTOR';
        break;
    }
  }

  public getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return document.getElementById("body-content").className += 'Edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return document.getElementById("body-content").className += 'Opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return document.getElementById("body-content").className += 'Chrome';
      case agent.indexOf('trident') > -1:
        return document.getElementById("body-content").className += 'IE';
      case agent.indexOf('firefox') > -1:
        return document.getElementById("body-content").className += 'Firefox';
      case agent.indexOf('safari') > -1:
        return document.getElementById("body-content").className += 'Safari';
      default:
        return 'other';
    }
  }
}
