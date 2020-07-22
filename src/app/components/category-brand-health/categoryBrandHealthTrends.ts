import { variable } from '@angular/compiler/src/output/output_ast';
import { Chart } from 'src/app/shell/models/chart';
import { ChartTypes } from 'src/app/shell/enums/chart.types';
import { ChartProvider } from 'src/app/shell/enums/chart.provider';
import { Measure } from 'src/app/shell/enums/measure';
import { AssetMappings } from 'src/app/model/asset.mappings';
import { config } from 'rxjs';

export class CategoryBrandHealthTrends {

  UnaidedMappingForCategory = {
    Faucet: 'fauunaided', Showerhead: 'shdunaided', Toilet: 'toiunaided', TubShowerUnit: 'tubunaided'
  };

  TotalBrandMappingForCategory = {
    // Faucet: 'Faucet', Showerhead: 'Showerhead', Toilet: 'Toilet', TubShowerUnit: 'Tub'
    Faucet: 'TotalAwarenessFaucet', Showerhead: 'TotalAwarenessShowerhead', Toilet: 'TotalAwarenessToilet', TubShowerUnit: 'TotalAwarenessTub'
  };

  consideration = {
    Faucet: {
      Delta: 'v499', Moen: 'v502', Kohler: 'v501', Peerless: 'v503', 'American Standard': 'v500', Pfister: 'v504', 'Aqua Source': 'v505', 'Glacier Bay': 'v506',
      Brizo: 'v507', Grohe: 'v508', Hansgrohe: 'v509', Toto: 'v510', Other: 'v511'
    },
    Showerhead: {
      Delta: 'v529', Moen: 'v532', Kohler: 'v531', Peerless: 'v533', 'American Standard': 'v530', Pfister: 'v534', Waterpik: 'v540', 'Glacier Bay': 'v536',
      Grohe: 'v537', Hansgrohe: 'v538', Speakman: 'v539', 'Aqua Source': 'v535', Symmons: 'v541', Proflo: 'v542', Oxygenics: 'v543', Other: 'v544'
    },
    Toilet: {
      Delta: 'v512', Moen: 'v515', Kohler: 'v514', Peerless: 'v516', 'American Standard': 'v513', Pfister: 'v517', 'Aqua Source': 'v518', 'Glacier Bay': 'v519',
      Briggs: 'v520', Eljer: 'v521', Gerber: 'v522', Jacuzzi: 'v523', Mansfield: 'v524', Sterling: 'v525', Toto: 'v526', Penguin: 'v527', Other: 'v528'
    },
    TubShowerUnit: {
      Delta: 'v546', Moen: 'v549', Kohler: 'v548', Peerless: 'v550', 'American Standard': 'v547', Sterling: 'v551', Aquatic: 'v552',
      Maax: 'v553', ASB: 'v554', Swan: 'v555', 'Aqua Glass': 'v556', Other: 'v557'
    }
  };

  legendsConsideration = {
    Showerhead: {
      v529: 'Delta', v532: 'Moen', v531: 'Kohler', v533: 'Peerless', v530: 'American Standard', v534: 'Pfister', v540: 'Waterpik',
      v535: 'Aqua Source', v536: 'Glacier Bay', v537: 'Grohe', v538: 'Hansgrohe', v539: 'Speakman', v541: 'Symmons',
      v542: 'Proflo', v543: 'Oxygenics', v544: 'Other'
    },
    Faucet: {
      v499: 'Delta', v502: 'Moen', v501: 'Kohler', v503: 'Peerless', v500: 'American Standard', v504: 'Pfister',
      v505: 'Aqua Source', v506: 'Glacier Bay', v507: 'Brizo', v508: 'Grohe', v509: 'Hansgrohe', v510: 'Toto', v511: 'Other'
    },
    Toilet: {
      v512: 'Delta', v515: 'Moen', v514: 'Kohler', v516: 'Peerless', v513: 'American Standard', v517: 'Pfister',
      v518: 'Aqua Source', v519: 'Glacier Bay', v520: 'Briggs', v521: 'Eljer', v522: 'Gerber', v523: 'Jacuzzi',
      v524: 'Mansfield', v525: 'Sterling', v526: 'Toto', v527: 'Penguin', v528: 'Other'
    },
    TubShowerUnit: {
      v546: 'Delta', v549: 'Moen', v548: 'Kohler', v550: 'Peerless', v547: 'American Standard', v551: 'Sterling', v552: 'Aquatic',
      v553: 'Maxx', v554: 'ASB', v555: 'Swanstone', v556: 'Aqua Glass', v557: 'Other'
    },
  };

  EquityOptinMapping = {
    Faucet: {
      'Delta': { option: [1, 2] }, 'Moen': { option: [5, 6] }, 'Kohler': { option: [3, 4] }, 'Peerless': { option: [9, 10] },
      'American Standard': { option: [7, 8] }, 'Pfister': { option: [11, 12] }, 'Waterpik': { option: [] }, 'Glacier Bay': { option: [13, 14] },
      'Aqua Source': { option: [15, 16] }, 'Brizo': { option: [] }, 'Grohe': { option: [] }, 'Hansgrohe': { option: [] }, 'Briggs': { option: [] },
      'Crane': { option: [] }, 'Eljer': { option: [] }, 'Gerber': { option: [] }, 'Jacuzzi': { option: [] }, 'Mansfield': { option: [] },
      'Sterling': { option: [] }, 'Toto': { option: [] }, 'Penguin': { option: [] }, 'Danze': { option: [] }, 'Speakman': { option: [] },
      'Symmons': { option: [] }, 'Aquatic': { option: [] }, 'Maax': { option: [] }, 'ASB': { option: [] }, 'Style Selections': { option: [] },
      'Allen & Roth': { option: [] }, 'Swan': { option: [] }, 'Aqua Glass': { option: [] }, 'Proflo': { option: [] }, 'Duravit': { option: [] },
      'Mirabelle': { option: [] }, 'Villeroy & Boch': { option: [] }, 'Decolav': { option: [] }, 'Rohl': { option: [] },
      'Victoria & Albert': { option: [] }, 'Ronbow': { option: [] }, 'Vortens': { option: [] }, 'Oxygenics': { option: [] }, 'MTI': { option: [] }
    },

    Showerhead: {
      'Delta': { option: [33, 34] }, 'Moen': { option: [39, 40] }, 'Kohler': { option: [37, 38] },
      'Peerless': { option: [45, 46] }, 'American Standard': { option: [35, 36] }, 'Pfister': { option: [47, 48] },
      'Waterpik': { option: [43, 44] }, 'Glacier Bay': { option: [41, 42] },
      'Aqua Source': { option: [49, 50] }, 'Brizo': { option: [] }, 'Grohe': { option: [] }, 'Hansgrohe': { option: [] }, 'Briggs': { option: [] },
      'Crane': { option: [] }, 'Eljer': { option: [] }, 'Gerber': { option: [] }, 'Jacuzzi': { option: [] }, 'Mansfield': { option: [] },
      'Sterling': { option: [] }, 'Toto': { option: [] }, 'Penguin': { option: [] }, 'Danze': { option: [] }, 'Speakman': { option: [] },
      'Symmons': { option: [] }, 'Aquatic': { option: [] }, 'Maax': { option: [] }, 'ASB': { option: [] }, 'Style Selections': { option: [] },
      'Allen & Roth': { option: [] }, 'Swan': { option: [] }, 'Aqua Glass': { option: [] }, 'Proflo': { option: [] }, 'Duravit': { option: [] },
      'Mirabelle': { option: [] }, 'Villeroy & Boch': { option: [] }, 'Decolav': { option: [] }, 'Rohl': { option: [] },
      'Victoria & Albert': { option: [] }, 'Ronbow': { option: [] }, 'Vortens': { option: [] }, 'Oxygenics': { option: [] }, 'MTI': { option: [] }
    },

    Toilet: {
      'Delta': { option: [17, 18] }, 'Moen': { option: [21, 22] }, 'Kohler': { option: [19, 20] }, 'Peerless': { option: [25, 26] },
      'American Standard': { option: [23, 24] }, 'Pfister': { option: [27, 28] }, 'Waterpik': { option: [] }, 'Glacier Bay': { option: [31, 32] },
      'Aqua Source': { option: [29, 30] }, 'Brizo': { option: [] }, 'Grohe': { option: [] }, 'Hansgrohe': { option: [] }, 'Briggs': { option: [] },
      'Crane': { option: [] }, 'Eljer': { option: [] }, 'Gerber': { option: [] }, 'Jacuzzi': { option: [] }, 'Mansfield': { option: [] },
      'Sterling': { option: [] }, 'Toto': { option: [] }, 'Penguin': { option: [] }, 'Danze': { option: [] }, 'Speakman': { option: [] },
      'Symmons': { option: [] }, 'Aquatic': { option: [] }, 'Maax': { option: [] }, 'ASB': { option: [] }, 'Style Selections': { option: [] },
      'Allen & Roth': { option: [] }, 'Swan': { option: [] }, 'Aqua Glass': { option: [] }, 'Proflo': { option: [] }, 'Duravit': { option: [] },
      'Mirabelle': { option: [] }, 'Villeroy & Boch': { option: [] }, 'Decolav': { option: [] }, 'Rohl': { option: [] },
      'Victoria & Albert': { option: [] }, 'Ronbow': { option: [] }, 'Vortens': { option: [] }, 'Oxygenics': { option: [] }, 'MTI': { option: [] }
    },

    TubShowerUnit: {
      'Delta': { option: [51, 52] }, 'Moen': { option: [57, 58] }, 'Kohler': { option: [55, 56] },
      'Peerless': { option: [59, 60] }, 'American Standard': { option: [53, 54] }, 'Pfister': { option: [] }, 'Waterpik': { option: [] },
      'Glacier Bay': { option: [] }, 'Aqua Source': { option: [] }, 'Brizo': { option: [] }, 'Grohe': { option: [] },
      'Hansgrohe': { option: [] }, 'Briggs': { option: [] },
      'Crane': { option: [] }, 'Eljer': { option: [] }, 'Gerber': { option: [] }, 'Jacuzzi': { option: [] }, 'Mansfield': { option: [] },
      'Sterling': { option: [] }, 'Toto': { option: [] }, 'Penguin': { option: [] }, 'Danze': { option: [] }, 'Speakman': { option: [] },
      'Symmons': { option: [] }, 'Aquatic': { option: [] }, 'Maax': { option: [] }, 'ASB': { option: [] }, 'Style Selections': { option: [] },
      'Allen & Roth': { option: [] }, 'Swan': { option: [] }, 'Aqua Glass': { option: [] }, 'Proflo': { option: [] }, 'Duravit': { option: [] },
      'Mirabelle': { option: [] }, 'Villeroy & Boch': { option: [] }, 'Decolav': { option: [] }, 'Rohl': { option: [] },
      'Victoria & Albert': { option: [] }, 'Ronbow': { option: [] }, 'Vortens': { option: [] }, 'Oxygenics': { option: [] }, 'MTI': { option: [] }
    }
  };

  sideBrake: Array<any> = new Array<any>();
  sideBrake1: Array<any> = new Array<any>();
  resultSideBreakOptions: Array<any> = new Array<any>();
  BrandMapping = AssetMappings.brandNameAndCodes;
  categoryBrandHealthTrendsPPTData: Array<any> = new Array<any>();
  constructor() {

  }

  getUnaided(TopBreak, title, codes, category,filter): Chart {
    const config = new Chart({
      SideBreak: [this.UnaidedMappingForCategory[category]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Category Unaided trends', ChartProvider.ECharts);
    config.showSideBreakOptions(0, codes);
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
        textStyle: { fontSize: 11 },
        align: 'center'
      };
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
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
      this.categoryBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getTotalBrand(TopBreak, title, codes, category,filter): Chart {
    const config = new Chart({
      SideBreak: [this.TotalBrandMappingForCategory[category]],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'Category Total Brand', ChartProvider.ECharts);
    config.showSideBreakOptions(0, codes);
    config.includeNotAnswered(true);
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
        textStyle: { fontSize: 11 },
        align: 'center'
      };
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
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
      this.categoryBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getConsiderationFirst(TopBreak, title, codes, category,filter): Chart {
    this.sideBrake = [];
    for (const index of codes) {
      this.sideBrake.push(this.consideration[category][this.BrandMapping[index]]);
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Line
    }, 'Consideration First Choice', ChartProvider.ECharts);
    for (let index = 0; index < codes.length; index++) {
      config.combineSideBreakOptions(this.sideBrake[index], [1, 2], '1st/2nd Choice (net)');
      config.includeNotAnswered(true);
      config.addChartConfigChange((output, chartConfig) => {
        chartConfig.height = '400px';
        chartConfig.width = '600px';
        chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
          textStyle: { fontSize: 11 },
          align: 'center'
        };
        chartConfig.legend.bottom = '2%';
        let counter = 0;
        chartConfig.xAxis.data = [];
        output.forEach((ele, i) => {
          const Score = isNaN(ele.Score) ? 0 : ele.Score;
          const obj = {
            data: [Score],
            name: this.legendsConsideration[category][ele.SeriesVariableID],
            type: 'line'
          };
          if (ele.SeriesName === 'First choice') {
            if (!chartConfig.legend.data.includes(this.legendsConsideration[category][ele.SeriesVariableID])) {
              chartConfig.legend.data.push(this.legendsConsideration[category][ele.SeriesVariableID]);
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        });
        this.categoryBrandHealthTrendsPPTData.push(chartConfig);
        return chartConfig;
      });
    }

    return config;
  }

  getConsiderationSecond(TopBreak, title, codes, category,filter): Chart {
    this.sideBrake = [];
    for (const index of codes) {
      this.sideBrake.push(this.consideration[category][this.BrandMapping[index]]);
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Line
    }, 'Consideration Second Choice', ChartProvider.ECharts);
    for (let index = 0; index < codes.length; index++) {
      config.combineSideBreakOptions(this.sideBrake[index], [1, 2], '1st/2nd Choice (net)');
      config.includeNotAnswered(true);
      config.addChartConfigChange((output, chartConfig) => {
        chartConfig.height = '400px';
        chartConfig.width = '600px';
        chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
          textStyle: { fontSize: 11 },
          align: 'center'
        };
        chartConfig.legend.bottom = '2%';
        let counter = 0;
        chartConfig.xAxis.data = [];
        output.forEach((ele, i) => {
          const Score = isNaN(ele.Score) ? 0 : ele.Score;
          const obj = {
            data: [Score],
            name: this.legendsConsideration[category][ele.SeriesVariableID],
            type: 'line'
          };
          if (ele.SeriesName === 'Second choice') {
            if (!chartConfig.legend.data.includes(this.legendsConsideration[category][ele.SeriesVariableID])) {
              chartConfig.legend.data.push(this.legendsConsideration[category][ele.SeriesVariableID]);
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        });
        this.categoryBrandHealthTrendsPPTData.push(chartConfig);
        return chartConfig;
      });
    }

    return config;
  }

  getConsiderationConsider(TopBreak, title, codes, category,filter): Chart {
    this.sideBrake = [];
    for (const index of codes) {
      this.sideBrake.push(this.consideration[category][this.BrandMapping[index]]);
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Line
    }, 'Consideration Consider', ChartProvider.ECharts);
    for (let index = 0; index < codes.length; index++) {
      config.combineSideBreakOptions(this.sideBrake[index], [1, 2], '1st/2nd Choice (net)');
      config.includeNotAnswered(true);
      config.addChartConfigChange((output, chartConfig) => {
        chartConfig.height = '400px';
        chartConfig.width = '600px';
        chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
          textStyle: { fontSize: 11 },
          align: 'center'
        };
        chartConfig.legend.bottom = '2%';
        let counter = 0;
        chartConfig.xAxis.data = [];
        output.forEach((ele, i) => {
          const Score = isNaN(ele.Score) ? 0 : ele.Score;
          const obj = {
            data: [Score],
            name: this.legendsConsideration[category][ele.SeriesVariableID],
            type: 'line'
          };
          if (ele.SeriesName === 'Consider') {
            if (!chartConfig.legend.data.includes(this.legendsConsideration[category][ele.SeriesVariableID])) {
              chartConfig.legend.data.push(this.legendsConsideration[category][ele.SeriesVariableID]);
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        });
        this.categoryBrandHealthTrendsPPTData.push(chartConfig);
        return chartConfig;
      });
    }

    return config;
  }

  getConsiderationNotConsider(TopBreak, title, codes, category,filter): Chart {
    this.sideBrake = [];
    for (const index of codes) {
      this.sideBrake.push(this.consideration[category][this.BrandMapping[index]]);
    }
    const config = new Chart({
      SideBreak: this.sideBrake,
      TopBreak: [TopBreak],
      Measure: Measure.ColumnPercent,
      Type: ChartTypes.Line
    }, 'Consideration - Not Consider', ChartProvider.ECharts);
    for (let index = 0; index < codes.length; index++) {
      config.combineSideBreakOptions(this.sideBrake[index], [1, 2], '1st/2nd Choice (net)');
      config.includeNotAnswered(true);
      config.addChartConfigChange((output, chartConfig) => {
        chartConfig.height = '400px';
        chartConfig.width = '600px';
        chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
          textStyle: { fontSize: 11 },
          align: 'center'
        };
        chartConfig.legend.bottom = '2%';
        let counter = 0;
        chartConfig.xAxis.data = [];
        output.forEach((ele, i) => {
          const Score = isNaN(ele.Score) ? 0 : ele.Score;
          const obj = {
            data: [Score],
            name: this.legendsConsideration[category][ele.SeriesVariableID],
            type: 'line'
          };
          if (ele.SeriesName === 'Not consider') {
            if (!chartConfig.legend.data.includes(this.legendsConsideration[category][ele.SeriesVariableID])) {
              chartConfig.legend.data.push(this.legendsConsideration[category][ele.SeriesVariableID]);
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])] = obj;
            } else {
              chartConfig.series[chartConfig.legend.data.indexOf(this.legendsConsideration[category][ele.SeriesVariableID])].data.push(Score);
            }
            if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
              chartConfig.xAxis.data[counter] = ele.CategoryName;
              counter++;
            }
          }
        });
        this.categoryBrandHealthTrendsPPTData.push(chartConfig);
        return chartConfig;
      });
    }

    return config;
  }

  getEquityActive(TopBreak, title, codes, category,filter): Chart {
    this.sideBrake1 = [];
    for (const index of codes) {
      this.sideBrake1.push(this.EquityOptinMapping[category][this.BrandMapping[index]].option);
    }
    const config = new Chart({
      SideBreak: ['BrandEquity'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'EquityChart Active', ChartProvider.ECharts);
    config.includeNotAnswered(true);
    for (const iterator of this.sideBrake1) {
      iterator.forEach(e => {
        this.resultSideBreakOptions.push(parseInt(e));
        config.showSideBreakOptions(0, this.resultSideBreakOptions);
      });
    }
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
        textStyle: { fontSize: 11 },
        align: 'center'
      };
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const brandToShow = ele.SeriesName.split(' - ')[2];
        const obj = {
          data: [Score],
          name: brandToShow,
          type: 'line'
        };
        let pre: string;
        if (ele.SeriesName === 'No Answer') {
          pre = ele.SeriesName.slice(0, 9);
        } else {
          pre = ele.SeriesName.slice(0, 6);
        }
        const ab = ele.SeriesName.split(' - ');
        if (pre === 'Active') {
          if (!chartConfig.legend.data.includes(brandToShow)) {
            chartConfig.legend.data.push(brandToShow);
            chartConfig.series[chartConfig.legend.data.indexOf(brandToShow)] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(brandToShow)].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.categoryBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }

  getEquityLatent(TopBreak, title, codes, category,filter): Chart {
    this.sideBrake1 = [];
    for (const index of codes) {
      this.sideBrake1.push(this.EquityOptinMapping[category][this.BrandMapping[index]].option);
    }
    const config = new Chart({
      SideBreak: ['BrandEquity'],
      TopBreak: [TopBreak],
      Type: ChartTypes.Line,
      Measure: Measure.ColumnPercent
    }, 'EquityChart Latent', ChartProvider.ECharts);
    config.includeNotAnswered(true);
    for (const iterator of this.sideBrake1) {
      iterator.forEach(e => {
        this.resultSideBreakOptions.push(parseInt(e));
        config.showSideBreakOptions(0, this.resultSideBreakOptions);
      });
    }
    config.addChartConfigChange((output, chartConfig) => {
      chartConfig.height = '400px';
      chartConfig.width = '600px';
      chartConfig.title.text = title + ' (' + TopBreak + ')'+ '$' +filter;
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
        textStyle: { fontSize: 11 },
        align: 'center'
      };
      chartConfig.legend.bottom = '2%';
      let counter = 0;
      chartConfig.xAxis.data = [];
      output.forEach((ele, i) => {
        const Score = isNaN(ele.Score) ? 0 : ele.Score;
        const brandToShow = ele.SeriesName.split(' - ')[2];
        const obj = {
          data: [Score],
          name: brandToShow,
          type: 'line'
        };
        let pre: string;
        if (ele.SeriesName === 'No Answer') {
          pre = ele.SeriesName.slice(0, 9);
        } else {
          pre = ele.SeriesName.slice(0, 6);
        }
        const ab = ele.SeriesName.split(' - ');
        if (pre === 'Latent') {
          if (!chartConfig.legend.data.includes(brandToShow)) {
            chartConfig.legend.data.push(brandToShow);
            chartConfig.series[chartConfig.legend.data.indexOf(brandToShow)] = obj;
          } else {
            chartConfig.series[chartConfig.legend.data.indexOf(brandToShow)].data.push(Score);
          }
          if (chartConfig.xAxis.data.indexOf(ele.CategoryName) <= -1) {
            chartConfig.xAxis.data[counter] = ele.CategoryName;
            counter++;
          }
        }
      });
      this.categoryBrandHealthTrendsPPTData.push(chartConfig);
      return chartConfig;
    });
    return config;
  }
}
