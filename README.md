**Who is it for?**

The AutoML team at UBC. Users will be both individuals and businesses who rely on having very little ML expertise to be able to perform ML operations.


**What will it do? (What "human activity" will it support?)**

Takes data as input and visualize/process the data as output. Allows users to view jobs that have completed or are in progress
 
 
**What type of data will it store?**

CSV 


**What will users be able to do with this data?**

- Visualize data (Just a table)

- Run a job on the Ensemble-Squared backend

- See a job and its progress

- View the previously uploaded data


**What is some additional functionality you can add/remove based on time constraints?**

- Tutorial page to demo the use of the application

- Fancy data visualization

- Other types of data such as JSON and XML, as well as ML vision models(images), NLP (Text), Time series data.


**3-5 minimal requirements (will definitely complete)**

- Opening page (UI, responsive)

- Header menu

- Input CSV, connect and submit to ensemble-squared backend, and retrieve and display results to user

- Job tracking implemented in backend

- Login

**3-7 "standard" requirements (will most likely complete)**

- Profile page

- History/job status tracking

- Table visualization for the submitted data

- View previously uploaded data (depending on accounts, can be per browser session or per user)

- Job tracking visualization/progress (Dashboard)


**2-3 stretch requirements (plan to complete at least 1!)**

- Multiple OAuth providers

- Take as input other types of data

- Integrate other storage solutions into app (e.g. S3, kaggle, etc)

- Job notification

- Integrate other storage solutions into app (e.g. S3, kaggle, etc)

**Pick 2 of your minimal requirements and break each of them down into ~2-5 smaller
tasks!**

- Opening page
  - Create a page for the landing page of the website
  - Compare our software to other AutoML solutions, and link to it from home page
  - Add a Get Started page and link to it from home page

- Accounts
  - Structure data in database to store account information
  - Create Sign up and Log in pages
  - Create Job Tracking page (Not part of this requirement, but is related so I added this here)
  - Create Account information and settings page

**Finally, draw 2-3 rough sketch prototypes of some key tasks of your app. Sketch these
physically on paper and then scan and add to your repo.**

See Image 1 and Image 2.

**Some more info**
- https://www.automl.org/
  - A listing of some autoML companies and related topics
- Google AutoML: https://cloud.google.com/automl/
  - Big competitor. Supports Vision, Video intelligence (currently beta) and NLP data
- Data robot: https://www.datarobot.com/
  - Decent website
- AutoGluon: https://auto.gluon.ai/stable/index.html
  - AutoML Library with support for all kinds of data
- AutoKeras:  https://autokeras.com/
  - AutoML library for neural nets.
- MLJar: https://mljar.com/
  - Supports tabular data only. Decent frontend and includes lots of explainability in their models
- Auto-Sklearn/Auto-Pytorch: https://automl.github.io/auto-sklearn/master/
  - Really just github repos for software developers to use
- TPOT: http://epistasislab.github.io/tpot/
  - Python auto-ML tool. No frontend
- MLPlan: https://starlibs.github.io/AILibs/projects/mlplan
  - Java auto-ML library.
- H20 AutoML: https://www.h2o.ai/products/h2o-automl/
  - Supports tabular data only. Mostly a command-line interface
- Ludwig: https://github.com/ludwig-ai/ludwig
  - AutoML library. Supports all kinds of data types, but no frontend
- Auto-Weka: http://www.cs.ubc.ca/labs/beta/Projects/autoweka/
  - Very primitive, seems deprecated
  

**Development instructions:**

1. Install NPM and Yarn:
  - Install NPM version 7.17 and Yarn version 2.4
2. Run `yarn install`
3. Run `yarn start`

**Requirements modified, July 5 - Added new requirements after discussion with AutoML team and modified existing requirements due to changes in design**