## https://ensemble-automl.herokuapp.com
# ENSEMBLE AUTOML 

#### Application Description

This project implements the user interface and backend logic for the new Ensemble-Squared AutoML system, developed by UBC researchers. This React application allows users to register and log in to their accounts, and keep track of the jobs that are being run on their system. With accessibility and ease of use in mind, this application aims to simplify the process of machine learning for all users, be they individuals or institutions.


#### Who is it for?

The AutoML team at UBC. Users will be both individuals and businesses who rely on having very little ML expertise to be able to perform ML operations.


#### What will it do?

Takes data as input and visualize/process the data as output. Allows users to view jobs that have completed or are in progress.

 
#### What type of data will it store?

CSV datasets.


#### What will users be able to do with this data?
- Visualize data (Just a table)
- Run a job on the Ensemble-Squared backend
- See a job and its progress
- View the previously uploaded data

<hr/>

### Goals and completed tasks

 - [x] **: completed task**
 - [ ] **: uncompleted task**

#### 3-5 minimal requirements (will definitely complete)
- [x] Opening page (UI, responsive)
- [x] Header menu
- [x] Input CSV, connect and submit to ensemble-squared backend, and retrieve and display results to user
- [x] Job tracking implemented in backend
- [x] Login

#### 3-7 "standard" requirements (will most likely complete)
- [x] Profile page
- [x] History/job status tracking
- [x] Table visualization for the submitted data
- [x] View previously uploaded data (depending on accounts, can be per browser session or per user)
- [x] Job tracking visualization/progress

#### 2-3 stretch requirements
- [x] Multiple OAuth providers
- [ ] Take as input other types of data
- [x] Integrate other storage solutions into app (e.g. S3, kaggle, etc)
- [x] Job notification

#### Break down of 2 minimal requirements into ~2-5 smaller tasks
- Opening page
  - Create a page for the landing page of the website
  - Compare our software to other AutoML solutions, and link to it from home page
  - Add a Get Started page and link to it from home page

- Accounts
  - Structure data in database to store account information
  - Create Sign up and Log in pages
  - Create Job Tracking page (Not part of this requirement, but it is related)
  - Create Account information and settings page

#### 2-3 rough sketch prototypes of some key tasks of the app

Please see Image1 and Image2.


#### Some additional functionality we can add/remove based on time constraints
- Tutorial page to demo the use of the application
- Fancy data visualization
- Other types of data such as JSON and XML, as well as ML vision models(images), NLP (Text), Time series data.

<hr/>

### Technologies used in this project
- **HTML/CSS+JS:** In our project, we used JSX, JS front, and CSS for a lot of the stylings. We also used Material UI for styling and making our project more user friendly.
- **React:** The project uses React, and we are using JSX to render to our frontend. We started our project using the create-react-app boilerplate code. We are also using many hooks throughout the project.
- **Node and Express:** We are using Node to connect to our React frontend, and communicating (sending and receiving) data from out MongoDB database to display on our frontend. There are many examples of get/update/delete in server/server.js.
- **MongoDB:** We are using MongoDB and the mongoose library to store users, jobs, and predictions information in our database so that we could retrieve them and showcase them to the user.
- **Deployment:** We have deployed our project on Heroku. All the functionalities are present on the deployed application. We also have enabled automatic deployment so that any push to the main branch of our project would get deployed to our website on Heroku.

<hr/>

### Above and beyond functionalities
- **Securing users’ data:** Since this project is used as an application for the blackboxML backend, we understood how critical the user’s information is, as a leak in our database will potentially leak data from corporations. Our team did a lot of research on how to store a user’s information in the database so that it is secure and a breach of the database would not release a user’s secret keys and password. We have integrated Google Auth Login so that users have the option to directly use their gmail account to login to our system without needing to sign up and come up with a password. We have also included a second option for the user to create an account on our system. We are using the ‘bcrypt’ library which has won awards for their hashing and salting functions to hash and salt a user’s password. Furthermore, we are using the ‘crypto-js’ library, which is the best encryptor based on our research, to encrypt and later decrypt a user’s secret keys when they are trying to get files from AWS S3. All these work is done to ensure that if there is a data breach with MongoDB, the attacker would not be able to access a user’s password and use their account to retrieve datasets from their accounts, access the user’s AWS S3 data, or use their accounts for their own training and prediction. Moreover, the attacker will not be able to access a user’s AWS S3 secret key and access the third party account that we have integrated into our project.
- **AWS S3:** Even though integrating third party applications was not a requirement, after talking with Dr. Frank Wood and his team who worked on the AutoML backend, our team reached the decision to integrate AWS S3 into our project in order to make accessing data from AWS easier for the user. We chose AWS S3 because our research showed that many clients for AutoML engines use Amazon Web Services to store their data. Integrating S3 has resulted in users no longer having to open their account on another tab, download their data into their local computer, and upload their data into our system. Instead, users can directly choose “Import from AWS S3” and select the dataset that they would want to upload. We are also giving the choice for the user to choose the region their data resides on. Moreover, we are also storing a user’s access and secret key in our database (with a choice of editing their keys) after they enter it in their profile page. This way, the user does not have to remember their keys every time they want to access their S3 account. We are using “aws-sdk” library to send the user’s information to Amazon, and retrieve their datasets and ‘buckets’ to display on the AWS modal on our frontend. Furthermore, we understand that connecting to S3 and retrieving secret keys may not be easy for someone who has never done so before; therefore, we have included resources in our documentation.

<hr/>

### Next Steps
- **Support of other data types:**  Due to time restriction, we were unable to work on this stretch goal, which is supporting other data types such as images, text, and NLP files, which would increase the usability of our product. Supporting other data types would get integrated into our submit jobs/predictions page.
- **Premium account:** Since using machine learning engines requires a lot of resources and could be expensive in the long run, there can be an option for a premium account in which the client would need to pay for longer training times, so that the cost of the training won’t be all on BlackboxML. We will add that to the account plan, and store a client's credit card information for use.
- **Integration of other web services:** During our research and work on AWS S3, we were able to see first hand how much more convenient it is for a client to use our website to directly upload their files from S3, rather than the users having to open their account on another tab, download their data into their local computer, and upload their data into our system. In the next steps, we are looking into integrating more web services, such as Google and Microsoft Azure, to increase the ease of using our product. 

<hr/>

### List of contributions
- **Nikki Moteva**: She worked on the landing page, the contact us page, the personal email login and securely storing the user's information in the database by hashing and salting passwords, the profile page and securely storing the user's AWS secret key in the database, deploying the app, setting up endpoints, and many bug fixes. She also did research on security requirements for storing the user’s data, and re-structured the authentication structure of the project. Lastly, she lead the team and the meetings in order to meet the required goals of the group.
- **Kian Shahangyan**: He implemented the backend of the website from the ground-up by creating, and then restructuring routes in the Express router, as well as connecting to the MongoDB database and setting up Mongoose models. In addition, he fully integrated (both backend and frontend) AWS S3 so that users can access data from their buckets, as well as integrating Google OAuth login, which required developing the architecture for credential authentication and client-side storage. Finally, he established the connection between our backend server and the borg server, helped resolve bugs, developed the deployment process, created job submission forms, and  participated in a leadership role.
- **Robert Mo**: He worked on the job page, the docs page, the job submission form, and the prediction submission form. He setup the endpoint in the backend for the mentioned pages. He also worked on continuous polling to keep the progress of the job up to date.
- **Harry Xu**: He researched and had discussions with the BlockboxML team on ways to connect to the Ensemble Squared backend which is hosted by the ubc server. Moreover, he worked on rewriting the existing prediction/training job submission which was written in python into javascript, and retrieving and parsing the data that comes from the server. Lastly, he worked on early template of the UI for jobs/demo page (discontinued).

<hr/>

### Development instructions

1. Install NPM and Yarn:
  - Install NPM version 7.17 and Yarn version 2.4
2. Run `yarn install`
3. Run `yarn start`

<hr/>

#### Notes
- Requirements modified July 5, 2021 - Added new requirements after discussion with AutoML team and modified existing requirements due to changes in design.
- ReadMe modified August 10, 2021 - Added project write up and more information on the project per the project's rubric.

