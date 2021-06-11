import React from 'react';

import {TextField} from "@material-ui/core"
import {Button} from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';



const useStyles = makeStyles((theme) => ({
		  root: {
		    display: 'flex',
		    flexWrap: 'wrap',
		    marginLeft: theme.spacing(1),

		  },
		  shortField: {
		    marginLeft: theme.spacing(1),
		    marginRight: theme.spacing(1),
		  },
		  longField: {
		    marginLeft: theme.spacing(1),
		    marginRight: theme.spacing(1),
		  },
		}));

class SignUp extends React.Component{


	constructor(props) {
	    super(props);
	    this.state = { firstName: '', lastName: '', email : "", password:"", users:[]};
	}

	submitHandler = (event) =>{
	    event.preventDefault();
	    let temp = this.state.users
	    temp.push({firstName:this.state.firstName,
	    		   lastName:this.state.lastName,
	    		   email:this.state.email,
	    		   password:this.state.password,})
		this.setState({users: temp});
		console.log(this.state.users)
	}

	TextFieldOnChange = (event) =>{
		let nam = event.target.name;
	    let val = event.target.value;
	    this.setState({[nam]: val});
	}

	render(){

		const TextFieldMargin = 4;
	    const { classes } = this.props;

		return(

			<div className={classes.root}>
				<form  noValidate autoComplete="on">
				<div>
				  	<TextField name="firstName" 
				  			 label="First Name" 
				  			 variant="outlined" 
				  			 style={{ margin: TextFieldMargin }} 
							 className={classes.shortField}
							 onChange={this.TextFieldOnChange}
					/>
				  	<TextField name="lastName" 
				  			 label="Last Name" 
				  			 variant="outlined" 
				  			 style={{ margin: TextFieldMargin }}
							 className={classes.shortField}
							 onChange={this.TextFieldOnChange}
				  	/>
		  		</div >
		  		<div>
		  			<TextField name="email" 
		  					   label="Email" 
		  					   variant="outlined" 
		  					   style={{ margin: TextFieldMargin }}
		  					   className={classes.longField}
		  					   onChange={this.TextFieldOnChange}

		  			/>
		  		</div>
		  		<div >
					<TextField name="password" 
							   label="Password" 
							   variant="outlined" 
							   style={{ margin: TextFieldMargin }}
							 className={classes.shortField}
							 onChange={this.TextFieldOnChange}
					/>
					<TextField name="confirm" 
							   label="Confirm" 
							   variant="outlined" 
							   style={{ margin: TextFieldMargin }}
							   className={classes.shortField}
					/>
				</div>
				<Button type="submit" 
						variant="outlined" 
						color="primary" 
						className={classes.button} 
						onClick={this.submitHandler}>
			     		Sign Up!
			    </Button>
				</form>

			</div>
		)
	}
}

export default withStyles(useStyles)(SignUp);