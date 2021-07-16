// const useStyles = makeStyles((theme) => ({
//   root: {
//     '& > *': {
//       margin: theme.spacing(1),
//     },

//     '& .MuiTextField-root': {
//       margin: theme.spacing(1),
//       width: '25ch',
//     },
//   },
// }));

// export default function ContactUs() {
//   const classes = useStyles();

//   const state = {
//     input: {},
//     errors: {}
//   };
  
//   const onSubmit = (e) => {
//     e.preventDefault();

//     if(validate()){
//       console.log(this.state);
//       send(
//         contactus_service_id,
//         contactus_template_id,
//         toSend,
//         contactus_user
//       )
//         .then((response) => {
//           console.log("SUCCESS!", response.status, response.text);
//           // setToSend({
//           //   from_name: "",
//           //   subject: "",
//           //   message: "",
//           //   email: "",
//           // });
//           alert("Your enquiry has been sent!");
//         })
//         .catch((err) => {
//           console.log("FAILED...", err);
//         });
//       }
//   };


//   // const handleChange = (e) => {
//   //   // setToSend({ ...toSend, [e.target.name]: e.target.value });
//   // };

//   handleChange = (event) => {
//     let input = state.input;
//     input[event.target.name] = event.target.value;
  
//     setState({
//       input
//     });
//   }
    

//   const  validate = () => {
//     let input = this.state.input;
//     let errors = {};
//     let isValid = true;

//     if (!input["name"]) {
//       isValid = false;
//       errors["name"] = "Please enter your name.";
//     }

//     if (!input["email"]) {
//       isValid = false;
//       errors["email"] = "Please enter your email Address.";
//     }

//     if (typeof input["email"] !== "undefined") {
//       var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
//       if (!pattern.test(input["email"])) {
//         isValid = false;
//         errors["email"] = "Please enter a valid email address.";
//       }
//     }

//     if (!input["message"]) {
//       isValid = false;
//       errors["message"] = "Please enter your message.";
//     }

//     this.setState({
//       errors: errors
//     });

//     return isValid;
//   }

//   return (
//     <div style={{paddingTop: "3vh", paddingBottom: "3vh", textAlign: "center"}}>
//     <h1><u>Contact Us</u></h1>
//     <p>We are looking forward to read your email! <br/> 
//       Please fill out the form below, and our team will get back to you in 1-3 business days.</p>
//     <form onSubmit={onSubmit} className={classes.root} noValidate>
//       <TextField name="from_name" 
//       // value={toSend.from_name} 
//       value={this.state.input.name}
//       onChange={handleChange}
//             type="text"
//             id="standard-textarea"
//             label="Name"
//             variant="filled" 
//             placeholder="Please enter your name"
//             required
//       />
//       <div className="text-danger">{this.state.errors.name}</div>
//       <br/>
//       <TextField TextMode="Email" name="email"
//             pattern="[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*"
//             // value={toSend.email} 
//             value={this.state.input.email}
//             onChange={handleChange}
//             type="email"
//             id="standard-textarea"
//             label="Email"
//             variant="filled" 
//             placeholder="Please enter your Email"
//             required
//       />
//       <br/>
//       <TextField name="subject" 
//       // value={toSend.subject} 
//         onChange={handleChange}
//         value={this.state.input.subject}
//             type="text"
//             id="standard-textarea"
//             label="Subject"
//             variant="filled" 
//             placeholder="Subject"
//       />
//       <br/>
//       <TextField style={{width: "40vw"}} name="message" 
//             // value={toSend.message} 
//             value={this.state.input.message}
//             onChange={handleChange}
//             type="text"
//             id="filled-textarea"
//             label="Message"
//             placeholder="Your message"
//             multiline
//             rows={7}
//             variant="filled"
//             required
//       />
      // <br/>
//       <Button className="CutomSubmitContact" type="submit" value="submit" variant="contained" color="primary">
//         Submit
//       </Button>
//     </form>
//     </div>
//   );
// }









/* class DemoForm extends React.Component {
  constructor() {
    super();
    this.state = {
      input: {},
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const input = {};
    input[event.target.name] = event.target.value;

    this.setState({
      input
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validate()) {
      console.log(this.state);

      const input = {};
      input["name"] = "";
      input["email"] = "";
      input["message"] = "";
      this.setState({ input: input });

      alert("Demo Form is submited");
    }
  }

  validate() {
    const input = this.state.input;
    const errors = {};
    let isValid = true;

    if (!input["name"]) {
      isValid = false;
      errors["name"] = "Please enter your name.";
    }

    if (!input["email"]) {
      isValid = false;
      errors["email"] = "Please enter your email address.";
    }

    if (typeof input["email"] !== "undefined") {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(input["email"])) {
        isValid = false;
        errors["email"] = "Please enter a valid email address.";
      }
    }

    if (!input["message"]) {
      isValid = false;
      errors["message"] = "Please enter your message.";
    }

    this.setState({
      errors: errors
    });

    return isValid;
  }

  render() {
    return (
      <div
        style={{ paddingTop: "3vh", paddingBottom: "3vh", textAlign: "center" }}
      >
        <h1>
          <u>Contact Us</u>
        </h1>
        <p>
          We are looking forward to read your email! <br />
          Please fill out the form below, and our team will get back to you in
          1-3 business days.
        </p>
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="form-group">
            <TextField
              type="text"
              name="name"
              value={this.state.input.name}
              onChange={this.handleChange}
              label="Name"
              variant="filled"
              placeholder="Please enter your name"
            />

            <div className="text-danger">{this.state.errors.name}</div>
          </div>
          <br />

          <div className="form-group">
            <TextField
              type="text"
              name="email"
              value={this.state.input.email}
              onChange={this.handleChange}
              label="Email"
              variant="filled"
              placeholder="Please enter your Email"
            />

            <div className="text-danger">{this.state.errors.email}</div>
          </div>
          <br />

          <div className="form-group">
            <TextField
              name="subject"
              value={this.state.input.subject}
              onChange={this.handleChange}
              placeholder="Enter subject"
              type="text"
              label="Subject"
              variant="filled"
            />

            <div className="text-danger">{this.state.errors.subject}</div>
          </div>
          <br />

          <div className="form-group">
            <TextField
              style={{ width: "40vw" }}
              name="message"
              value={this.state.input.message}
              onChange={this.handleChange}
              placeholder="Enter message"
              type="text"
              label="Message"
              multiline
              rows={7}
              variant="filled"
            />

            <div className="text-danger">{this.state.errors.message}</div>
          </div>
          <br />

          <Button
            className="CutomSubmitContact"
            type="submit"
            value="submit"
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </form>
      </div>
    );
  }
} 


export default DemoForm;
*/