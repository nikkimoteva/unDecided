import "../common/Button.css";
import React from "react";
import ButtonUI from '@material-ui/core/Button';
import ChooseGraph from "./ChooseGraph"

function hiddenDev(props) {
    let data = props.data;
    if (document.getElementById("default") !== null) {
        console.log(1)
        document.getElementById("default").style.display = 'none';
    }
    if (document.getElementById("accuracy") !== null) {
        document.getElementById("accuracy").style.display = 'none';
    }
    if (document.getElementById("rank") !== null) {
        document.getElementById("rank").style.display = 'none';
    }
    if (document.getElementById("first") !== null) {
        document.getElementById("first").style.display = 'none';
    }
    return (<div id="default"> <ChooseGraph data={data}/></div>)

}


export default function Button(props) {
    let data = props.data;
    let style = {
        "fontWeight": "bolder",
        "marginLeft": "10em",
        "marginRight": "10em",
        "width": "15em",
        "height": "5em",
    }

    return (
        <div>
            <ButtonUI style={style} onClick={()=>{hiddenDev({data: data});}} variant="outlined" color="primary" href="#outlined-buttons">
                        {data}
            </ButtonUI>
        </div>
    );
}