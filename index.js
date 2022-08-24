const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const { Octokit } = require("@octokit/rest");

const main = async () => {
    function getAssetsCount(){
       const count = exec.exec(`find src/assets/ -type f -size +10k -exec ls -lh {} \; | wc -l`);
       return count;
    }

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

    console.log(getAssetsCount());
    
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
