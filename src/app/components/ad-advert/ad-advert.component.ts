import { Component, OnInit } from '@angular/core';
import { UploadAdDetailService } from 'src/app/service/upload-ad-detail.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AdDetailsSchema } from 'src/app/model/addetails';
import { AdlistConfig } from './table/adList-config';
import { Chart } from 'src/app/shell/models/chart';
import { FilterService } from 'src/app/shell/services/filter.service';
import { takeUntil } from 'rxjs/operators';
import { Ecrdetail } from './table/adecr';
import { element } from 'protractor';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
// import * as _moment from 'moment';
// const moment =  _moment;
@Component({
  selector: 'app-ad-advert',
  templateUrl: './ad-advert.component.html',
  styleUrls: ['./ad-advert.component.css']
})
export class AdAdvertComponent implements OnInit {
  showLoader: boolean = false;
  showPopup: boolean = false;
  showNotification: boolean = false;
  errorNotification: boolean = false;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  firstDate: any = new FormControl(new Date(''));
  LastDate: any = new FormControl(new Date(''));
  onDataUpdate: Subject<any> = new Subject<any>();
  adListUnsubscribe: Subject<any> = new Subject<any>();
  imageFile: FormData = new FormData();
  videoFile: FormData = new FormData();
  addLists: Array<AdDetailsSchema> = new Array<AdDetailsSchema>();
  AddListCheck: Array<String>;
  adId: any = null;
  index: any;
  ecrDetails: Ecrdetail = {
    quarter: '',
    ecr: '',
    adid: '',
    ecrid: ''
  };
  ApiCall: boolean = true;
  ercValues = {
    'Delta': [],
    'American_Standard': [],
    'Kohler': [],
    'Moen': [],
    'filter': '',
    'bases': 0
  }
  addropdownList: Array<any> = new Array<any>();
  addnamelist: Array<any> = new Array<any>();
  adsBrands = ['Delta', 'American Standard', 'Kohler', 'Moen'];
  adType = ['TV', 'Digital', 'Print'];
  adsCategory = ['Faucet', 'Showerhead', 'Toilet', 'Tub/Shower Unit', 'Other'];
  quarter: Array<any> = new Array<any>();
  ecrList: Array<Ecrdetail> = new Array<Ecrdetail>();
  tempEcrList: Array<Ecrdetail> = new Array<Ecrdetail>();
  ecrIdList: Array<number> = new Array<number>();
  button: String = 'Save';
  selectedADId: number = null;
  isDisabledbutton: boolean = true;
  errorad: boolean = false;
  errorad1: boolean = false;
  disable: boolean= true;
  adDetailList: AdDetailsSchema = {
    adlength: '',
    adname: "",
    adtype: "",
    brand: "",
    firstrundate: new Date(''),
    lastrundate: new Date(''),
    numerator_ad_code: '',
    product_category: "",
    quarterenddate: "",
    quarterstartdate: "",
    videopath: ""
  };
  productCategory: Array<string>;
  Ad = {
    'The Perfect Touch': 0,
    'Hydrorain One': 1,
    'Shield Yourself': 2,
    'Quality Product Touchless KF': 0,
    'Lysol ActiClean Self-Clean': 1,
    'Innovative': 2,
    'Mother Nature': 0,
    'Konnect-Pouring Made Easy': 1,
    'Verdera Voice Mirror': 2,
    'The Design': 0,
    'Life Designs/ Water is Life': 1,
    'Perfect Fit/In Control': 2,
    'In2ition Two-In-One': 3,
    'Rough Water/In Control': 3,
    'Moen Flow': 4
  };
  // AdList:Chart;
  adDetailListChart: Array<Chart> = new Array<Chart>();
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  constructor(private filterService: FilterService, private addDetailsService: UploadAdDetailService, private formbuilder: FormBuilder, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.productCategory = [];
    this.showLoader = true;
    this.adRelatedDetails();
    this.getAds();
    this.dropdownList = [
      { item_id: 1, item_text: 'Faucet' },
      { item_id: 2, item_text: 'Showerhead' },
      { item_id: 3, item_text: 'Toilet' },
      { item_id: 4, item_text: 'Tub/Shower Unit' },
      { item_id: 5, item_text: 'Other' }
    ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.route.params.subscribe(params => {
      if (this.filterService.getAppliedFilters().size !== 0 ||
        this.filterService.getAppliedSeriesSelectors().size !== 0 ||
        this.filterService.getAppliedTimePeriods().size !== 0) {
        this.adRelatedDetails();
        this.getAds();
        setTimeout(() => {
          this.onDataUpdate.next();
        });
      }
    });

    this.filterService.optionSelectionCallback$
      .pipe(takeUntil(this.adListUnsubscribe))
      .subscribe(value => {
        // this.adRelatedDetails();
        setTimeout(() => {
          this.onDataUpdate.next();
        })
      });
  }

  // changeCategory(value){
  //   this.productCategory = value;
  // }
  adRelatedDetails() {
    // this.showLoader = trueAdselector;
    const adListconfigration: AdlistConfig = new AdlistConfig();
    const AdList: Chart = adListconfigration.adconfig('Quarterly');
    const Adselector: Chart = adListconfigration.adconfig('Adselector');
    this.adDetailListChart.push(AdList);
    this.adDetailListChart.push(Adselector);
    AdList.addTableDataReady((output, dataTable) => {
      this.quarter = output;
      this.showLoader = false;
    });
    Adselector.addTableDataReady((output, dataTable) => {
      this.addropdownList = output;
      for (var i = 0; i < output.length; i++) {
        if (i > 0) {
          this.addnamelist.push(output[i].SeriesName);
        }
        // else if(i==output.length-1){
        //    this.addnamelist.push(output[i].SeriesName);
        // }
      }
      this.showLoader = false;
    });
  }
  hiddenalert() {
    this.errorad = false;

  }

  showalert() {
    this.errorad = true;
    setTimeout(()=>{
      this.errorad = false;
    }, 3000);
  }
  hiddenalertforAdname() {
    this.errorad1 = false;

  }
  showalertforAdname() {
    this.errorad1 = true;

  }
  onItemSelect(item: any) {
    // let check: Boolean = false;
    // if (this.productCategory.includes(item.item_text)) {
    //   this.productCategory.forEach(element => {
    //     if (element == item.item_text) {
    //       this.productCategory.filter(obj => obj !== item.item_text);
    //       check = true;
    //     }

    //   });
    //}
    // else {
    //   if (check == false) {
    //     this.productCategory.push(item.item_text);
    //   }
    // }
  }
  onSelectAll(items: any) {
  }
  AddNewAd() {
    this.disable=true;
    this.selectedItems=[];
    this.adDetailList = {
      adlength: '',
      adname: "",
      adtype: "",
      brand: "",
      firstrundate: new Date(''),
      lastrundate: new Date(''),
      numerator_ad_code: '',
      product_category: "",
      quarterenddate: "",
      quarterstartdate: "",
      videopath: ''
    }
    this.button = 'Save'
    this.ecrList = [];
    this.ecrIdList = [];
    this.selectedADId = null;
    this.imageFile = null;
    this.videoFile = null;
    this.isDisabledbutton = false;
    this.tempEcrList = [];
    this.firstDate = new FormControl(new Date(''));
    this.LastDate = new FormControl(new Date(''));
  }
  /**
   * Call Get Ad Api Through Services
   */
  getAds() {
    this.addDetailsService.getAllAds().subscribe((data) => {
      this.addLists = data;
      this.AddListCheck=[];
      this.addLists.forEach(el=>{
        this.AddListCheck.push(el.adname);
      });

      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  /**
   * Call Get ECR Api Through Services
   */
  selectAdandGetEcr(id) {
    this.showLoader = true;
    this.isDisabledbutton = false
    this.button = 'Update';
    this.disable= false;
    this.ecrList = [];
    this.ecrIdList = [];
    this.selectedADId = id;
    let adIndex = null;
    this.addLists.forEach((value, index) => {
      if (id === value.adid) {
        adIndex = index;
      }
    })
    this.adDetailList = this.addLists[adIndex];
    var obj = this.adDetailList.product_category.split(',');
    this.selectedItems=[];
    obj.forEach(element => {
      this.dropdownList.forEach(el => {
        if (el.item_text == element) {
          this.selectedItems.push({ item_id: el.item_id, item_text: el.item_text })
        }
        else {

        }
      })
     // this.selectedItems.push({})
    });
    // this.productCategory = new FormControl(this.adDetailList.product_category.split(','));
    // let 1stDate = new Date(this.adDetailList.firstrundate).toUTCString();
    // console.log(new Date(this.adDetailList.firstrundate).toUTCString());
    // console.log(new Date(this.adDetailList.firstrundate));

    this.firstDate = new FormControl(new Date(this.adDetailList.firstrundate));
    this.LastDate = new FormControl(new Date(this.adDetailList.lastrundate));
    this.addDetailsService.getAdEcr(id).subscribe((data) => {
      if (data.length) {
        this.ecrList = data;
        this.ecrList.sort(this.dynamicSort("quarter"));
      }

      this.showLoader = false;
    }, error => {
      console.log(error);
      this.showLoader = false;
      this.isDisabledbutton = true;
    });
  }
  onDate(event): void {
    this.adDetailList.firstrundate = event;
  }
   dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }
    }
}
  uploadImage(file) {
    this.imageFile = new FormData();
    this.imageFile.append("name", file[0].name);
    this.imageFile.append(file[0].name, file[0]);
  }
  uploadVideo(file) {
    this.videoFile = new FormData();
    this.videoFile.append("name", file[0].name);
    this.videoFile.append(file[0].name, file[0]);
  }
  dateConversion(dateValue) {
    const date: Date = new Date(dateValue);
    //let newDate = new Date(date);
    const month = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const year = date.getFullYear();
    const newdate = date.getDate() > 10 ? date.getDate() : '0' + date.getDate();
    return month + '/' + newdate + '/' + year;
  }
  /**
   * Post Ad Api Through Services
   * Saving Adds
   */

  saveAndUpdateAd() {

    if (this.adDetailList.adname === '' || this.adDetailList.adname === null || this.adDetailList.brand === "") {
      this.showalert();
    } else {
      this.showLoader = true;
      // this.productCategory = new FormControl();
      this.adDetailList.product_category = '';
      for (var i = 0; i < this.selectedItems.length; i++) {
        if(i==0){
          this.adDetailList.product_category =  this.selectedItems[i].item_text;
        }
        else{
        this.adDetailList.product_category = this.adDetailList.product_category + "," + this.selectedItems[i].item_text;
      }
    }
      const firstDate = this.firstDate.value.toUTCString();
      const laseDate = this.LastDate.value.toUTCString();
      this.adDetailList.firstrundate = firstDate;
      this.adDetailList.lastrundate = laseDate;
      const obj = {
        details: this.adDetailList,
        imageFile: this.imageFile,
        videoFile: this.videoFile,
        ecrDetails: this.tempEcrList
      }

      if (this.selectedADId == null) {

        if(this.AddListCheck.includes(this.adDetailList.adname)){
          this.showalertforAdname();
          this.showLoader = false;
        }
        else{
        this.addDetailsService.postAdDetails(obj.details).subscribe(id => {
          this.addMediaAndEcr(obj, id, this.ecrIdList);
          this.showNotification = true;
        //  localStorage.removeItem("ECR");
        //   this.getAds1();
        }, error => {
          console.log(error);
          this.showLoader = false;
          this.errorNotification = true;
          setTimeout(function () { this.errorNotification = false; }, 3000);
        });
      }
      } else {
        this.addDetailsService.updateAd(obj, this.selectedADId, this.ecrIdList).subscribe(data => {
          this.showNotification = true;

        //  localStorage.removeItem("ECR");
        //  this.getAds1();
          this.addMediaAndEcr(obj, this.selectedADId, this.ecrIdList);
        }, error => {
          console.log(error);
          this.showLoader = false;
          this.errorNotification = true;
          setTimeout(function () { this.errorNotification = false; }, 3000);
        });
      }
    }
  }
  getAds1() {
    this.addDetailsService.getAllAds().subscribe((data) => {
      this.addLists = data;
      let counter = 1;
      const maxCount = this.addLists.length;
      this.ercValues.American_Standard=[];
      this.ercValues.Delta=[];
      this.ercValues.Kohler=[];
      this.ercValues.Moen=[];
      this.addLists.forEach((val, i) => {
        const brand = val.brand.replace(' ', '_');
        this.GetEcr(val.adid, brand, val.adname, counter, maxCount);
        counter++;
      });
    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  GetEcr(id, brand, adName, counter, maxCount) {
    this.addDetailsService.getAdEcr(id).subscribe((data) => {
      let ecr: Array<{ score?: number, quar?: string }>;
      ecr = [];
      data.forEach((element, i) => {
        ecr.push({score: Number(element.ecr), quar: element.quarter});
      });
      if (adName && this.ercValues[brand][this.Ad[adName]] === undefined) {
        this.ercValues[brand][this.Ad[adName]] = ecr;
      }
      if (maxCount === counter) {
        this.ApiCall = false;
        localStorage.setItem('ECR', JSON.stringify(this.ercValues));
        this.showLoader = false;
      }

    }, error => {
      console.log(error);
      this.showLoader = false;
    });
  }
  addMediaAndEcr(obj, id, ecrIdList) {
    let maxcount = ecrIdList.lenght ? 4 : 3;
    let counter = 0;
    this.addDetailsService.uploadImage(obj.imageFile, id).subscribe(Id => {
      console.log('image uploaded');
      counter++;
      if (counter === maxcount) {

        this.getAds();
        this.AddNewAd();
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    }, error => {
      console.log(error);
      counter++;
      if (counter === maxcount) {

        this.getAds();
        this.AddNewAd();
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    });
    this.addDetailsService.uploadVideo(obj.videoFile, id).subscribe(Id => {
      console.log('video uploaded');
      counter++;
      if (counter === maxcount) {

        this.getAds();
        this.AddNewAd();
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    }, error => {
      console.log(error);
      counter++;
      if (counter === maxcount) {

        this.getAds();
        this.AddNewAd();
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    });
    if (ecrIdList.length) {
      this.addDetailsService.deleteEcr(ecrIdList).subscribe(Id => {
        console.log('ECR completed');
        counter++;
        if (counter === maxcount) {

          this.getAds();
          this.AddNewAd();
          setTimeout(() => { this.showNotification = false; }, 3000);
        }
      }, error => {
        console.log(error);
        counter++;
        if (counter === maxcount) {
          this.getAds();
          this.AddNewAd();
          setTimeout(() => { this.showNotification = false; }, 3000);
        }
      });
    }
    this.addDetailsService.postEcr(obj.ecrDetails, id).subscribe(Id => {
      console.log('ECR completed');
      counter++;
      if (counter === maxcount) {
        this.getAds();
        this.AddNewAd();
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    }, error => {
      console.log(error);
      counter++;
      if (counter === maxcount) {
        this.getAds();
        this.AddNewAd();
        setTimeout(() => { this.showNotification = false; }, 3000);
      }
    });
  }
  deleteAd() {
    this.showLoader = true;
    this.addDetailsService.deleteAd(this.adId).subscribe(data => {
      this.showLoader = false;
      this.showPopup = !this.showPopup;
      this.addLists.splice(this.index, 1);
      this.index = null;
      this.adId = null;
    }, error => {
      this.showLoader = false;
      this.showPopup = !this.showPopup;
      this.index = null;
      this.adId = null;
    });
  }

  saveEcr(quarter, num) {
    console.log(quarter, num);
    this.ecrDetails = {
      quarter: quarter,
      ecr: num,
      adid: ''
    }
    this.ecrList.push(this.ecrDetails);
    this.ecrList.sort(this.dynamicSort("quarter"));
    this.tempEcrList.push(this.ecrDetails);
    this.tempEcrList.sort(this.dynamicSort("quarter"));

  }
  deleteEcr(id, index) {
    if (id) {
      this.ecrIdList.push(id);
    } else {
      const value = this.ecrList[index];
      let ind = null;
      this.tempEcrList.forEach((val, j) => {
        if (val.ecr === value.ecr) {
          ind = j;
        }
      })
      this.tempEcrList.splice(ind, 1);
    }
    this.ecrList.splice(index, 1);
  }
  openPopup(id, i) {
    this.showPopup = !this.showPopup;
    this.adId = id;
    this.index = i;
  }
  close() {
    this.showPopup = !this.showPopup;
    this.adId = null;
    this.index = null;
  }
  ngOnDestroy(): void {
    this.adListUnsubscribe.next();
    this.adListUnsubscribe.complete();
  }

  highlight($event, id: string) {
    const allIcons = document.getElementsByClassName('media');
    for (let i = 0; i < allIcons.length; i++) {
      allIcons[i].classList.remove('alert-info');
    }
    var icon = document.getElementById(id);
    icon.classList.add('alert-info');
  }
}
