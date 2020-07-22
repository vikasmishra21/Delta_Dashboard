import { Chart } from 'src/app/shell/models/chart';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';

export class PurchaseAgainT3Btrends {

  Category: string;
  Brandlist: string[];
  BrandMapping = AssetMappings.brandNameAndCodes;
  sideBreakOptions: Array<any> = new Array<any>();
  PurchaseAgainT3BSideBreakMapping = {
    Faucet: { 'Delta': 'v1216', 'American Standard': 'v1217', 'Kohler': 'v1218', 'Moen': 'v1219', 'Peerless': 'v1220', 'Pfister': 'v1221', 'Aqua Source': 'v1222', 'Glacier Bay': 'v1223', 'Brizo': 'v1224', 'Grohe': 'v1225', 'Hansgrohe': 'v1226', 'Briggs': 'v1227', 'Crane': 'v1228', 'Eljer': 'v1229', 'Gerber': 'v1230', 'Jacizzi': 'v1231', 'Mansfield': 'v1232', 'Sterling': 'v1233', 'Toto': 'v1234', 'Penguin': 'v1235', 'Danze': 'v1236', 'Speakman': 'v1237', 'Waterpik': 'v1238', 'Symmons': 'v1239', 'Aquatic': 'v1240', 'Maax': 'v1241', 'ASB': 'v1242', 'Style Selections': 'v1243', 'Allen & Roth': 'v1244', 'Swanstone': 'v1245', 'Aqua Glass': 'v1246', 'Proflo': 'v1247', 'Duravit': 'v1248', 'Mirabelle': 'v1249' },
    Showerhead: { 'Delta': 'v712', 'American Standard': 'v713', 'Kohler': 'v714', 'Moen': 'v715', 'Peerless': 'v716', 'Pfister': 'v717', 'Aqua Source': 'v718', 'Glacier Bay': 'v719', 'Grohe': 'v720', 'Hansgrohe': 'v721', 'Speakman': 'v722', 'Waterpik': 'v723', 'Symmons': 'v724', 'Proflo': 'v725', 'Oxygenics': 'v726' },
    Toilet: { 'Delta': 'v651', 'American Standard': 'v652', 'Kohler': 'v653', 'Moen': 'v654', 'Peerless': 'v655', 'Pfister': 'v656', 'Aqua Source': 'v657', 'Glacier Bay': 'v658', 'Briggs': 'v659', 'Eljer': 'v660', 'Gerber': 'v661', 'Jacuzzi': 'v662', 'Mansfield': 'v663', 'Sterling': 'v664', 'Toto': 'v665', 'Penguin': 'v666' }
  };

  purchaseAgainT3BTrendsPPTData: Array<any> = new Array<any>();

  constructor(category) {
    this.Category = category;
    this.Brandlist = [];
  }

  PurchaseAgainT3B(TopBreak, title, codes): Chart {
    this.Brandlist = [];
    codes.forEach(element => {
      this.Brandlist.push(this.BrandMapping[parseInt(element)]);
    });
    this.Brandlist.forEach(element => {
      this.sideBreakOptions.push(this.PurchaseAgainT3BSideBreakMapping[this.Category][element]);
    });

    const config = new Chart({
      SideBreak: this.sideBreakOptions,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'PurchaseAgainT3B Trends', ChartProvider.ECharts);
    this.sideBreakOptions.forEach((val, i) => {
      config.combineSideBreakOptions(val, [8, 9, 10], 'combinePurchaseAgain');
      config.showSideBreakOptions(i, [100001]);
    });
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '550px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')';
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
        textStyle: { fontSize: 11 },
        align: 'center'
      };
      let counter = 0;
      chartConfig.xAxis.data = [];
      chartConfig.legend.bottom = '20%';
      output.forEach((ele, i) => {
        this.Brandlist.forEach(element => {
          if (ele.SeriesName === 'combinePurchaseAgain' && ele.SeriesTree.split('>')[0] === element) {
            const Score = isNaN(ele.Score) ? 0 : ele.Score;
            const legendName = ele.SeriesTree.split('>')[0];
            const obj = {
              data: [Score],
              name: legendName,
              type: 'line'
            };
            if (!chartConfig.legend.data.includes(legendName)) {
              chartConfig.legend.data.push(legendName);
              chartConfig.series[chartConfig.legend.data.indexOf(legendName)] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(legendName)].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        });
      });
      this.purchaseAgainT3BTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
