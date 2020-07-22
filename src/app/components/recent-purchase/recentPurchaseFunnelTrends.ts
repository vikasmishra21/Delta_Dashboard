import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';
import { AssetMappings } from 'src/app/model/asset.mappings';

export class RecentPurchaseFunnelTrends {

  Brandlist: string[];
  Category: string;
  BrandMapping = AssetMappings.brandNameAndCodes;

  TotalAwarenessSidebreak = {
    // Faucet: 'Faucet', Showerhead: 'Showerhead', Toilet: 'Toilet', TubShowerUnit: 'Tub'
    Faucet: 'TotalAwarenessFaucet', Showerhead: 'TotalAwarenessShowerhead', Toilet: 'TotalAwarenessToilet', TubShowerUnit: 'TotalAwarenessTub'
  };

  SeriouslyConsiderSidebreak = {
    Faucet: 'fau_considered_purchased', Showerhead: 'shd_considered_purchased', Toilet: 'toi_considered_purchased', TubShowerUnit: ''
  }

  PurchasedSidebreak = {
    Faucet: 'v595', Showerhead: 'v695', Toilet: 'v632', TubShowerUnit: ''
  };

  TotalAwarenessOptionMapping = {
    Faucet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 },
    Showerhead: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 },
    Toilet: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 },
    TubShowerUnit: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections': 28, 'Allen & Roth': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Others/Not aware of any of the above': 43, 'Home Improvement Stores': 44, 'Sears/Kenmore': 45, 'GE': 46, 'Other Store Brands': 47, 'None/Nothing': 48, 'Don`t know': 49, 'Decline to answer': 50, 'Unable to code': 51 }
  };

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
    TubShowerUnit: { 'Delta': 1, 'American Standard': 2, 'Kohler': 3, 'Moen': 4, 'Peerless': 5, 'Pfister': 6, 'Aqua Source': 7, 'Glacier Bay': 8, 'Brizo': 9, 'Grohe': 10, 'Hansgrohe': 11, 'Briggs': 12, 'Crane [HIDDEN AS OF 2019.Q1]': 13, 'Eljer': 14, 'Gerber': 15, 'Jacuzzi': 16, 'Mansfield': 17, 'Sterling': 18, 'Toto': 19, 'Penguin': 20, 'Danze [HIDDEN AS OF 2019.Q1]': 21, 'Speakman': 22, 'Waterpik': 23, 'Symmons': 24, 'Aquatic': 25, 'Maax': 26, 'ASB': 27, 'Style Selections [HIDDEN AS OF 2019.Q1]': 28, 'Allen & Roth [HIDDEN AS OF 2019.Q1]': 29, 'Swanstone': 30, 'Aqua Glass': 31, 'Proflo': 32, 'Duravit': 33, 'Mirabelle': 34, 'Villeroy & Boch': 35, 'DecoLav': 36, 'Rohl': 37, 'Victoria & Albert': 38, 'Ronbow': 39, 'Vortens': 40, 'Oxygenics': 41, 'MTI': 42, 'Other': 43, 'Dont know': 44 }
  };

  awarenessOptions: Array<any> = new Array<any>();
  seriouslyConsiderOptions: Array<any> = new Array<any>();
  filter:string;
  recentPurchaseFunnelTrendsPPTData: Array<any> = new Array<any>();
  constructor(Category: string) {
    this.Category = Category;
    this.Brandlist = [];
  }

  getAwareness(TopBreak, title, codes,filter): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    const config = new Chart({
      SideBreak: [this.TotalAwarenessSidebreak[this.Category]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Get Awareness Trends', ChartProvider.ECharts);
    this.Brandlist.forEach(element => {
      this.awarenessOptions.push(this.TotalAwarenessOptionMapping[this.Category][element]);
      config.showSideBreakOptions(0, this.awarenessOptions);
    });
    config.includeNotAnswered(true);
    if (this.Category === 'Faucet') {
      config.setSideBreakFilter(this.TotalAwarenessSidebreak[this.Category], 'v593', [2, 3], FilterCondition.AnyItemSelected);
    } else if (this.Category === 'Showerhead') {
      config.setSideBreakFilter(this.TotalAwarenessSidebreak[this.Category], 'v694', [2, 3], FilterCondition.AnyItemSelected);
    } else if (this.Category === 'Toilet') {
      config.setSideBreakFilter(this.TotalAwarenessSidebreak[this.Category], 'v631', [2, 3], FilterCondition.AnyItemSelected);
    }
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')' + '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '5%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (!chartConfig.legend.data.includes(ele.SeriesName)) {
          chartConfig.legend.data.push(ele.SeriesName);
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
        } else {
          chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
        }
        if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
          chartConfig.xAxis.data[counter] = ele.CategoryName;
          counter++;
        }
      });
      this.recentPurchaseFunnelTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
 
  SeriouslyConsider(TopBreak, title, codes,filter): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    const config = new Chart({
      SideBreak: [this.SeriouslyConsiderSidebreak[this.Category]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Seriously Consider Trends', ChartProvider.ECharts);
    this.Brandlist.forEach(element => {
      this.seriouslyConsiderOptions.push(this.SerieslyConsiderOptionMapping[this.Category][element]);
      config.showSideBreakOptions(0, this.seriouslyConsiderOptions);
    });
    config.includeNotAnswered(true);
    if (this.Category === 'Faucet') {
      config.setSideBreakFilter(this.SeriouslyConsiderSidebreak[this.Category], 'v593', [2, 3], FilterCondition.AnyItemSelected);
    } else if (this.Category === 'Showerhead') {
      config.setSideBreakFilter(this.SeriouslyConsiderSidebreak[this.Category], 'v694', [2, 3], FilterCondition.AnyItemSelected);
    } else if (this.Category === 'Toilet') {
      config.setSideBreakFilter(this.SeriouslyConsiderSidebreak[this.Category], 'v631', [2, 3], FilterCondition.AnyItemSelected);
    }
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '5%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
          if (!chartConfig.legend.data.includes(ele.SeriesName)) {
            chartConfig.legend.data.push(ele.SeriesName);
            chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.recentPurchaseFunnelTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getPurchased(TopBreak, title, codes,filter): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    const config = new Chart({
      SideBreak: [this.PurchasedSidebreak[this.Category]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Purchased Trends', ChartProvider.ECharts);
    this.Brandlist.forEach(element => {
      this.seriouslyConsiderOptions.push(this.PurchaseOptionMapping[this.Category][element]);
      config.showSideBreakOptions(0, this.seriouslyConsiderOptions);
    });
    config.includeNotAnswered(true);
    if (this.Category === 'Faucet') {
      config.setSideBreakFilter(this.PurchasedSidebreak[this.Category], 'v593', [2, 3], FilterCondition.AnyItemSelected);
    } else if (this.Category === 'Showerhead') {
      config.setSideBreakFilter(this.PurchasedSidebreak[this.Category], 'v694', [2, 3], FilterCondition.AnyItemSelected);
    } else if (this.Category === 'Toilet') {
      config.setSideBreakFilter(this.PurchasedSidebreak[this.Category], 'v631', [2, 3], FilterCondition.AnyItemSelected);
    }
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '5%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      chartConfig.legend.textStyle = {
        fontSize: 9,
        padding: [0, 25, 0, 0]
      };
      chartConfig.legend.selectorLabel = {
        distance: 10
      };
      chartConfig.tooltip = {
        trigger: 'axis',
        textStyle: {fontSize: 11},
        align: 'center'
      };
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        if (ele.SeriesName !== 'No Answer') {
          if (!chartConfig.legend.data.includes(ele.SeriesName)) {
            chartConfig.legend.data.push(ele.SeriesName);
            chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(ele.SeriesName)].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.recentPurchaseFunnelTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
