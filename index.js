const core = require("@actions/core");
const github = require("@actions/github");
const exec = require("@actions/exec");
const { Octokit } = require("@octokit/rest");

const main = async () => {
    const getAssetsCount = async() => {
      const src = __dirname + "/index.sh"
      await exec.exec(`chmod +x ${src}`);
      const count = await exec.exec(`${src}`);
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

    const script = `find ./src/assets/ \( -iname '*.gif' -o -iname '*.jpg' -o -iname '*.svg' -o -iname '*.jpeg' -o -iname '*.png' \) -type f -size +100k -exec ls -lh {} \; | wc -l`;
    const res = await exec.exec(`${script}`);
    console.log(res);

    const assetsMoreThanThrashold = getAssetsCount();

    const errorBody = `Oops :eyes: !!! You have ${assetsMoreThanThrashold} assets with size more than 100Kb. Please optimize them.`
    const successBody = ` Woohooo :rocket: !!! Congratulations, your all assets are less than 100Kb.`


    if(assetsMoreThanThrashold !== 0) {
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
