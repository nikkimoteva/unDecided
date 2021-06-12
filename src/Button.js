import "./Button.css";
import React from "react";
import ButtonUI from '@material-ui/core/Button';


class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        let data = this.props.data;
        let style = {
            "font-weight": "bolder",
            "margin-left": "10em",
            "margin-right": "10em",
            "width": "15em",
            "height": "5em",
        }

        return (
            <div>
                <ButtonUI style={style} 
                        to={data.route} variant="outlined" color="primary" href="#outlined-buttons">
                            {data.name}
                </ButtonUI>
            </div>
        );
    }

}

export default Button;
