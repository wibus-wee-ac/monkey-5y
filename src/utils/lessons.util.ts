import { updateParentCheckbox } from "./checkbox.util";
import { expandChapterAndSubChapter } from "./dialog.util";
import { renderLessionCount } from "./render.util";
import { startListeningVideoAndTryingToWatchAnotherVideoAfterFinished } from "./video.util";

export function restoreWatchedLessons() {
  const watchedLessons = JSON.parse(localStorage.getItem("watchedLessons") || "[]");
  const info = document.querySelector(".info");

  watchedLessons.forEach((lesson: any) => {
    const { chapterIndex, subChapterIndex, lessonIndex } = lesson;
    const checkbox = info?.querySelector(
      `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"][data-lesson="${lessonIndex}"]`
    ) as HTMLInputElement;

    if (checkbox) {
      checkbox.checked = true;
      updateParentCheckbox(chapterIndex, subChapterIndex);
      expandChapterAndSubChapter(chapterIndex, subChapterIndex);
    }
  });
}


export function getSelectedLessons() {
  const selectedLessons: any[] = [];
  const lessonCheckboxes = document.querySelectorAll(".lesson-checkbox:checked");

  lessonCheckboxes.forEach((checkbox: Element) => {
    const chapterIndex = (checkbox as HTMLInputElement).getAttribute("data-chapter");
    const subChapterIndex = (checkbox as HTMLInputElement).getAttribute("data-sub-chapter");
    const lessonIndex = (checkbox as HTMLInputElement).getAttribute("data-lesson");
    selectedLessons.push({ chapterIndex, subChapterIndex, lessonIndex });
  });

  return selectedLessons;
}

export function getLessionCount() {
  const colum_items = document.querySelectorAll(".colum_item");
  const chapters: Array<{
    title: string;
    subChapters: Array<{
      title: string;
      lessons: Array<{
        title: string;
        videoCount: number;
      }>;
    }>;
  }> = [];

  colum_items.forEach((colum_item) => {
    const chapterTitle = colum_item.querySelector(".clearfix.ptspread > .label > label")?.textContent?.trim() || "未知章节";
    const subChapters: Array<{
      title: string;
      lessons: Array<{ title: string; videoCount: number }>;
    }> = [];

    const catalog_items = colum_item.querySelectorAll(".catalog_item");
    catalog_items.forEach((catalog_item) => {
      const subChapterTitle = catalog_item.querySelector(".colum_menu > .label > label")?.textContent?.trim() || "未知子章节";
      const lessons: Array<{ title: string; videoCount: number }> = [];

      const catalog_cmenu = catalog_item.querySelector(".catalog_cmenu");
      const lis = catalog_cmenu?.querySelectorAll("li");
      if (!lis?.length) {
        const videoCount = catalog_item.querySelectorAll(".catalog_child .catalog_icon").length;
        lessons.push({
          title: subChapterTitle,
          videoCount: videoCount,
        });
      } else {
        lis?.forEach((li) => {
          const lessonTitle = li.querySelector(".label > label")?.textContent?.trim() || "未知课程";
          const videoCount = li.querySelectorAll(".catalog_child .catalog_icon").length;
          lessons.push({
            title: lessonTitle,
            videoCount: videoCount,
          });
        });
      }

      subChapters.push({
        title: subChapterTitle,
        lessons: lessons,
      });
    });

    chapters.push({
      title: chapterTitle,
      subChapters: subChapters,
    });
  });

  return {
    total: chapters.length,
    chapters: chapters,
  };
}

export function listenListAppear() {
  let isListAppeared = false;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const addedNodes = Array.from(mutation.addedNodes);
        const hasColumItem = addedNodes.some((node) =>
          (node as Element).classList?.contains("colum_item")
        );

        if (hasColumItem && !isListAppeared) {
          isListAppeared = true;
          renderLessionCount(getLessionCount());
          const isStartedLesson = JSON.parse(
            localStorage.getItem("isStartedLesson") || "false"
          );
          if (isStartedLesson) {
            startListeningVideoAndTryingToWatchAnotherVideoAfterFinished();
          }
          observer.disconnect();
          break;
        }
      }
    }
  });

  const config = { childList: true, subtree: true };

  const waitForCatalog = setInterval(() => {
    const catalog = document.querySelector(".catalog");
    if (catalog) {
      clearInterval(waitForCatalog);
      observer.observe(catalog, config);
    }
  }, 100);
}
