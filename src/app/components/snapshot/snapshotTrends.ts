import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { Measure } from 'src/app/shell/enums/measure';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { FilterCondition } from 'src/app/shell/enums/filter-condition.enum';

export class SnapshotTrends {

  category: any;
  brandname: any;
  newBrand: any;

  Awareness = {
    Unaided: {
      Faucet: 'fauunaided', Showerhead: 'shdunaided', Toilet: 'toiunaided', TubShowerUnit: 'tubunaided'
    },
    TotalBrand: {
      // Faucet: 'Faucet', Showerhead: 'Showerhead', Toilet: 'Toilet', TubShowerUnit: 'Tub'
     // after changing awareness variable for total brands
      Faucet: 'TotalAwarenessFaucet', Showerhead: 'TotalAwarenessShowerhead', Toilet: 'TotalAwarenessToilet', TubShowerUnit: 'TotalAwarenessTub'
    }
  };
  UnaidedBrandOptionMapping = {
    Delta: { option: [1] }, Moen: { option: [4] }, Kohler: { option: [3] }, Peerless: { option: [5] }, 'American Standard': { option: [2] }, Pfister: { option: [6] }, Waterpik: { option: [23] }
  };
  TotalBrandOptionMapping = {
    Delta: { option: [1] }, Moen: { option: [4] }, Kohler: { option: [3] }, Peerless: { option: [5] }, 'American Standard': { option: [2] }, Pfister: { option: [6] }, Waterpik: { option: [23] }
  };
  EquityOptinMapping = {
    Faucet: { Delta: { option: [1, 2] }, Moen: { option: [5, 6] }, Kohler: { option: [3, 4] }, Peerless: { option: [9, 10] }, 'American Standard': { option: [7, 8] }, Pfister: { option: [11, 12] }, Waterpik: { option: [] } },
    Showerhead: { Delta: { option: [33, 34] }, Moen: { option: [39, 40] }, Kohler: { option: [37, 38] }, Peerless: { option: [45, 46] }, 'American Standard': { option: [35,36] }, Pfister: { option: [47, 48] }, Waterpik: { option: [43, 44] } },
    Toilet: { Delta: { option: [17, 18] }, Moen: { option: [21, 22] }, Kohler: { option: [19, 20] }, Peerless: { option: [25, 26] }, 'American Standard': { option: [23, 24] }, Pfister: { option: [27, 28] }, Waterpik: { option: [] } },
    TubShowerUnit: {
      Delta: { option: [51, 52] }, Moen: { option: [57, 58] }, Kohler: { option: [55, 56] }, Peerless: { option: [59, 60] }, 'American Standard': { option: [53, 54] }, Pfister: { option: [] }, Waterpik: { option: [] }
    }
  };
  SeriesNameMapForEquity = {
    Faucet: {
      Delta: { 'Active': { option: 'Active - Faucet - Delta' }, 'Latent': { option: 'Latent - Faucet - Delta' }, 'No Answer': { option: '' } },
      Moen: { 'Active': { option: 'Active - Faucet - Moen' }, 'Latent': { option: 'Latent - Faucet - Moen' }, 'No Answer': { option: '' } },
      Kohler: { 'Active': { option: 'Active - Faucet - Kohler' }, 'Latent': { option: 'Latent - Faucet - Kohler' }, 'No Answer': { option: '' } },
      Peerless: { 'Active': { option: 'Active - Faucet - Peerless' }, 'Latent': { option: 'Latent - Faucet - Peerless' }, 'No Answer': { option: '' } },
      'American Standard': { 'Active': { option: 'Active - Faucet - American Standard' }, 'Latent': { option: 'Latent - Faucet - American Standard' }, 'No Answer': { option: '' } },
      Pfister: { 'Active': { option: 'Active - Faucet - Pfister' }, 'Latent': { option: 'Latent - Faucet - Pfister' }, 'No Answer': { option: '' } },
      Waterpik: { 'Active': { option: 'Active - Faucet - Waterpik' }, 'Latent': { option: 'Latent - Faucet - Waterpik' }, 'No Answer': { option: '' } }
    },
    Showerhead: {
      Delta: { 'Active': { option: 'Active - Showerhead - Delta' }, 'Latent': { option: 'Latent - Showerhead - Delta' }, 'No Answer': { option: '' } },
      Moen: { 'Active': { option: 'Active - Showerhead - Moen' }, 'Latent': { option: 'Latent - Showerhead - Moen' }, 'No Answer': { option: '' } },
      Kohler: { 'Active': { option: 'Active - Showerhead - Kohler' }, 'Latent': { option: 'Latent - Showerhead - Kohler' }, 'No Answer': { option: '' } },
      Peerless: { 'Active': { option: 'Active - Showerhead - Peerless' }, 'Latent': { option: 'Latent - Showerhead - Peerless' }, 'No Answer': { option: '' } },
      'American Standard': { 'Active': { option: 'Active - Showerhead - American Standard' }, 'Latent': { option: 'Latent - Showerhead - American Standard' }, 'No Answer': { option: '' } },
      Pfister: { 'Active': { option: 'Active - Showerhead - Pfister' }, 'Latent': { option: 'Latent - Showerhead - Pfister' }, 'No Answer': { option: '' } },
      Waterpik: { 'Active': { option: 'Active - Showerhead - Waterpik' }, 'Latent': { option: 'Latent - Showerhead - Waterpik' }, 'No Answer': { option: '' } }
    },
    Toilet: {
      Delta: { 'Active': { option: 'Active - Toilet - Delta' }, 'Latent': { option: 'Latent - Toilet - Delta' }, 'No Answer': { option: '' } },
      Moen: { 'Active': { option: 'Active - Toilet - Moen' }, 'Latent': { option: 'Latent - Toilet - Moen' }, 'No Answer': { option: '' } },
      Kohler: { 'Active': { option: 'Active - Toilet - Kohler' }, 'Latent': { option: 'Latent - Toilet - Kohler' }, 'No Answer': { option: '' } },
      Peerless: { 'Active': { option: 'Active - Toilet - Peerless' }, 'Latent': { option: 'Latent - Toilet - Peerless' }, 'No Answer': { option: '' } },
      'American Standard': { 'Active': { option: 'Active - Toilet - American Standard' }, 'Latent': { option: 'Latent - Toilet - American Standard' }, 'No Answer': { option: '' } },
      Pfister: { 'Active': { option: 'Active - Toilet - Pfister' }, 'Latent': { option: 'Latent - Toilet - Pfister' }, 'No Answer': { option: '' } },
      Waterpik: { 'Active': { option: 'Active - Toilet - Waterpik' }, 'Latent': { option: 'Latent - Toilet - Waterpik' }, 'No Answer': { option: '' } }
    },
    TubShowerUnit: {
      Delta: { 'Active': { option: 'Active - TUB - Delta' }, 'Latent': { option: 'Latent - TUB - Delta' }, 'No Answer': { option: '' } },
      Moen: { 'Active': { option: 'Active - TUB - Moen' }, 'Latent': { option: 'Latent - TUB - Moen' }, 'No Answer': { option: '' } },
      Kohler: { 'Active': { option: 'Active - TUB - Kohler' }, 'Latent': { option: 'Latent - TUB - Kohler' }, 'No Answer': { option: '' } },
      Peerless: { 'Active': { option: 'Active - TUB - Peerless' }, 'Latent': { option: 'Latent - TUB - Peerless' }, 'No Answer': { option: '' } },
      'American Standard': { 'Active': { option: 'Active - TUB - American Standard' }, 'Latent': { option: 'Latent - TUB - American Standard' }, 'No Answer': { option: '' } },
      Pfister: { 'Active': { option: 'Active - TUB - Pfister' }, 'Latent': { option: 'Latent - TUB - Pfister' }, 'No Answer': { option: '' } },
      Waterpik: { 'Active': { option: 'Active - TUB - Waterpik' }, 'Latent': { option: 'Latent - TUB - Waterpik' }, 'No Answer': { option: '' } }
    }
  };

  variableLegendMapping = {
    fauunaided: 'Unaided Brand Awareness',
    TotalAwarenessFaucet: 'Total Brand (Unaided + Aided) Awareness',
    shdunaided: 'Unaided Brand Awareness',
    TotalAwarenessShowerhead: 'Total Brand (Unaided + Aided) Awareness',
    toiunaided: 'Unaided Brand Awareness',
    TotalAwarenessToilet: 'Total Brand (Unaided + Aided) Awareness',
    tubunaided: 'Unaided Brand Awareness',
    TotalAwarenessTub: 'Total Brand (Unaided + Aided) Awareness'
  };

  strongRMapping = {
    Delta: 'RelationshipDelta',
    'American Standard': 'RelationshipAmerican',
    Kohler: 'RelationshipKohler',
    Moen: 'RelationshipMoen',
    Peerless: 'RelationshipPeerless',
    Pfister: 'RelationshipPfister',
    Waterpik: 'RelationshipWaterpik'
  };

  BrandImageryOptionMapping = {
    Delta: { option: 1 }, Moen: { option: 4 }, Kohler: { option: 3 }, Peerless: { option: 5 }, 'American Standard': { option: 2 }, Pfister: { option: 6 }, Waterpik: { option: 7 }
  };

  brandCodes = {
    Delta: 1,
    'American Standard': 2,
    Kohler: 3,
    Moen: 4,
    Peerless: 5,
    Pfister: 6,
    Waterpik: 23,
  };
  private readonly imageryLegendsMapping = {
    v558: 'Is a brand I trust',
    v559: 'Has products that are a good value for the money',
    v560: 'Is a leader',
    v561: 'Is innovative',
    v562: 'Is creative',
    v563: 'Is a brand you can be proud to own',
    v564: 'Is a brand that plays it safe',
    v565: 'Has a variety of styles and finishes [REMOVED 2017.Q2] [SKIPPED]',
    v566: 'Offers products designed to be practical and functional',
    v567: 'Is a high quality brand',
    v568: 'Is a brand worth paying more for',
    v569: 'Is a reliable, dependable brand',
    v570: 'Meets a true need',
    v571: 'Is a respectable brand',
    v572: 'Provides products that are well thought out',
    v573: 'Makes a bit of a statement about you',
    v574: 'Tends to have more higher-price products than lower-price products',
    v575: 'Has products you would see in a high-end home',
    v576: 'Has designs that are new / up-to-date',
    v1323: 'Provides well designed products at affordable price points',
    v1324: 'Helps my space look good within my budget',
    v1325: 'Is for the budget conscious buyer'
  };
  consideration = {
    Faucet: {
      Delta: 'v499', Moen: 'v502', Kohler: 'v501', Peerless: 'v503', 'American Standard': 'v500', Pfister: 'v504', Waterpik: ''
    },
    Showerhead: {
      Delta: 'v529', Moen: 'v532', Kohler: 'v531', Peerless: 'v533', 'American Standard': 'v530', Pfister: 'v534', Waterpik: 'v540'
    },
    Toilet: {
      Delta: 'v512', Moen: 'v515', Kohler: 'v514', Peerless: 'v516', 'American Standard': 'v513', Pfister: 'v517', Waterpik: ''
    },
    TubShowerUnit: {
      Delta: 'v546', Moen: 'v549', Kohler: 'v548', Peerless: 'v550', 'American Standard': 'v547', Pfister: '', Waterpik: ''
    }
  };
  getSnapshotTrendsPptData: Array<any> = new Array<any>();

  constructor(category, brandname) {
    this.category = category;
    if (brandname === 'American') {
      this.brandname = 'American Standard';
    } else {
      this.brandname = brandname;
    }
  }

  getAwarenessMatrix(TopBreak, title,filter): Chart {
    const UnaidedSidebreak = this.Awareness.Unaided[this.category];
    const TotalBrandSidebreak = this.Awareness.TotalBrand[this.category];
    const UnaidedBrandOption = this.UnaidedBrandOptionMapping[this.brandname].option;
    const config = new Chart({
      SideBreak: [UnaidedSidebreak, TotalBrandSidebreak],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'AwarenessMatrix Trends', ChartProvider.ECharts);
    config.includeNotAnswered(true);
    config.showSideBreakOptions(0, UnaidedBrandOption);

    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '700px';
      chartConfig.title.text = title + ' - ' + this.brandname + ' - ' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
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
      chartConfig.legend.bottom = '2%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.variableLegendMapping[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName === this.brandname) {
          if (!chartConfig.legend.data.includes(this.variableLegendMapping[ele.SeriesVariableID])) {
            chartConfig.legend.data.push(this.variableLegendMapping[ele.SeriesVariableID]);
            chartConfig.series[chartConfig.legend.data.indexOf(this.variableLegendMapping[ele.SeriesVariableID])] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(this.variableLegendMapping[ele.SeriesVariableID])].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      return chartConfig;
    });
    return config;
  }

  getBrandEquity(TopBreak, title,filter): Chart {
    const EquityOptions = this.EquityOptinMapping[this.category][this.brandname].option;
    const config = new Chart({
      SideBreak: ['BrandEquity'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Brand Equity', ChartProvider.ECharts);
    config.showSideBreakOptions(0, EquityOptions);
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.brandname + ' - ' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
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
      chartConfig.legend.bottom = '2%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: ele.SeriesName,
          type: 'line'
        };
        let pre;
        if (ele.SeriesName === 'No Answer') {
          pre = ele.SeriesName.slice(0, 9);
        } else {
          pre = ele.SeriesName.slice(0, 6);
        }
        if (ele.SeriesName === this.SeriesNameMapForEquity[this.category][this.brandname][pre].option) {
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
      return chartConfig;
    });
    return config;
  }

  getStrongRelationship(TopBreak, title,filter): Chart {
    const sidebreak = this.strongRMapping[this.brandname];
    const config = new Chart({
      SideBreak: [sidebreak],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'StrongRelation', ChartProvider.ECharts);
    config.showSideBreakOptions(0, [1]);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.brandname + ' - ' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
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
      chartConfig.legend.bottom = '2%';
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
      return chartConfig;
    });
    return config;
  }

  getBrandImagery(TopBreak, SideBreak, title,filter): Chart {
    const BrandImageryOption = this.BrandImageryOptionMapping[this.brandname].option;
    const config = new Chart({
      SideBreak,
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Brand Imagery', ChartProvider.ECharts);
    config.SideBreak.forEach((value, index) => {
      config.showSideBreakOptions(index, [BrandImageryOption]);
      config.showSideBreakBase(index, true);
      config.setSideBreakFilter(value, 'v467', [this.brandCodes[this.brandname]], FilterCondition.AnyItemSelected);
    });
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '650px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.brandname + ' - ' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '55%';
      chartConfig.grid.y = '5%';
      chartConfig.series = [];
      chartConfig.legend.data = [];
      chartConfig.legend.width = '100%';
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
      chartConfig.legend.bottom = '0%';
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const obj = {
          data: [Score],
          name: this.imageryLegendsMapping[ele.SeriesVariableID],
          type: 'line'
        };
        if (ele.SeriesName !== "No Answer") {
          if (ele.SeriesName !== 'American Stand') {
            if (ele.SeriesName === this.brandname) {
              if (!chartConfig.legend.data.includes(this.imageryLegendsMapping[ele.SeriesVariableID])) {
                chartConfig.legend.data.push(this.imageryLegendsMapping[ele.SeriesVariableID]);
                chartConfig.series[chartConfig.legend.data.indexOf(this.imageryLegendsMapping[ele.SeriesVariableID])] = obj;
              } else {
                chartConfig.series[chartConfig.legend.data.indexOf(this.imageryLegendsMapping[ele.SeriesVariableID])].data.push(Score);
              }
              if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
                chartConfig.xAxis.data[counter] = ele.CategoryName;
                counter++;
              }
            }
          } else {
            if (ele.SeriesName === 'American Stand') {
              this.newBrand = 'American Stand';
            }
            if (ele.SeriesName === this.newBrand) {
              if (!chartConfig.legend.data.includes(this.imageryLegendsMapping[ele.SeriesVariableID])) {
                chartConfig.legend.data.push(this.imageryLegendsMapping[ele.SeriesVariableID]);
                chartConfig.series[chartConfig.legend.data.indexOf(this.imageryLegendsMapping[ele.SeriesVariableID])] = obj;
              } else {
                chartConfig.series[chartConfig.legend.data.indexOf(this.imageryLegendsMapping[ele.SeriesVariableID])].data.push(Score);
              }
              if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
                chartConfig.xAxis.data[counter] = ele.CategoryName;
                counter++;
              }
            }
          }
        }

      });
      return chartConfig;
    });
    return config;
  }

  getConsideration(TopBreak, title,filter): Chart {
    const considerationSideBreak = this.consideration[this.category][this.brandname];
    const config = new Chart({
      SideBreak: [considerationSideBreak],
      TopBreak: [TopBreak],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Line
    }, 'Consideration Trends', ChartProvider.ECharts);
    config.combineSideBreakOptions(considerationSideBreak, [1, 2], '1st/2nd Choice (net)');
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' - ' + this.brandname + ' - ' + TopBreak+ '$' +filter;
      chartConfig.title.show = false;
      chartConfig.xAxis.show = true;
      chartConfig.xAxis.splitLine = false;
      chartConfig.grid.containLabel = true;
      chartConfig.grid.width = '70%';
      chartConfig.grid.height = '65%';
      chartConfig.grid.y = '3%';
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
      chartConfig.legend.bottom = '2%';
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
      // this.getSnapshotTrendsPptData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
