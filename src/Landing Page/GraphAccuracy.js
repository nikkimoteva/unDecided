import {useState} from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  ArgumentAxis,
  ValueAxis,
  Title,
  Legend,
  Tooltip,
} from '@devexpress/dx-react-chart-material-ui';
import * as d3Format from 'd3-format';
import { scaleBand } from '@devexpress/dx-chart-core';
import {
  ArgumentScale, Stack, Animation, EventTracker, HoverState,ValueScale
} from '@devexpress/dx-react-chart';
import { withStyles } from '@material-ui/core/styles';

const data= [
  { d: "AutoGluon", First: 19, Rank: 3.085, Accuracy: 0.84 },
  { d: "Auto Sklearn", First: 13, Rank: 3.585, Accuracy: 0.826 },
  { d: "Auto Sklearn 2", First: 13, Rank: 3.634, Accuracy: 0.831 },
  { d: "CMU AutoM", First: 4, Rank: 5.707, Accuracy: 0.807 },
  { d: "H2O AutoML", First: 4, Rank: 5.427, Accuracy: 0.797 },
  { d: "Ensemble2", First: 16, Rank: 2.963, Accuracy: 0.844 },
];

let style = {
  "text-align": "center"
}

const tooltipContentBodyStyle = {
  paddingTop: 0,
};
const formatTooltip = d3Format.format(',.3r');
const TooltipContent = (props) => {
  const { targetItem, text, ...restProps } = props;
  return (
    <div>
      <div>
        <Tooltip.Content
          {...restProps}
          style={tooltipContentBodyStyle}
          text={formatTooltip(data[targetItem.point][targetItem.series])}
        />
      </div>
    </div>
  );
};
const Root = withStyles({
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
})(({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
));
const Label = withStyles({
  label: {
    whiteSpace: 'nowrap',
  },
})(({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
));

const TitleText = withStyles({ title: { marginBottom: '30px' } })(({ classes, ...restProps }) => (
  <Title.Text {...restProps} className={classes.title} />
));

const pc = {startVal : "0.5"}

export default function GraphAccuracy() {
  const [state, setStateAccuracy] = useState(
    {hover: null,
    tooltipTarget: null,
    tooltipEnabled: true,}
    )

  const changeHoverAccuracy = (data) => {
    setStateAccuracy({
      hover : data,
      tooltipTarget : state.tooltipTarget,
      tooltipEnabled: state.tooltipEnabled});
  }

  const changeTooltipAccuracy = (data) => {
    setStateAccuracy({
      hover : state.hover,
      tooltipTarget : data,
      tooltipEnabled: state.tooltipEnabled});
  }
  const myHoverChangeAccuracy = changeHoverAccuracy.bind(this);
  const myToolTipChangeAccuracy = changeTooltipAccuracy.bind(this);
  const modifyDomain = domain => [domain[0],0.9];


    return (
      <Paper>
        <div className="Accuracy" id="accuracy" style={{display:"block"}}>
        <Chart
          data={data}
        >
          <ArgumentScale factory={scaleBand} />
          <ValueScale modifyDomain={modifyDomain} />
          <ArgumentAxis />
          <ValueAxis />

          <Title
            text="Comparison of the Accuracies"
            textComponent={TitleText}
          />
          <BarSeries
            name="Accuracy"
            valueField="Accuracy"
            argumentField="d"
            color="#0F6464"
          />
          <Stack />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          <EventTracker/>
          <HoverState hover={state.hover} onHoverChange={myHoverChangeAccuracy} />
          <Tooltip
            targetItem={state.tooltipEnabled && state.tooltipTarget}
            onTargetItemChange={myToolTipChangeAccuracy}
            contentComponent={TooltipContent}
          />
          <Animation />
        </Chart>
        <h4 style={style}>The average accuracy from running 40 datasets for 1 hour.</h4>
        <h4 style={style}>The higher the average, the more accurate the prediction has been.</h4>
        <br></br>
      </div>
      {/* <div className="Rank" id="hidden_div2">
        <Chart
          data={data}
        >
          <ArgumentScale factory={scaleBand} />
          <ArgumentAxis />
          <ValueAxis />

          <Title
            text="Comparison of the Ranks"
            textComponent={TitleText}
          />
          <BarSeries
            name="rank"
            valueField="rank"
            argumentField="d"
          />
          <Stack />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          <EventTracker onClick={this.click} />
          <HoverState hover={hover} onHoverChange={this.changeHover} />
          <Tooltip
            targetItem={tooltipEnabled && tooltipTarget}
            onTargetItemChange={this.changeTooltip}
            contentComponent={TooltipContent}
          />
          <Animation />
        </Chart>
      </div>
      <div className="First" id="hidden_div3">
        <Chart
          data={data}
        >
          <ArgumentScale factory={scaleBand} />
          <ArgumentAxis />
          <ValueAxis />

          <Title
            text="Comparison of Number First Place"
            textComponent={TitleText}
          />
          <BarSeries
            name="first"
            valueField="first"
            argumentField="d"
          />
          <Stack />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          <EventTracker onClick={this.click} />
          <HoverState hover={hover} onHoverChange={this.changeHover} />
          <Tooltip
            targetItem={tooltipEnabled && tooltipTarget}
            onTargetItemChange={this.changeTooltip}
            contentComponent={TooltipContent}
          />
          <Animation />
        </Chart>
      </div> */}
      </Paper>
    );
  
}


// const datas = [
//   {
//     dataset: "AutoGluon",
//     AutoGluon: "AutoGluon",
//     accuracy: 0.84,
//     rank: 3.085,
//     first: 19
//   },
//   {
//     dataset: "Auto-Sklearn",
//     accuracy: 0.826,
//     rank: 3.585,
//     first: 13
//   },
//   {
//     dataset: "Auto-Sklearn 2.0",
//     accuracy: 0.831,
//     rank: 3.634,
//     first: 13
//   },
//   {
//     dataset: "CMU AutoML",
//     accuracy: 0.807,
//     rank: 5.707,
//     first: 4
//   },
//   {
//     dataset: "H2O AutoML",
//     accuracy: 0.797,
//     rank: 5.427,
//     first: 4
//   },
//   {
//     dataset: "Ensemble2 Voting",
//     Ensemble2V: "Ensemble2V",
//     accuracy: 0.844,
//     rank: 2.963,
//     first: 16
//   },
//   {
//     dataset: "Ensemble2 Stacking",
//     Ensemble2S: "Ensemble2S",
//     accuracy: 0.84,
//     rank: 3.598,
//     first: 13
//   }
// ];

// const datasl = [
//   {
//     dataset: "Accuracy",
//     accuracy_AutoGluon: 0.84,
//     accuracy_Auto_Sklearn: 0.826,
//     accuracy_Auto_Sklearn_2: 0.831,
//     accuracy_CMU_AutoM: 0.807,
//     accuracy_H2O_AutoML: 0.797,
//     accuracy_Ensemble2_Voting: 0.844,
//     accuracy_Ensemble2_Stacking: 0.84
//   },
//   {
//     dataset: "Rank",
//     rank_AutoGluon: 3.085,
//     rank_Auto_Sklearn: 3.585,
//     rank_Auto_Sklearn_2: 3.634,
//     rank_CMU_AutoML: 5.707,
//     rank_H2O_AutoML: 5.427,
//     rank_Ensemble2_Voting: 2.963,
//     rank_Ensemble2_Stacking: 3.598
//   },
//   {
//     dataset: "First",
//     first_AutoGluon: 19,
//     first_Auto_Sklearn: 13,
//     first_Auto_Sklearn_2: 13,
//     first_CMU_AutoML: 4,
//     first_H2O_AutoML: 4,
//     first_Ensemble2_Voting: 16,
//     first_Ensemble2_Stacking: 13
//   }
// ];

// const styles = theme => ({
//   primaryButton: {
//     margin: theme.spacing(1),
//     width: '120px',
//   },
//   secondaryButton: {
//     margin: theme.spacing(1),
//     width: '170px',
//   },
//   leftIcon: {
//     marginRight: theme.spacing(1),
//     marginBottom: '1px',
//   },
//   rightIcon: {
//     marginLeft: theme.spacing(1),
//     marginBottom: '1px',
//   },
//   text: {
//     display: 'flex',
//     flexDirection: 'row',
//   },
//   group: {
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   hoverGroup: {
//     width: '300px',
//   },
//   name: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//   },
// });



// export default (GraphAccuracy);
// export default withStyles(styles)(GraphAccuracy);
