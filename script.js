const themeToggle = document.getElementById("themeToggle");
const themeText = themeToggle.querySelector(".theme-toggle__text");
const filterButtons = document.querySelectorAll(".filter-button");
const postCards = document.querySelectorAll("#filterablePosts .post-item");
const commentForm = document.getElementById("commentForm");
const formStatus = document.getElementById("formStatus");
const recentComments = document.getElementById("recentComments");

const storageKey = "linxi-blog-theme";

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeText.textContent = isDark ? "深色" : "浅色";
}

function initTheme() {
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    postCards.forEach((card) => {
      const matched = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !matched);
    });
  });
});

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearErrors() {
  setError("nameError", "");
  setError("emailError", "");
  setError("messageError", "");
  formStatus.textContent = "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createCommentItem(name, message) {
  const item = document.createElement("li");
  item.className = "recent-comment-item";

  const avatar = document.createElement("span");
  avatar.className = "recent-comment-item__avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = name.slice(0, 1).toUpperCase();

  const content = document.createElement("div");

  const meta = document.createElement("p");
  meta.className = "recent-comment-item__meta";
  meta.textContent = `刚刚 · ${name}`;

  const text = document.createElement("p");
  text.className = "recent-comment-item__text";
  text.textContent = message;

  content.append(meta, text);
  item.append(avatar, content);
  return item;
}

commentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearErrors();

  const name = commentForm.name.value.trim();
  const email = commentForm.email.value.trim();
  const message = commentForm.message.value.trim();

  let valid = true;

  if (!name) {
    setError("nameError", "请输入昵称。");
    valid = false;
  }

  if (!email) {
    setError("emailError", "请输入邮箱。");
    valid = false;
  } else if (!validateEmail(email)) {
    setError("emailError", "邮箱格式不正确。");
    valid = false;
  }

  if (!message) {
    setError("messageError", "评论内容不能为空。");
    valid = false;
  }

  if (!valid) {
    formStatus.textContent = "提交失败，请先修正表单中的错误。";
    return;
  }

  formStatus.textContent = `提交成功，感谢你留言，${name}。`;
  if (recentComments) {
    recentComments.prepend(createCommentItem(name, message));
  }
  commentForm.reset();
});

initTheme();
