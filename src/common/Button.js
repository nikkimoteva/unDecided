import "./Button.css";
import React from "react";
import Button from '@material-ui/core/Button';
import {Link} from "react-router-dom";

export default function Buttons(props) {

    let data = props.data;
    let route = "./" + data.route;
    let style = {
        fontWeight: "bolder",
        marginLeft: "10em",
        marginRight: "10em",
        width: "15em",
        height: "5em",
        color: "#2EFFFF",
    }

    return (
        <div>
            <Button style={style} component={Link}
                to={route} variant="contained" color="primary" href="#outlined-buttons"
            >
                    {data.name}
            </Button>
        </div>
    );
}
