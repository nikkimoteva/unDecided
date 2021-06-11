import React from 'react';

import {TextField} from "@material-ui/core"
import Input from '@material-ui/core/Input';
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

	
	
	render(){

		const TextFieldMargin = 4;
	    const { classes } = this.props;

		return(

			<div className={classes.root}>
				<form  noValidate autoComplete="on">
				<div align="left">
				  	<TextField id="firstName" 
				  			 label="First Name" 
				  			 variant="outlined" 
				  			 style={{ margin: TextFieldMargin }} 
							 className={classes.shortField}
					/>
				  	<TextField id="lastName" 
				  			 label="Last Name" 
				  			 variant="outlined" 
				  			 style={{ margin: TextFieldMargin }}
							 className={classes.shortField}
				  	/>
		  		</div >
		  		<div align="left">
		  			<TextField id="email" 
		  					   label="Email" 
		  					   variant="outlined" 
		  					   style={{ margin: TextFieldMargin }}
		  					   className={classes.longField}

		  			/>
		  		</div>
		  		<div align="left">
					<TextField id="password" 
							   label="Password" 
							   variant="outlined" 
							   style={{ margin: TextFieldMargin }}
							 className={classes.shortField}
					/>
					<TextField id="confirm" 
							   label="Confirm" 
							   variant="outlined" 
							   style={{ margin: TextFieldMargin }}
							   className={classes.shortField}
					/>
				</div>

				</form>

			</div>
		)
	}
}

export default withStyles(useStyles)(SignUp);