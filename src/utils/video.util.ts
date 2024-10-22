/**
 * 显示崩溃警告并清除本地存储
 * @param {string} varName - 未找到的变量名
 */
export function crashWarning(varName: string) {
  alert(`无法找到 ${varName}，这不是预期行为`);
  localStorage.removeItem("watchedLessons");
  localStorage.removeItem("currentLesson");
}

/**
 * 自动观看视频
 * @param {any[]} selectedLessons - 选中的课程列表
 */
export async function autoWatchVideos(selectedLessons: any[]) {
  localStorage.setItem("watchedLessons", JSON.stringify(selectedLessons));
  console.log("记录本次刷课会话的选择", selectedLessons);

  let currentLesson = selectedLessons[0];
  localStorage.setItem("currentLesson", JSON.stringify(currentLesson));

  const chapterIndex = currentLesson.chapterIndex;
  const chapter = document.querySelectorAll(".colum_item")[chapterIndex];
  if (!chapter) {
    crashWarning("chapter");
    return;
  }

  const catalog_items = chapter.querySelectorAll(".catalog_item");
  if (!catalog_items) {
    crashWarning("catalog_items");
    return;
  }

  const catalog_item =
    catalog_items[currentLesson.subChapterIndex].querySelector(
      ".catalog_cmenu"
    );
  if (!catalog_item) {
    crashWarning("catalog_item");
    return;
  }

  startListeningVideoAndTryingToWatchAnotherVideoAfterFinished();
}

/**
 * 开始监听视频并尝试在视频结束后观看另一个视频
 */
export function startListeningVideoAndTryingToWatchAnotherVideoAfterFinished() {
  localStorage.setItem("isStartedLesson", "true");

  const currentLesson = JSON.parse(localStorage.getItem("currentLesson") || "{}");
  const chapterIndex = currentLesson.chapterIndex;
  const chapter = document.querySelectorAll(".colum_item")[chapterIndex];
  const catalog_items = chapter.querySelectorAll(".catalog_item");
  const catalog_item = catalog_items[currentLesson.subChapterIndex].querySelector(".catalog_cmenu");
  const li = catalog_item?.querySelectorAll("li")[currentLesson.lessonIndex];

  if (!li) {
    const videosA = catalog_items[currentLesson.subChapterIndex]?.querySelectorAll(".catalog_child > nobr > .catalog_icon");
    if (videosA) {
      (videosA[videosA.length - 1] as HTMLElement).click();
      setTimeout(listenVideoFinished, 2000);
    }
  } else {
    const videosA = li?.querySelectorAll(".catalog_child > nobr > .catalog_icon");
    if (videosA) {
      (videosA[videosA.length - 1] as HTMLElement).click();
      setTimeout(listenVideoFinished, 2000);
    }
  }
}

/**
 * 监听视频结束
 */
export function listenVideoFinished() {
  let currentVideo: HTMLVideoElement | null = null;
  let observer: MutationObserver | null = null;

  function checkVideoStatus() {
    const video = document.querySelector("#ckplayer_a1") as HTMLVideoElement;
    if (video && video !== currentVideo) {
      currentVideo = video;
      console.log("发现新的视频元素");

      if (observer) {
        observer.disconnect();
      }

      observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === "attributes" && mutation.attributeName === "src") {
            console.log("视频源发生变化");
            checkVideoEnded();
          }
        }
      });

      observer.observe(video, { attributes: true, attributeFilter: ["src"] });
      video.addEventListener("ended", checkVideoEnded);
    }
  }

  function checkVideoEnded() {
    console.log("检查视频是否结束");
    setTimeout(() => {
      const video = document.querySelector("#ckplayer_a1") as HTMLVideoElement;
      if (!video || video.ended) {
        console.log("视频已结束");
        handleVideoEnd();
      } else {
        console.log("视频未结束，继续监听");
      }
    }, 1000);
  }

  function handleVideoEnd() {
    console.log("处理视频结束");
    const selectedLessons = JSON.parse(localStorage.getItem("watchedLessons") || "[]");
    const currentLesson = JSON.parse(localStorage.getItem("currentLesson") || "{}");

    const index = selectedLessons.findIndex(
      (lesson: any) =>
        lesson.chapterIndex === currentLesson.chapterIndex &&
        lesson.subChapterIndex === currentLesson.subChapterIndex &&
        lesson.lessonIndex === currentLesson.lessonIndex
    );
    if (index !== -1 && index < selectedLessons.length - 1) {
      localStorage.setItem("currentLesson", JSON.stringify(selectedLessons[index + 1]));
    } else {
      console.log("所有选定的课程已完成");
      alert("所有选定的课程已完成");
      localStorage.removeItem("isStartedLesson");
      localStorage.removeItem("watchedLessons");
      localStorage.removeItem("currentLesson");
      observer?.disconnect();
      localStorage.removeItem("selectedLessons");
    }

    const returnButton = document.querySelector(".video_rhead > a:nth-child(2)");
    if (returnButton) {
      (returnButton as HTMLElement).click();
    }
  }

  setInterval(checkVideoStatus, 1000);
}