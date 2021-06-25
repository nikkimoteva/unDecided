import * as React from 'react';
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
  { d: "Ensemble2 Voting", First: 16, Rank: 2.963, Accuracy: 0.844 },
  { d: "Ensemble2 Stacking", First: 13, Rank: 3.598, Accuracy: 0.84 },
];

let style = {
  "text-align": "center",
  "color":"white"
}

const tooltipContentBodyStyle = {
  paddingTop: 0,
};
const formatTooltip = d3Format.format(',.2r');
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

// export default function Demo() {
//   const [state, setState] = useState({
//     hover: null,
//     tooltipTarget: null,
//     tooltipEnabled: true,
// });
// }

class Demo extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hover: null,
      tooltipTarget: null,
      tooltipEnabled: true,
    };

    this.changeHover = hover => this.setState({ hover });
    this.changeTooltip = targetItem => this.setState({ tooltipTarget: targetItem });

  }

  render() {
    const {
      hover, tooltipTarget, tooltipEnabled,
    } = this.state;
    // const { classes } = this.props;

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
          <EventTracker onClick={this.click} />
          <HoverState hover={hover} onHoverChange={this.changeHover} />
          <Tooltip
            targetItem={tooltipEnabled && tooltipTarget}
            onTargetItemChange={this.changeTooltip}
            contentComponent={TooltipContent}
          />
          <Animation />
        </Chart>
        <h4 style={style}>The number of first places in the majority voting scheme.</h4>
        <h4 style={style}>The higher the number, the better the engine's data processing and prediction.</h4>
        <br></br>
      </div>
      </Paper>
    );
  }
}

export default (Demo);
// export default withStyles(styles)(Demo);
