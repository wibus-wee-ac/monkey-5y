import { getLessionCount, restoreWatchedLessons, getSelectedLessons } from "./lessons.util";
import { renderLessionCount } from "./render.util";
import { autoWatchVideos } from "./video.util";

export function addDialogButtons(dialog: HTMLElement) {
  const buttons = [
    { className: "check-all", text: "检查所有章节", onClick: () => {
      renderLessionCount(getLessionCount());
      restoreWatchedLessons();
    }},
    { className: "start-watching", text: "开始观看", onClick: () => {
      if (localStorage.getItem("isStartedLesson")) {
        alert("你已经开始了刷课会话，请先结束刷课会话");
        return;
      }
      if (localStorage.getItem("currentLesson")) {
        localStorage.setItem("isStartedLesson", "true");
        location.reload();
        return;
      }
      const selectedLessons = getSelectedLessons();
      autoWatchVideos(selectedLessons);
    }},
    { className: "end-session", text: "结束刷课会话", onClick: () => {
      localStorage.removeItem("watchedLessons");
      localStorage.removeItem("currentLesson");
      localStorage.removeItem("isStartedLesson");
    }},
    { className: "toggle-watching", text: "暂停刷课", onClick: () => {
      localStorage.removeItem("isStartedLesson");
    }}
  ];

  buttons.forEach(button => {
    const buttonElement = document.createElement("button");
    buttonElement.className = button.className;
    buttonElement.innerText = button.text;
    buttonElement.addEventListener("click", button.onClick);
    dialog.appendChild(buttonElement);
  });
}



export function expandChapterAndSubChapter(chapterIndex: string, subChapterIndex: string) {
  const info = document.querySelector(".info");
  const chapterContent = info?.querySelector(`.chapter-content[data-chapter="${chapterIndex}"]`);
  const subChapterContent = info?.querySelector(
    `.sub-chapter-content[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
  );

  chapterContent?.classList.remove("hidden");
  subChapterContent?.classList.remove("hidden");

  const chapterToggle = info?.querySelector(`.toggle-chapter[data-chapter="${chapterIndex}"]`);
  const subChapterToggle = info?.querySelector(
    `.toggle-sub-chapter[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
  );

  if (chapterToggle) (chapterToggle as HTMLElement).textContent = "▼";
  if (subChapterToggle) (subChapterToggle as HTMLElement).textContent = "▼";
}
