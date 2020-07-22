import { Injectable } from '@angular/core';
import { Observable, throwError, pipe } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AfterSessionExpired } from '../shell/interfaces/after-data-fetch';
import { catchError, mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PptExportService {
  fileUrl: String = 'https://deltarcapi.azurewebsites.net/api/aiidsapi';
  fileUrl1: String = 'https://deltarcapi.azurewebsites.net/api/Exportapi';
  //headers : any;
  onSessionExpire: AfterSessionExpired;
  constructor(private https: HttpClient) {
    //this.headers = new Headers();
    //this.headers.set('Content-Type', 'application/zip');
  }

  /**
   * To Post PPt Data
   */
  postPPTForDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Overall/Brand Health`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForintenderDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/intender`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForRecentDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/recent buyer`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForAgeDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/Age`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTAreaForDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/Area`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTSecondknowledgeForDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/MRI/Great Deal of knowledge`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTOnTopicsDataForDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/MRI/people trust my advice`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  postPPTSecondOpinionsForDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/MRI/Opinion2`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForIncomeDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/income breaks`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForMaritalStatusDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/Marital status`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForgenderDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/gender`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  postPPTForImageryDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Category Snapshot/BRAND IMAGERY`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForTotalAwarenessDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Category Snapshot/AWARENESS METRICS`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForRegionDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/Region`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForInfluencedsDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Purchase Disposition/who influenced`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForkidshouseholdDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Demographic/kids`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForInstalledDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Purchase Disposition/Who Installed`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForPurchasePriceDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Purchase Disposition/Purchase Price`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForBoughtDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Purchase Disposition/Where Bought Shopped`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForReasonDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Purchase Disposition/Purchase Reason`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForConversionDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Recent purchasers/Conversion`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForRetentionDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Recent purchasers/Retention`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForTouchPointDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/OVERALL BRAND/Touchpoint Recall`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForConsiderationDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Category Snapshot/CONSIDERATION`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  postPPTOpenionForDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/MRI/Opinion1`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postaddiag(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad diagnostic/ad diagnostic`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postAddiscriptor(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad comparison/ad descriptor`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postaddCalltoAction2(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad comparison/ad call to action`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postaddiag2(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad details/ad diagnostic`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postadrecalltoaction2(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad details/ad call to action`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postadLinkage(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad details/brand linkage`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForReasonForRecentPurchaserDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Recent Purchasers/Recent purchase`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForCategoryBrandHealthDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Category/Brand Health`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForPerceptionDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Overall Brand/Brand Perceptions`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForReasonForRetailerDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Recent Purchasers/Retailer Reason`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postadLinkageadrecalled(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad details/brand linkage ad recalled`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postaddetailsAdrecalled(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad details/ad recall`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postaddCalltoAction(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/ad diagnostic/ad call to action`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForEquityDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Category Snapshot/Brand Equity`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForRecentPurchaseDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Recent Purchasers/Purchase Funnel`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForPurchaseReactionDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Recent Purchasers/Purchase Reaction`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  postPPTForCBRDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Brand Snapshot/CONSUMER BRAND RELATIONSHIPS`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForOverallAwarenessDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Brand Snapshot/AWARENESS METRICS`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //let options = { headers: headers,responseType:'json'};
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForOverallTouchpointRecallDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Brand Snapshot/TOUCHPOINT RECALL`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //let options = { headers: headers,responseType:'json'};
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }
  postPPTForOverallImageryDownload(data): Observable<any> {
    const url = `${this.fileUrl1}/ExcelPPT/Brand Snapshot/BRAND IMAGERY`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    //let options = { headers: headers,responseType:'json'};
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  postPPTForTrends(data): Observable<any> {
    const url = `${this.fileUrl1}/TrendsPPT`;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.https.post(url, data, { headers: headers, responseType: 'arraybuffer' })
      .pipe(catchError(this.handleError));
  }

  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.status === 401) {
        if (typeof this.onSessionExpire === 'function') {
          this.onSessionExpire();
        }
      }
    }
    // return an observable with a user-facing error message
    return throwError(error.status);
  }

}
