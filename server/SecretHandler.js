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
  const email_pwd = process.env.COMMON_EMAIL_PASSWORD;
  const captcha_site_key = process.env.CAPTCHA_SITE_KEY;
  const captcha_secret_key = process.env.CAPTCHA_SECRET_KEY;
  const ssh_user = process.env.SSH_USER;
  const ssh_pw = process.env.SSH_PW;
  const borg_dataset_directory = process.env.BORG_DATASET_DIRECTORY;
  const remote_ssh = process.env.REMOTE_SSH;
  const ensemble_session_path = process.env.ENSEMBLE_SESSION_PATH;
  const slurm_command_dataset_path =process.env.SLURM_COMMAND_DATASET_PATH;
  toExport = {
    user, password, server, database, email, email_pwd, captcha_site_key, captcha_secret_key, ssh_user, ssh_pw,
    borg_dataset_directory, remote_ssh, ensemble_session_path, slurm_command_dataset_path
  };
}
module.exports = toExport;
