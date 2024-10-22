import { updateParentCheckbox } from "./checkbox.util";

export function addEventListeners(info: Element) {
  const toggleChapters = info.querySelectorAll(".toggle-chapter");
  const toggleSubChapters = info.querySelectorAll(".toggle-sub-chapter");
  const chapterCheckboxes = info.querySelectorAll(".chapter-checkbox");
  const subChapterCheckboxes = info.querySelectorAll(".sub-chapter-checkbox");
  const lessonCheckboxes = info.querySelectorAll(".lesson-checkbox");

  toggleChapters.forEach(addToggleChapterListener);
  toggleSubChapters.forEach(addToggleSubChapterListener);
  chapterCheckboxes.forEach(addChapterCheckboxListener);
  subChapterCheckboxes.forEach(addSubChapterCheckboxListener);
  lessonCheckboxes.forEach(addLessonCheckboxListener);
}

function addToggleChapterListener(toggle: Element) {
  toggle.addEventListener("click", (e) => {
    const chapterIndex = (e.target as HTMLElement).getAttribute("data-chapter");
    const chapterContent = document.querySelector(`.chapter-content[data-chapter="${chapterIndex}"]`);
    chapterContent?.classList.toggle("hidden");
    (e.target as HTMLElement).textContent = chapterContent?.classList.contains("hidden") ? "▶" : "▼";
  });
}

function addToggleSubChapterListener(toggle: Element) {
  toggle.addEventListener("click", (e) => {
    const chapterIndex = (e.target as HTMLElement).getAttribute("data-chapter");
    const subChapterIndex = (e.target as HTMLElement).getAttribute("data-sub-chapter");
    const subChapterContent = document.querySelector(
      `.sub-chapter-content[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
    );
    subChapterContent?.classList.toggle("hidden");
    (e.target as HTMLElement).textContent = subChapterContent?.classList.contains("hidden") ? "▶" : "▼";
  });
}

function addChapterCheckboxListener(checkbox: Element) {
  checkbox.addEventListener("change", (e) => {
    const chapterIndex = (e.target as HTMLInputElement).getAttribute("data-chapter");
    const isChecked = (e.target as HTMLInputElement).checked;
    const subChapters = document.querySelectorAll(`.sub-chapter-checkbox[data-chapter="${chapterIndex}"]`);
    const lessons = document.querySelectorAll(`.lesson-checkbox[data-chapter="${chapterIndex}"]`);
    subChapters.forEach((subChapter: Element) => (subChapter as HTMLInputElement).checked = isChecked);
    lessons.forEach((lesson: Element) => (lesson as HTMLInputElement).checked = isChecked);
  });
}

function addSubChapterCheckboxListener(checkbox: Element) {
  checkbox.addEventListener("change", (e) => {
    const chapterIndex = (e.target as HTMLInputElement).getAttribute("data-chapter");
    const subChapterIndex = (e.target as HTMLInputElement).getAttribute("data-sub-chapter");
    const isChecked = (e.target as HTMLInputElement).checked;
    const lessons = document.querySelectorAll(
      `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
    );
    lessons.forEach((lesson: Element) => (lesson as HTMLInputElement).checked = isChecked);
    updateParentCheckbox(chapterIndex);
  });
}

function addLessonCheckboxListener(checkbox: Element) {
  checkbox.addEventListener("change", (e) => {
    const chapterIndex = (e.target as HTMLInputElement).getAttribute("data-chapter");
    const subChapterIndex = (e.target as HTMLInputElement).getAttribute("data-sub-chapter");
    updateParentCheckbox(chapterIndex, subChapterIndex);
  });
}
