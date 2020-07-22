import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from '../shell/enums/measure';
import { ChartProvider } from '../shell/enums/chart.provider';
import { TimePeriod } from '../shell/models/time.period';
import { CollectionOutput } from '../shell/models/collectionOutput';
import { OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FilterCondition } from '../shell/enums/filter-condition.enum';
import { BreakType } from '../shell/operators/chart.operators';
import { RoundOffStrategy } from '../shell/enums/round.off.strategy';
import { AssetMappings } from './asset.mappings';
export class RecentPurchase {
  Brandlist: string[];
  Brand: string;
  Category: string;
  Awarenesschart: Array<Chart> = new Array<any>();
  Seriousconsider: Array<Chart> = new Array<any>();
  Purchased: Array<Chart> = new Array<any>();

  BrandMapping = AssetMappings.brandNameAndCodes;

  TotalAwarenessOptionMapping = {
    Faucet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 },
    Showerhead: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 },
    Toilet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 },
    TubShowerUnit: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 }
  }
  SerieslyConsiderOptionMapping = {
    Faucet: {'Delta':1,'American Standard':2,'Kohler':3,'Moen':4,'Peerless':5,'Pfister':6,'Aqua Source':7,'Glacier Bay':8,'Brizo':9,'Grohe':10,'Hansgrohe':11,'Briggs':12,'Crane':13,'Eljer':14,'Gerber':15,'Jacuzzi':16,'Mansfield':17,'Sterling':18,'Toto':19,'Penguin':20,'Danze':21,'Speakman':22,'Waterpik':23,'Symmons':24,'Aquatic':25,'Maax':26,'ASB':27,'Style Selections':28,'Allen & Roth':29,'Swanstone':30,'Aqua Glass':31,'Proflo':32,'Duravit':33,'Mirabelle':34,'Villeroy & Boch':35,'DecoLav':36,'Rohl':37,'Victoria & Albert':38,'Ronbow':39,'Vortens':40,'Oxygenics':41,'MTI':42,'Other':98,"Don't know":99},
    Showerhead: {'Delta':1,'American Standard':2,'Kohler':3,'Moen':4,'Peerless':5,'Pfister':6,'Aqua Source':7,'Glacier Bay':8,'Brizo':9,'Grohe':10,'Hansgrohe':11,'Briggs':12,'Crane':13,'Eljer':14,'Gerber':15,'Jacuzzi':16,'Mansfield':17,'Sterling':18,'Toto':19,'Penguin':20,'Danze':21,'Speakman':22,'Waterpik':23,'Symmons':24,'Aquatic':25,'Maax':26,'ASB':27,'Style Selections':28,'Allen & Roth':29,'Swanstone':30,'Aqua Glass':31,'Proflo':32,'Duravit':33,'Mirabelle':34,'Villeroy & Boch':35,'DecoLav':36,'Rohl':37,'Victoria & Albert':38,'Ronbow':39,'Vortens':40,'Oxygenics':41,'MTI':42,'Other':98,"Don't know":99},
    Toilet:{'Delta':1,'American Standard':2,'Kohler':3,'Moen':4,'Peerless':5,'Pfister':6,'Aqua Source':7,'Glacier Bay':8,'Brizo':9,'Grohe':10,'Hansgrohe':11,'Briggs':12,'Crane':13,'Eljer':14,'Gerber':15,'Jacuzzi':16,'Mansfield':17,'Sterling':18,'Toto':19,'Penguin':20,'Danze':21,'Speakman':22,'Waterpik':23,'Symmons':24,'Aquatic':25,'Maax':26,'ASB':27,'Style Selections':28,'Allen & Roth':29,'Swanstone':30,'Aqua Glass':31,'Proflo':32,'Duravit':33,'Mirabelle':34,'Villeroy & Boch':35,'DecoLav':36,'Rohl':37,'Victoria & Albert':38,'Ronbow':39,'Vortens':40,'Oxygenics':41,'MTI':42,'Other':98,"Don't know":99},
    TubShowerUnit: {'Delta':1,'American Standard':2,'Kohler':3,'Moen':4,'Peerless':5,'Pfister':6,'Aqua Source':7,'Glacier Bay':8,'Brizo':9,'Grohe':10,'Hansgrohe':11,'Briggs':12,'Crane':13,'Eljer':14,'Gerber':15,'Jacuzzi':16,'Mansfield':17,'Sterling':18,'Toto':19,'Penguin':20,'Danze':21,'Speakman':22,'Waterpik':23,'Symmons':24,'Aquatic':25,'Maax':26,'ASB':27,'Style Selections':28,'Allen & Roth':29,'Swanstone':30,'Aqua Glass':31,'Proflo':32,'Duravit':33,'Mirabelle':34,'Villeroy & Boch':35,'DecoLav':36,'Rohl':37,'Victoria & Albert':38,'Ronbow':39,'Vortens':40,'Oxygenics':41,'MTI':42,'Other':98,"Don't know":99}
  }
  PurchaseOptionMapping = {
    Faucet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    Showerhead: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    Toilet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    TubShowerUnit: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },

  }
  TotalAwarenessSidebreak = {
    // Faucet: 'Faucet', Showerhead: 'Showerhead', Toilet: 'Toilet', TubShowerUnit: 'Tub'
    Faucet: 'TotalAwarenessFaucet', Showerhead: 'TotalAwarenessShowerhead', Toilet: 'TotalAwarenessToilet', TubShowerUnit: 'TotalAwarenessTub'
  }
  SeriouslyConsiderSidebreak = {
    Faucet: 'fau_considered_purchased', Showerhead: 'shd_considered_purchased', Toilet: 'toi_considered_purchased', TubShowerUnit: ''
  }
  PurchasedSidebreak = {
    Faucet: 'v595', Showerhead: 'v695', Toilet: 'v632', TubShowerUnit: ''
  }

  private selectedBrandCode: number;

  constructor(Category: string) {
    this.Category = Category;
    this.Brandlist = [];
  }

  getAwareness(codes, category): Array<any> {
    this.Brandlist = [];
    let awarenessoption = [];
    codes.forEach(element => {
      // this.Brandlist.push(this.BrandMapping[parseInt(element)]);
      awarenessoption.push(this.TotalAwarenessOptionMapping[category][this.BrandMapping[parseInt(element)]]);
    });
    const sidebreakaware = this.TotalAwarenessSidebreak[category];
    const config = new Chart(
      {
        SideBreak: [sidebreakaware],
        TopBreak: [TimePeriod.Variable],
        Type: ChartTypes.Table,
        Measure: Measure.ColumnPercent
      }, 'Awareness');
    config.showSideBreakOptions(0, awarenessoption);
    config.includeNotAnswered(true);
    if (this.Category == "Faucet") {
      config.setSideBreakFilter(sidebreakaware, 'v593', [2, 3], FilterCondition.AnyItemSelected);
    }
    else if (this.Category == "Showerhead") {
      config.setSideBreakFilter(sidebreakaware, 'v694', [2, 3], FilterCondition.AnyItemSelected);
    }
    else if (this.Category == "Toilet") {
      config.setSideBreakFilter(sidebreakaware, 'v631', [2, 3], FilterCondition.AnyItemSelected);
    }
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.showSideBreakBase(0, true);
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    }, 2);
    this.Awarenesschart.push(config);
    return this.Awarenesschart;
  }

  SeriouslyConsider(codes, category): Array<any> {
    this.Brandlist = [];
    let SerieslyConsidersoption = [];
    codes.forEach(element => {
      SerieslyConsidersoption.push(this.SerieslyConsiderOptionMapping[category][this.BrandMapping[parseInt(element)]]);
    });
    const sidebreakSeriouslyConsider = this.SeriouslyConsiderSidebreak[category];
    const config = new Chart(
      {
        SideBreak: [sidebreakSeriouslyConsider],
        TopBreak: [TimePeriod.Variable],
        Type: ChartTypes.Table,
        Measure: Measure.ColumnPercent
      }, 'SeriouslyConsider');
    config.showSideBreakOptions(0, SerieslyConsidersoption);
    config.includeNotAnswered(true);
    if (this.Category == "Faucet") {
      config.setSideBreakFilter(sidebreakSeriouslyConsider, 'v593', [2, 3], FilterCondition.AnyItemSelected);
    }
    else if (this.Category == "Showerhead") {
      config.setSideBreakFilter(sidebreakSeriouslyConsider, 'v694', [2, 3], FilterCondition.AnyItemSelected);
    }
    else if (this.Category == "Toilet") {
      config.setSideBreakFilter(sidebreakSeriouslyConsider, 'v631', [2, 3], FilterCondition.AnyItemSelected);
    }
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.showSideBreakBase(0, true);
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    this.Seriousconsider.push(config);
    return this.Seriousconsider;
  }

  getPurchased(codes, category): Array<any> {
    this.Brandlist = [];
    let purchaseoption = [];
    codes.forEach(element => {
      purchaseoption.push(this.PurchaseOptionMapping[category][this.BrandMapping[parseInt(element)]]);
    });
    const sidebreakPurchase = this.PurchasedSidebreak[category];
    const config = new Chart(
      {
        SideBreak: [sidebreakPurchase],
        TopBreak: [TimePeriod.Variable],
        Type: ChartTypes.Table,
        Measure: Measure.ColumnPercent
      }, 'Purchased');
    config.showSideBreakOptions(0, purchaseoption);
    config.includeNotAnswered(true);
    if (this.Category == "Faucet") {
      config.setSideBreakFilter(sidebreakPurchase, 'v593', [2, 3], FilterCondition.AnyItemSelected);
    }
    else if (this.Category == "Showerhead") {
      config.setSideBreakFilter(sidebreakPurchase, 'v694', [2, 3], FilterCondition.AnyItemSelected);
    }
    else if (this.Category == "Toilet") {
      config.setSideBreakFilter(sidebreakPurchase, 'v631', [2, 3], FilterCondition.AnyItemSelected);
    }
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.showSideBreakBase(0, true);
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    this.Purchased.push(config);
    return this.Purchased;
  }
}
