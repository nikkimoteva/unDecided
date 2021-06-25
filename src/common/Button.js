import "./Button.css";
import React from "react";
import ButtonUI from '@material-ui/core/Button';
import {Link} from "react-router-dom";


export default function Button(props) {
    let data = props.data;
    let route = "./" + data.route;
    let style = {
        fontWeight: "bolder",
        marginLeft: "10em",
        marginRight: "10em",
        width: "15em",
        height: "5em",
    }

    return (
        <div>
            <ButtonUI style={style} component={Link}
                    to={route} variant="outlined" color="primary" href="#outlined-buttons">
                        {data.name}
            </ButtonUI>
        </div>
    );
}
