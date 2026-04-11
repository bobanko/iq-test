import "./data-ga.js";
import { analytics, logEvent } from "./endpoints/firebase.init.js";

// ===== Quiz GA Events =====

logEvent(analytics, "begin_quiz", { content_name: "quiz" });

$formPostQuiz.addEventListener("submit", () => {
  logEvent(analytics, "sign_up", { method: "post_quiz_form" });
});
