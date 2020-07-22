import { Chart } from '../shell/models/chart';
import { ChartTypes } from '../shell/enums/chart.types';
import { Measure } from '../shell/enums/measure';
import { ChartProvider } from '../shell/enums/chart.provider';
import { TimePeriod } from '../shell/models/time.period';
import { RoundOffStrategy } from '../shell/enums/round.off.strategy';
import { BreakType, show } from '../shell/operators/chart.operators';
import { AssetMappings } from './asset.mappings';

export class ReasonforRecentPurchase {

  constructor(category) {
  }

  BrandNameMapping: any;

  showDataMappingForCategory = {
    Faucet: 'v591', Showerhead: 'v692', Toilet: 'v629'
  };
  topBreakOptionMapping = {
    Faucet: {
      'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9,
      'Grohe': 10, 'Hansgrohe': 11, 'Toto': 12,
    },

    Toilet: {
      'Delta': 13, 'American Standard': 14, 'Kohler': 15, 'Moen': 16, 'Peerless': 17, 'Pfister': 18, 'Aqua Source': 19, 'Glacier Bay': 20,
      'Briggs': 21, 'Eljer': 22, 'Gerber': 23, 'Jacuzzi': 24, 'Mansfield': 25, 'Sterling': 26, 'Toto': 27, 'Penguin': 28
    },

    Showerhead: {
      'Delta': 29, 'American Standard': 30, 'Kohler': 31, 'Moen': 32, 'Peerless': 33, 'Pfister': 34, 'Aqua Source': 35, 'Glacier Bay': 36,
      'Grohe': 37, 'Hansgrohe': 38, 'Speakman': 39, 'Waterpik': 40, 'Symmons': 41, 'Proflo': 42, 'Oxygenics': 43
    }
  }

  simpleTable(category, codes): Chart {
    let topBreakOption = [];
    this.BrandNameMapping = AssetMappings.brandNameAndCodes;
    if (codes.length > 0) {
      codes.forEach(element => {
        topBreakOption.push(this.topBreakOptionMapping[category][this.BrandNameMapping[element]])
      });
    }
    const config = new Chart({
      SideBreak: [this.showDataMappingForCategory[category]],
      TopBreak: ['RecentPurchaser'],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'Reason For Recent Purchase', ChartProvider.ECharts);

    if (codes.length > 0 && topBreakOption.length > 0) {
      config.showTopBreakOptions(0, topBreakOption);
    }
    else {
      config.showTopBreakOptions(0, codes);
    }
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.for(BreakType.TopBreak).nest(0, [TimePeriod.Variable]).pipe(show(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]));
    } else {
      config.for(BreakType.TopBreak).nest(0, [TimePeriod.Variable]).pipe(show(0, [TimePeriod.CurrentPeriod]));
    }
    config.showSideBreakBase(0, true);
    config.addShowAllSeries(true);
    config.addCalculationLogic(output => {
      return output;
    });
    return config;
  }

  totalAvg(category): Chart {
    const config = new Chart({
      SideBreak: [this.showDataMappingForCategory[category]],
      TopBreak: [TimePeriod.Variable],
      Type: ChartTypes.Table,
      Measure: Measure.ColumnPercent
    }, 'Reason For Recent Purchase Total Avg', ChartProvider.ECharts);
    config.enableTimeComparison(RoundOffStrategy.BeforeBinding);
    if (TimePeriod.PreviousPeriod) {
      config.showTopBreakOptions(0, [TimePeriod.PreviousPeriod, TimePeriod.CurrentPeriod]);
    } else {
      config.showTopBreakOptions(0, [TimePeriod.CurrentPeriod]);
    }
    config.addShowAllSeries(true);
    return config;
  }

}
