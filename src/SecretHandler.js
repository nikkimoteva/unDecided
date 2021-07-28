const fs = require('fs');
const path = require('path');

let toExport;

try {
  const config = fs.readFileSync(path.resolve(__dirname, "../secrets.json"), {encoding: "utf-8"});
  toExport = JSON.parse(config);
} catch (err) {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const server = process.env.DB_SERVER;
  const database = process.env.DB_NAME;
  const email = process.env.COMMON_EMAIL;
  const captcha_site_key = process.env.CAPTCHA_SITE_KEY;
  const captcha_secret_key = process.env.CAPTCHA_SECRET_KEY;
  const contactus_user = process.env.CONTACTUS_USER;
  const contactus_access_token = process.env.CONTACTUS_ACCESS_TOKEN;
  const contactus_service_id = process.env.CONTACTUS_SERVICE_ID;
  const contactus_template_id = process.env.CONTACTUS_TEMPLATE_ID;
  toExport = {
    user, password, server, database, email, captcha_site_key, captcha_secret_key, contactus_user,
    contactus_access_token, contactus_service_id, contactus_template_id
  };
}

module.exports = toExport;
