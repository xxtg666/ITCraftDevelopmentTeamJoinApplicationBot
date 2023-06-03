/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
function checkLabel(issues_get,label){
  for(var i=0;i<issues_get["labels"].length;i++){
    if(issues_get["labels"][i]["name"]==label){
      return true
    }
  }
  return false
}
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.opened", async (context) => {
    var issue = context.octokit.issues.get(context.issue())
    if(!checkLabel(issue,"· Join-application")){return}
    const issueComment = context.issue({
      body: "我们已经收到了您的申请，并会在 72 小时内处理，请耐心等待。\n另请注意，我们可能会要求您提交更多信息。因此，请关注您的 GitHub 绑定邮箱通知。\n若您未在 24 小时内回复我们的要求，我们将关闭您的申请，不过您还可以再次提交。",
    });
    context.octokit.issues.addAssignees(context.issue({assignees: ["xxtg666","This-is-XiaoDeng"]}))
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("issues.labeled", async(context) => {
    var issue = context.octokit.issues.get(context.issue())
    if(!checkLabel(issue,"· Join-application")){return}
    if(checkLabel(issue,"√ Approved")){
      context.octokit.issues.removeAssignees(context.issue({assignees: ["xxtg666","This-is-XiaoDeng"]}))
      const issueComment = context.issue({
        body: "我们已经同意您的申请。\n\n请使用您的 QQ 号向 QQ 群 `701257458` 发送加群申请以加入 `IT Craft Development Team`。",
      });
      context.octokit.issues.update(context.issue({state: "closed",state_reason: "completed"}))
      return context.octokit.issues.createComment(issueComment);
    }
    else if(checkLabel(issue,"× Rejected")){
      context.octokit.issues.removeAssignees(context.issue({assignees: ["xxtg666","This-is-XiaoDeng"]}))
      const issueComment = context.issue({
        body: "很抱歉，我们拒绝了您的申请。\n\n",
      });
      context.octokit.issues.update(context.issue({state: "closed",state_reason: "completed"}))
      return context.octokit.issues.createComment(issueComment);
    }

  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
