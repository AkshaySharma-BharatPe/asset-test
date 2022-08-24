const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const { Octokit } = require("@octokit/rest");

const main = async () => {
  try {

    const inputs = {
      token: core.getInput("token"),
    };

    const {
      payload: { pull_request: pullRequest, repository },
    } = github.context;

    if (!pullRequest) {
      core.error("This action only works on pull_request events");
      return;
    }

    const { number: issueNumber } = pullRequest;
    const { full_name: repoFullName } = repository;
    const [owner, repo] = repoFullName.split("/");

    const octokit = new Octokit({
      auth: inputs.token,
    });


    let myOutput = '';
    let myError = '';
    const options = {};
    options.listeners = {
      stdout: (data) => {
        myOutput += data.toString();
      },
      stderr: (data) => {
        myError += data.toString();
      }
    };

    await exec.exec(`find ./src/assets/ -type f  ! -regex  '.*\(png\|gif\|jpg\|svg\|jpeg\)$' -size +100k -exec ls -lh {} \;`, null, options); 
    const arrayOutput = myOutput.split("\n");
    const count = arrayOutput.length -1;

    const successBody = ` Woohooo :rocket: !!! Congratulations, your all assets are less than 100Kb.`
    console.log(count > 0);
    if(count > 0) {
      const errorBody = `Oops :eyes: !!! You have ${count} assets with size more than 100Kb. Please optimize them.`
      octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: errorBody,
      });
    }else {
      octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body: successBody,
      });
    }

  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
