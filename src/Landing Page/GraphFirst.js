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
  ArgumentScale, Stack, Animation, EventTracker, HoverState,
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
  textAlign: "center"
};

const tooltipContentBodyStyle = {
  paddingTop: 0,
};
const formatTooltip = d3Format.format(',.1r');
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

export default function GraphFirst() {
  const [state, setStateFirst] = useState(
    {hover: null,
    tooltipTarget: null,
    tooltipEnabled: true,}
    );

  const changeHoverFirst = (data) => {
    setStateFirst({
      hover : data,
      tooltipTarget : state.tooltipTarget,
      tooltipEnabled: state.tooltipEnabled});
  };

  const changeTooltipFirst = (data) => {
    setStateFirst({
      hover : state.hover,
      tooltipTarget : data,
      tooltipEnabled: state.tooltipEnabled});
  };

  const myHoverChangeFirst = changeHoverFirst.bind(this);
  const myToolTipChangeFirst = changeTooltipFirst.bind(this);

    return (
      <Paper>
      <div className="First" id="first">
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
            name="First"
            valueField="First"
            argumentField="d"
            color="#8282D7"
          />
          <Stack />
          <Legend position="bottom" rootComponent={Root} labelComponent={Label} />
          <EventTracker/>
          <HoverState hover={state.hover} onHoverChange={myHoverChangeFirst} />
          <Tooltip
            targetItem={state.tooltipEnabled && state.tooltipTarget}
            onTargetItemChange={myToolTipChangeFirst}
            contentComponent={TooltipContent}
          />
          <Animation />
        </Chart>
        <h4 style={style}>The number of first places in the majority voting scheme.</h4>
        <h4 style={style}>The higher the number, the better the engine's data processing and prediction.</h4>
        <br/>
      </div>
      </Paper>
    );

}
