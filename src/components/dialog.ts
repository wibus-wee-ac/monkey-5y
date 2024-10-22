function renderLessionCount(lessionCount: any) {
  const dialog = document.querySelector(".auto-study-dialog");
  const info = dialog?.querySelector(".info");

  if (!info) {
    console.error("无法找到 .info 元素");
    return;
  }

  const total = lessionCount?.total || 0;
  const chapters = lessionCount?.chapters || [];

  info.innerHTML = `
    <hr>
    <h3 class="info-title">选择要观看的章节</h3>
    <p class="info-total">总章节数量: ${total}</p>
    ${
      chapters.length > 0
        ? chapters
            .map(
              (chapter: any, chapterIndex: number) => `
      <h4 class="info-chapter-title">
        <input type="checkbox" class="chapter-checkbox" data-chapter="${chapterIndex}">
        <span class="toggle-chapter" data-chapter="${chapterIndex}">▶</span>
        ${chapter.title || "未知章节"}
      </h4>
      <div class="chapter-content hidden" data-chapter="${chapterIndex}">
        ${
          chapter.subChapters && chapter.subChapters.length > 0
            ? chapter.subChapters
                .map(
                  (subChapter: any, subChapterIndex: number) => `
          <h5 class="info-sub-chapter-title">
            <input type="checkbox" class="sub-chapter-checkbox" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}">
            <span class="toggle-sub-chapter" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}">▶</span>
            ${subChapter.title || "未知子章节"}
          </h5>
          <div class="sub-chapter-content hidden" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}">
            <p class="info-sub-chapter-lessons">课程数量: ${
              subChapter.lessons ? subChapter.lessons.length : 0
            }</p>
            <ul class="info-sub-chapter-lessons-list">
              ${
                subChapter.lessons && subChapter.lessons.length > 0
                  ? subChapter.lessons
                      .map(
                        (lesson: any, lessonIndex: number) => `
                <li>
                  <input type="checkbox" class="lesson-checkbox" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}" data-lesson="${lessonIndex}">
                  ${lesson.title || "未知课程"}
                  <span class="lesson-video-count">(视频数: ${
                    lesson.videoCount || 0
                  })</span>
                  <div class="catalog_child" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}" data-lesson="${lessonIndex}">
                    ${
                      lesson.videoLinks && lesson.videoLinks.length > 0
                        ? lesson.videoLinks
                            .map(
                              (link: string) => `
                      <nobr><a class="catalog_icon" onclick="${link}">${link}</a></nobr>
                    `
                            )
                            .join("")
                        : ""
                    }
                  </div>
                </li>
              `
                      )
                      .join("")
                  : "<li>没有课程</li>"
              }
            </ul>
          </div>
        `
                )
                .join("")
            : "<p>没有子章节</p>"
        }
      </div>
    `
            )
            .join("")
        : "<p>没有章节</p>"
    }
  `;
  // 添加折叠功能和勾选框联动
  const toggleChapters = info!.querySelectorAll(".toggle-chapter");
  const toggleSubChapters = info!.querySelectorAll(".toggle-sub-chapter");
  const chapterCheckboxes = info!.querySelectorAll(".chapter-checkbox");
  const subChapterCheckboxes = info!.querySelectorAll(".sub-chapter-checkbox");
  const lessonCheckboxes = info!.querySelectorAll(".lesson-checkbox");

  toggleChapters.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      const chapterIndex = (e.target as HTMLElement).getAttribute(
        "data-chapter"
      );
      const chapterContent = info!.querySelector(
        `.chapter-content[data-chapter="${chapterIndex}"]`
      );
      chapterContent?.classList.toggle("hidden");
      (e.target as HTMLElement).textContent =
        chapterContent?.classList.contains("hidden") ? "▶" : "▼";
    });
  });

  toggleSubChapters.forEach((toggle) => {
    toggle.addEventListener("click", (e) => {
      const chapterIndex = (e.target as HTMLElement).getAttribute(
        "data-chapter"
      );
      const subChapterIndex = (e.target as HTMLElement).getAttribute(
        "data-sub-chapter"
      );
      const subChapterContent = info!.querySelector(
        `.sub-chapter-content[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      subChapterContent?.classList.toggle("hidden");
      (e.target as HTMLElement).textContent =
        subChapterContent?.classList.contains("hidden") ? "▶" : "▼";
    });
  });

  // 添加勾选框联动
  chapterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const chapterIndex = (e.target as HTMLInputElement).getAttribute(
        "data-chapter"
      );
      const isChecked = (e.target as HTMLInputElement).checked;
      const subChapters = info!.querySelectorAll(
        `.sub-chapter-checkbox[data-chapter="${chapterIndex}"]`
      );
      const lessons = info!.querySelectorAll(
        `.lesson-checkbox[data-chapter="${chapterIndex}"]`
      );
      subChapters.forEach(
        (subChapter: Element) =>
          ((subChapter as HTMLInputElement).checked = isChecked)
      );
      lessons.forEach(
        (lesson: Element) => ((lesson as HTMLInputElement).checked = isChecked)
      );
    });
  });

  subChapterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const chapterIndex = (e.target as HTMLInputElement).getAttribute(
        "data-chapter"
      );
      const subChapterIndex = (e.target as HTMLInputElement).getAttribute(
        "data-sub-chapter"
      );
      const isChecked = (e.target as HTMLInputElement).checked;
      const lessons = info!.querySelectorAll(
        `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      lessons.forEach(
        (lesson: Element) => ((lesson as HTMLInputElement).checked = isChecked)
      );
      updateParentCheckbox(chapterIndex);
    });
  });

  lessonCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      const chapterIndex = (e.target as HTMLInputElement).getAttribute(
        "data-chapter"
      );
      const subChapterIndex = (e.target as HTMLInputElement).getAttribute(
        "data-sub-chapter"
      );
      updateParentCheckbox(chapterIndex, subChapterIndex);
    });
  });

  function updateParentCheckbox(
    chapterIndex: string | null,
    subChapterIndex?: string | null
  ) {
    if (subChapterIndex) {
      const subChapterCheckbox = info!.querySelector(
        `.sub-chapter-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      ) as HTMLInputElement;
      const lessonCheckboxes = info!.querySelectorAll(
        `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      subChapterCheckbox.checked = Array.from(lessonCheckboxes).every(
        (checkbox: Element) => (checkbox as HTMLInputElement).checked
      );
    }
    const chapterCheckbox = info!.querySelector(
      `.chapter-checkbox[data-chapter="${chapterIndex}"]`
    ) as HTMLInputElement;
    const subChapterCheckboxes = info!.querySelectorAll(
      `.sub-chapter-checkbox[data-chapter="${chapterIndex}"]`
    );
    chapterCheckbox.checked = Array.from(subChapterCheckboxes).every(
      (checkbox: Element) => (checkbox as HTMLInputElement).checked
    );
  }

  // 在添加勾选框联动之后，添加以下代码
  restoreWatchedLessons();
}

// 修改后的 autoWatchVideos 函数
// 注意，这个函数就是第一次启动的时候才使用的，之后都是靠另外一个函数来自动完成本次刷课会话的
async function autoWatchVideos(selectedLessons: any[]) {
  localStorage.setItem("watchedLessons", JSON.stringify(selectedLessons));
  console.log("记录本次刷课会话的选择", selectedLessons);

  let currentLesson = selectedLessons[0];
  localStorage.setItem("currentLesson", JSON.stringify(currentLesson));

  function crashWarning(varName: string) {
    alert(`无法找到 ${varName}，这不是预期行为`);
    localStorage.removeItem("watchedLessons");
    localStorage.removeItem("currentLesson");
  }

  const chapterIndex = currentLesson.chapterIndex;

  const chapter = document.querySelectorAll(".colum_item")[chapterIndex];
  if (!chapter) {
    crashWarning("chapter");
    return;
  } else {
    console.log("chapter", chapter);
  }

  const catalog_items = chapter.querySelectorAll(".catalog_item");
  if (!catalog_items) {
    crashWarning("catalog_items");
    return;
  } else {
    console.log("catelog_items", catalog_items);
  }

  const catalog_item =
    catalog_items[currentLesson.subChapterIndex].querySelector(
      ".catalog_cmenu"
    );

  if (!catalog_item) {
    crashWarning("catalog_item");
    return;
  } else {
    console.log("catalog_item", catalog_item);
  }

  startListeningVideoAndTryingToWatchAnotherVideoAfterFinished();
}

// 全局监听列表的出现
// function listenListAppear() {
//   let isListAppeared = false;
//   let isInserting = false;
//   document.addEventListener("DOMNodeInserted", (e: any) => {
//     if ((e.relatedNode as Element)?.classList?.contains("catalog")) {
//       isInserting = true;
//     } else if (isInserting && !isListAppeared) {
//       isListAppeared = true;
//       renderLessionCount(getLessionCount());
//     }
//   });
// }
function listenListAppear() {
  let isListAppeared = false;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        const addedNodes = Array.from(mutation.addedNodes);

        for (const node of addedNodes) {
          if ((node as Element).classList) {
          }
        }

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

  // 配置观察选项
  const config = { childList: true, subtree: true };

  // 等待catalog元素出现，然后开始观察
  const waitForCatalog = setInterval(() => {
    const catalog = document.querySelector(".catalog");
    if (catalog) {
      clearInterval(waitForCatalog);
      observer.observe(catalog, config);
    }
  }, 100);
}

listenListAppear();

function startListeningVideoAndTryingToWatchAnotherVideoAfterFinished() {
  localStorage.setItem("isStartedLesson", "true");

  const currentLesson = JSON.parse(
    localStorage.getItem("currentLesson") || "{}"
  );
  const chapterIndex = currentLesson.chapterIndex;
  const chapter = document.querySelectorAll(".colum_item")[chapterIndex];
  const catalog_items = chapter.querySelectorAll(".catalog_item");
  const catalog_item =
    catalog_items[currentLesson.subChapterIndex].querySelector(
      ".catalog_cmenu"
    );
  const li = catalog_item?.querySelectorAll("li")[currentLesson.lessonIndex];
  if (!li) {
    // 则没有子章节，直接点击视频
    const videosA = catalog_items[currentLesson.subChapterIndex]?.querySelectorAll(".catalog_child > nobr > .catalog_icon");
    if (videosA) {
      (videosA[videosA.length - 1] as HTMLElement).click();

      setTimeout(() => {
        listenVideoFinished();
      }, 2000);
    }
  } else {
    const videosA = li?.querySelectorAll(".catalog_child > nobr > .catalog_icon");
    if (videosA) {
    (videosA[videosA.length - 1] as HTMLElement).click();

    setTimeout(() => {
      listenVideoFinished();
      }, 2000);
    }
  }
}

function listenVideoFinished() {
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
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "src"
          ) {
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
    const selectedLessons = JSON.parse(
      localStorage.getItem("watchedLessons") || "[]"
    );
    const currentLesson = JSON.parse(
      localStorage.getItem("currentLesson") || "{}"
    );

    const index = selectedLessons.findIndex(
      (lesson: any) =>
        lesson.chapterIndex === currentLesson.chapterIndex &&
        lesson.subChapterIndex === currentLesson.subChapterIndex &&
        lesson.lessonIndex === currentLesson.lessonIndex
    );
    if (index !== -1 && index < selectedLessons.length - 1) {
      localStorage.setItem(
        "currentLesson",
        JSON.stringify(selectedLessons[index + 1])
      );
    } else {
      console.log("所有选定的课程已完成");
      alert("所有选定的课程已完成");
      localStorage.removeItem("isStartedLesson");
      localStorage.removeItem("watchedLessons");
      localStorage.removeItem("currentLesson");
      observer?.disconnect();
      localStorage.removeItem("selectedLessons");
    }

    const returnButton = document.querySelector(
      ".video_rhead > a:nth-child(2)"
    );
    if (returnButton) {
      (returnButton as HTMLElement).click();
    }
  }

  // 开始定期检查视频状态
  setInterval(checkVideoStatus, 1000);
}

// 修改 createDialog 函数，添加恢复进度的功能
export function createDialog() {
  const dialog = document.createElement("div");
  dialog.className = "auto-study-dialog";
  dialog.innerHTML = `
    <div class="dialog-header">
      <h2>5y 学习平台. 自助上课助手</h2>
    </div>
    <div class="dialog-body">
      <p>这个平台奇奇怪怪的，我还要给你们抹屁股. 气死我了这个东西</p>
      <p>我一天的时间，就浪费在这个平台上了，气死我了。</p>
      <p>它的接口调用非常奇怪，我实在是不想花心思去读js了，直接模拟操作算了吧。</p>
      <p>
        作者: @wibus-wee
      </p>
      <div class="info">
        
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  const checkAllButton = document.createElement("button");
  checkAllButton.className = "check-all";
  checkAllButton.innerText = "检查所有章节";
  checkAllButton.addEventListener("click", () => {
    renderLessionCount(getLessionCount());
    restoreWatchedLessons();
  });
  dialog.appendChild(checkAllButton);

  const startWatchingButton = document.createElement("button");
  startWatchingButton.className = "start-watching";
  startWatchingButton.innerText = "开始观看";
  startWatchingButton.addEventListener("click", () => {
    const selectedLessons = getSelectedLessons();
    autoWatchVideos(selectedLessons);
  });
  dialog.appendChild(startWatchingButton);

  const endSessionButton = document.createElement("button");
  endSessionButton.className = "end-session";
  endSessionButton.innerText = "结束刷课会话";
  endSessionButton.addEventListener("click", () => {
    localStorage.removeItem("watchedLessons");
    localStorage.removeItem("currentLesson");
    localStorage.removeItem("isStartedLesson");
  });
  dialog.appendChild(endSessionButton);

  // 添加拖动功能
  const header = dialog.querySelector(".dialog-header") as HTMLElement;
  let isDragging = false;
  let currentX: number;
  let currentY: number;
  let initialX: number;
  let initialY: number;
  let xOffset = 0;
  let yOffset = 0;

  function dragStart(e: MouseEvent) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === header) {
      isDragging = true;
    }
  }

  function drag(e: MouseEvent) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      setTranslate(currentX, currentY, dialog);
    }
  }

  function dragEnd(_: MouseEvent) {
    initialX = currentX;
    initialY = currentY;

    isDragging = false;
  }

  function setTranslate(xPos: number, yPos: number, el: HTMLElement) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
  }

  header.addEventListener("mousedown", dragStart);
  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", dragEnd);
}

// 添加恢复观看进度的函数
function restoreWatchedLessons() {
  const watchedLessons = JSON.parse(
    localStorage.getItem("watchedLessons") || "[]"
  );
  const info = document.querySelector(".info");

  watchedLessons.forEach((lesson: any) => {
    const { chapterIndex, subChapterIndex, lessonIndex } = lesson;
    const checkbox = info?.querySelector(
      `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"][data-lesson="${lessonIndex}"]`
    ) as HTMLInputElement;

    if (checkbox) {
      checkbox.checked = true;
      updateParentCheckbox(chapterIndex, subChapterIndex);

      // 展开章节
      const chapterContent = info?.querySelector(
        `.chapter-content[data-chapter="${chapterIndex}"]`
      );
      chapterContent?.classList.remove("hidden");
      const chapterToggle = info?.querySelector(
        `.toggle-chapter[data-chapter="${chapterIndex}"]`
      );
      if (chapterToggle) {
        (chapterToggle as HTMLElement).textContent = "▼";
      }

      // 展开子章节
      const subChapterContent = info?.querySelector(
        `.sub-chapter-content[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      subChapterContent?.classList.remove("hidden");
      const subChapterToggle = info?.querySelector(
        `.toggle-sub-chapter[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      if (subChapterToggle) {
        (subChapterToggle as HTMLElement).textContent = "▼";
      }
    }
  });
}

function updateParentCheckbox(
  chapterIndex: string | null,
  subChapterIndex?: string | null
) {
  const info = document.querySelector(".info");
  if (!info) return;

  if (subChapterIndex) {
    const subChapterCheckbox = info.querySelector(
      `.sub-chapter-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
    ) as HTMLInputElement;
    const lessonCheckboxes = info.querySelectorAll(
      `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
    );
    subChapterCheckbox.checked = Array.from(lessonCheckboxes).every(
      (checkbox: Element) => (checkbox as HTMLInputElement).checked
    );
  }
  const chapterCheckbox = info.querySelector(
    `.chapter-checkbox[data-chapter="${chapterIndex}"]`
  ) as HTMLInputElement;
  const subChapterCheckboxes = info.querySelectorAll(
    `.sub-chapter-checkbox[data-chapter="${chapterIndex}"]`
  );
  chapterCheckbox.checked = Array.from(subChapterCheckboxes).every(
    (checkbox: Element) => (checkbox as HTMLInputElement).checked
  );
}

// 获取选中的课程
function getSelectedLessons() {
  const selectedLessons: any[] = [];
  const lessonCheckboxes = document.querySelectorAll(
    ".lesson-checkbox:checked"
  );

  lessonCheckboxes.forEach((checkbox: Element) => {
    const chapterIndex = (checkbox as HTMLInputElement).getAttribute(
      "data-chapter"
    );
    const subChapterIndex = (checkbox as HTMLInputElement).getAttribute(
      "data-sub-chapter"
    );
    const lessonIndex = (checkbox as HTMLInputElement).getAttribute(
      "data-lesson"
    );

    selectedLessons.push({ chapterIndex, subChapterIndex, lessonIndex });
  });

  return selectedLessons;
}

function getLessionCount() {
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
    const chapterTitle =
      colum_item
        .querySelector(".clearfix.ptspread > .label > label")
        ?.textContent?.trim() || "未知章节";
    const subChapters: Array<{
      title: string;
      lessons: Array<{ title: string; videoCount: number }>;
    }> = [];

    const catalog_items = colum_item.querySelectorAll(".catalog_item");
    catalog_items.forEach((catalog_item) => {
      const subChapterTitle =
        catalog_item
          .querySelector(".colum_menu > .label > label")
          ?.textContent?.trim() || "未知子章节";
      const lessons: Array<{ title: string; videoCount: number }> = [];

      const catalog_cmenu = catalog_item.querySelector(".catalog_cmenu");
      const lis = catalog_cmenu?.querySelectorAll("li");
      if (!lis?.length) {
        console.log('信息就是放在了 colum_menu 里面了')
        const videoCount = catalog_item.querySelectorAll(
          ".catalog_child .catalog_icon"
        ).length;
        lessons.push({
          title: subChapterTitle,
          videoCount: videoCount,
        });
      }
      lis?.forEach((li) => {
        const lessonTitle =
          li.querySelector(".label > label")?.textContent?.trim() || "未知课程";
        const videoCount = li.querySelectorAll(
          ".catalog_child .catalog_icon"
        ).length;
        lessons.push({
          title: lessonTitle,
          videoCount: videoCount,
        });
      });

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
