/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
function checkLabel(issues_get,label){
  for(var i in issues_get["labels"]){
    if(issues_get["labels"][i]["name"]==label){
      return true
    }
  }
  return false
}

const appeal_text=`我们已经收到了您的申请，并会在 72 小时内处理，请耐心等待。

另请注意，我们可能会要求您提交更多信息。因此，请关注您的 GitHub 绑定邮箱通知。
若您未在 24 小时内回复我们的要求，我们将关闭您的申请，不过您还可以再次提交。`

const reject_text=`感谢您对 IT Craft Development Team 的兴趣和支持。我们很高兴收到您的加入申请，但很遗憾地通知您，您的申请没有通过。

我们寻找具有创新能力或与我们志同道合的成员。根据您提交的申请，我们认为您的思想或技能水平还不符合我们的要求。我们建议您在以下方面提高自己：

- 掌握至少一种主流编程语言，如 Python, Java, Rust 等。
- 了解常用的软件开发工具，如 VSCode, Pycharm, IDEA 等。
- 参与一些有创新性的项目，展示您的解决问题和协作能力。

我们对您的未来发展表示祝福，并希望您能够继续关注我们的团队动态。如果您有任何疑问或反馈，请随时联系我们。`

const approve_text=`恭喜您，我们已经同意您的申请！

欢迎加入 IT Craft Development Team。请尽快用您的 QQ 号申请加入 QQ 群 \`701257458\`，我们在那里等您！

再次提醒，请注意，加入群后，请遵守以下群规：

- 不违反相关法律法规；
- 对于政治、病毒、广告等敏感话题，仅限适度讨论；
- 禁止刷屏、霸屏、过度发病等影响正常聊天的行为；
- 友善交流，禁止骂人等影响风气的行为；

感谢您的理解和配合！`

module.exports = (app) => {
  // Your code here
  
  app.log.info("Yay, the app was loaded!");
  
  app.on("issues.opened", async (context) => { // 新加入申请
    var issue = context.payload.issue
    app.log.info("issues.opened")
    if(!checkLabel(issue,"· Join-application")){return}
    const issueComment = context.issue({
      body: appeal_text,
    });
    context.octokit.issues.addAssignees(context.issue({assignees: ["xxtg666","This-is-XiaoDeng"]}))
    return context.octokit.issues.createComment(issueComment);
  });

  app.on("issues.labeled", async(context) => { // 拒绝/通过申请
    var issue = context.payload.issue
    app.log.info("issues.labeled")
    if(!checkLabel(issue,"· Join-application")){return}
    if(checkLabel(issue,"√ Approved")){
      context.octokit.issues.removeAssignees(context.issue({assignees: ["xxtg666","This-is-XiaoDeng"]}))
      const issueComment = context.issue({
        body: approve_text,
      });
      context.octokit.issues.update(context.issue({state: "closed",state_reason: "completed"}))
      return context.octokit.issues.createComment(issueComment);
    }
    else if(checkLabel(issue,"× Rejected")){
      context.octokit.issues.removeAssignees(context.issue({assignees: ["xxtg666","This-is-XiaoDeng"]}))
      const issueComment = context.issue({
        body: reject_text,
      });
      context.octokit.issues.update(context.issue({state: "closed",state_reason: "completed"}))
      return context.octokit.issues.createComment(issueComment);
    }
  });

  app.on("issue_comment.created", async(context) => { // 在存储数据issue中回复自动隐藏
    var issue = context.payload.issue
    if(issue.id != 14){return}
    var comment = context.payload.comment
    if(comment.user.login != "itcdt-join-application-bot"){
      context.octokit.issues.deleteComment(context.issue({comment_id: comment.id}))
    }
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
