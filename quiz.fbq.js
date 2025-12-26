import "./meta-data-fbq.js";

// todo(vmyshko): extra fbq stuff here

window.fbq("track", "Lead", { content_name: "quiz" });

$formPostQuiz.addEventListener("submit", () => {
  window.fbq("track", "CompleteRegistration", { form_submit: "formPostQuiz" });
});
