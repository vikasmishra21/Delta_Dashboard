import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from '../shell/enums/measure';
import { ChartProvider } from '../shell/enums/chart.provider';
import { TimePeriod } from '../shell/models/time.period';
import { FilterCondition } from '../shell/enums/filter-condition.enum';
import { RoundOffStrategy } from '../shell/enums/round.off.strategy';
import { show, BreakType } from '../shell/operators/chart.operators';
import { AssetMappings } from './asset.mappings';
export class Purchasereaction {

  constructor() { }

  Brandlist: Array<string> = new Array<any>();
  Category: string;
  SatisfactionT3BC: Array<Chart> = new Array<any>();
  RecommandationT3BC: Array<Chart> = new Array<any>();
  PurchaseAgainT3BC: Array<Chart> = new Array<any>();
  socialmedia: Array<Chart> = new Array<any>();

  satisfactionst3isdebreak: Array<any> = new Array<any>();
  PurchaseAgainT3Bsidebreak: Array<any> = new Array<any>();
  RecommandationT3Bsidebreak: Array<any> = new Array<any>();
  SocialTopbreakoption: Array<any> = new Array<any>();;


  BrandMapping = AssetMappings.brandNameAndCodes;

  SatisfactionT3BSideBreakMapping = {
    'Faucet': { 'Delta': 'v597', 'American Standard': 'v598', 'Kohler': 'v599', 'Moen': 'v600', 'Peerless': 'v601', 'Pfister': 'v602', 'Aqua Source': 'v603', 'Glacier Bay': 'v604', 'Brizo': 'v605', 'Grohe': 'v606', 'Hansgrohe': 'v607', 'Toto': 'v608' },
    'Showerhead': { 'Delta': 'v697', 'American Standard': 'v698', 'Kohler': 'v699', 'Moen': 'v700', 'Peerless': 'v701', 'Pfister': 'v702', 'Aqua Source': 'v703', 'Glacier Bay': 'v704', 'Grohe': 'v705', 'Hansgrohe': 'v706', 'Speakman': 'v707', 'Waterpik': 'v708', 'Symmons': 'v709', 'Proflo': 'v710', 'Oxygenics': 'v711' },
    'Toilet': { 'Delta': 'v635', 'American Standard': 'v636', 'Kohler': 'v637', 'Moen': 'v638', 'Peerless': 'v639', 'Pfister': 'v640', 'AquaSource': 'v641', 'GlacierBay': 'v642', 'Briggs': 'v643', 'Eljer': 'v644', 'Gerber': 'v645', 'Jacuzzi': 'v646', 'Mansfield': 'v647', 'Sterling': 'v648', 'Toto': 'v649', 'Penguin': 'v650' }
  }
  RecommandationT3BSideBreakMapping = {
    Faucet: { 'Delta': 'v587', 'American Standard': 'v609', 'Kohler': 'v610', 'Moen': 'v611', 'Peerless': 'v612', 'Pfister': 'v613', 'Aqua Source': 'v614', 'Glacier Bay': 'v615', 'Brizo': 'v616', 'Grohe': 'v617', 'Hansgrohe': 'v618', 'Toto': 'v619' },
    Showerhead: { 'Delta': 'v727', 'American Standard': 'v728', 'Kohler': 'v729', 'Moen': 'v730', 'Peerless': 'v731', 'Pfister': 'v732', 'Aqua Source': 'v733', 'Glacier Bay': 'v734', 'Grohe': 'v735', 'Hansgrohe': 'v736', 'Speakman': 'v737', 'Waterpik': 'v738', 'Symmons': 'v739', 'Proflo': 'v740', 'Oxygenics': 'v741' },
    Toilet: { 'Delta': 'v667', 'American Standard': 'v668', 'Kohler': 'v669', 'Moen': 'v670', 'Peerless': 'v671', 'Pfister': 'v672', 'Aqua Source': 'v673', 'Glacier Bay': 'v674', 'Briggs': 'v675', 'Eljer': 'v676', 'Gerber': 'v677', 'Jacuzzi': 'v678', 'Mansfield': 'v679', 'Sterling': 'v680', 'Toto': 'v681', 'Penguin': 'v682' }
  }
  PurchaseAgainT3BSideBreakMapping = {
    Faucet: { 'Delta': 'v1216', 'American Standard': 'v1217', 'Kohler': 'v1218', 'Moen': 'v1219', 'Peerless': 'v1220', 'Pfister': 'v1221', 'Aqua Source': 'v1222', 'Glacier Bay': 'v1223', 'Brizo': 'v1224', 'Grohe': 'v1225', 'Hansgrohe': 'v1226', 'Briggs': 'v1227', 'Crane': 'v1228', 'Eljer': 'v1229', 'Gerber': 'v1230', 'Jacizzi': 'v1231', 'Mansfield': 'v1232', 'Sterling': 'v1233', 'Toto': 'v1234', 'Penguin': 'v1235', 'Danze': 'v1236', 'Speakman': 'v1237', 'Waterpik': 'v1238', 'Symmons': 'v1239', 'Aquatic': 'v1240', 'Maax': 'v1241', 'ASB': 'v1242', 'Style Selections': 'v1243', 'Allen & Roth': 'v1244', 'Swanstone': 'v1245', 'Aqua Glass': 'v1246', 'Proflo': 'v1247', 'Duravit': 'v1248', 'Mirabelle': 'v1249' },
    Showerhead: { 'Delta': 'v712', 'American Standard': 'v713', 'Kohler': 'v714', 'Moen': 'v715', 'Peerless': 'v716', 'Pfister': 'v717', 'Aqua Source': 'v718', 'Glacier Bay': 'v719', 'Grohe': 'v720', 'Hansgrohe': 'v721', 'Speakman': 'v722', 'Waterpik': 'v723', 'Symmons': 'v724', 'Proflo': 'v725', 'Oxygenics': 'v726' },
    Toilet: { 'Delta': 'v651', 'American Standard': 'v652', 'Kohler': 'v653', 'Moen': 'v654', 'Peerless': 'v655', 'Pfister': 'v656', 'Aqua Source': 'v657', 'Glacier Bay': 'v658', 'Briggs': 'v659', 'Eljer': 'v660', 'Gerber': 'v661', 'Jacuzzi': 'v662', 'Mansfield': 'v663', 'Sterling': 'v664', 'Toto': 'v665', 'Penguin': 'v666' }
  }

  SocialMediaSidebreak = { Faucet: 'v620', Showerhead: 'v743', Toilet: 'v683' }

  SocialMediaTopbreak = { Faucet: 'v595', Showerhead: 'v695', Toilet: 'v632' }

  SocialMediaTopbreakOptionMapping = {
    Faucet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    Showerhead: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 },
    Toilet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 }
  }

  // codes = ['1', '4', '3', '5', '2','6'];

  getSatisfactionT3B(codes, Category): Chart {
    // codes = this.codes;
    this.satisfactionst3isdebreak = [];
    codes.forEach(element => {
      this.satisfactionst3isdebreak.push(this.SatisfactionT3BSideBreakMapping[Category][this.BrandMapping[element]]);
    });
    const config = new Chart({
      SideBreak: this.satisfactionst3isdebreak,
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'SatisfactionT3B', ChartProvider.ECharts);
    this.satisfactionst3isdebreak.forEach((val, i) => {
      config.combineSideBreakOptions(val, [8, 9, 10], "combineSatisfaction");
      config.showSideBreakOptions(i, [100001]);
      // config.showSideBreakOptions(i, [10001]);
      config.showSideBreakBase(i, true);
    });
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addShowAllSeries(true);
    config.enableSigTest();
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  getPurchaseAgainT3B(codes, Category): Chart {
    // codes = this.codes;
    this.PurchaseAgainT3Bsidebreak = [];
    codes.forEach(element => {
      this.PurchaseAgainT3Bsidebreak.push(this.PurchaseAgainT3BSideBreakMapping[Category][this.BrandMapping[element]]);
    });
    const config = new Chart({
      SideBreak: this.PurchaseAgainT3Bsidebreak,
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'PurchaseAgainT3B', ChartProvider.ECharts);

    this.PurchaseAgainT3Bsidebreak.forEach((val, i) => {
      // config.showSideBreakOptions(i, [8, 9, 10]);
      config.combineSideBreakOptions(val, [8, 9, 10], "combinePurchaseAgain");
      config.showSideBreakOptions(i, [100001]);
      config.showSideBreakBase(i, true);
    });
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addShowAllSeries(true);
    config.enableSigTest();
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }


  getRecommandationT3B(codes, Category): Chart {
    // codes = this.codes;
    codes.forEach(element => {
      this.RecommandationT3Bsidebreak.push(this.RecommandationT3BSideBreakMapping[Category][this.BrandMapping[element]]);
    });
    const config = new Chart({
      SideBreak: this.RecommandationT3Bsidebreak,
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'RecommandationT3B', ChartProvider.ECharts);

    this.RecommandationT3Bsidebreak.forEach((val, i) => {
      // config.showSideBreakOptions(i, [8, 9, 10]);
      config.combineSideBreakOptions(val, [8, 9, 10], "combineRecommended");
      config.showSideBreakOptions(i, [100001]);
      config.showSideBreakBase(i, true);
    });
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addShowAllSeries(true);
    config.enableSigTest();
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  getSocialMedia(codes, Category): Chart {
    // codes = this.codes;
    this.SocialTopbreakoption = [];
    const SocialMediasidebreak = this.SocialMediaSidebreak[Category]
    const SocialTopbreak = this.SocialMediaTopbreak[Category];
    codes.forEach(element => {
      this.SocialTopbreakoption.push(this.SocialMediaTopbreakOptionMapping[Category][this.BrandMapping[element]]);
    });
    const config = new Chart({
      SideBreak: [SocialMediasidebreak],
      TopBreak: [SocialTopbreak],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'SocialMedia', ChartProvider.ECharts);
    config.showSideBreakBase(0, true);
    config.showTopBreakOptions(0, this.SocialTopbreakoption);
    if (TimePeriod.Variable) {
      if (TimePeriod.PreviousPeriod) {
        config.for(BreakType.TopBreak).nest(0, [TimePeriod.Variable]).pipe(show(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]));
      } else {
        config.for(BreakType.TopBreak).nest(0, [TimePeriod.Variable]).pipe(show(0, [TimePeriod.CurrentPeriod]));
      }
    }
    config.addShowAllSeries(true);
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }
}
