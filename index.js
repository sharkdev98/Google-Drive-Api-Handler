const core = require('@actions/core');
const github = require('@actions/github');
const {auth, Compute} = require('google-auth-library');

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  main().catch(console.error);
} catch (error) {
  core.setFailed(error.message);
}

async function main() {
  const client = new Compute({
    // Specifying the service account email is optional.
    serviceAccountEmail: 'autoupdatingserviceaccount@autoupdates-315412.iam.gserviceaccount.com'
  });
  const projectId = await auth.getProjectId();
  const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
  const res = await client.request({url});
  console.log(res.data);
}

