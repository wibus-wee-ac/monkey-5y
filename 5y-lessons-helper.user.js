// ==UserScript==
// @name       5y-lessons-helper
// @namespace  5y 学习平台. 自动抹屁股
// @version    1.0.0
// @author     wibus-wee
// @icon       https://vitejs.dev/logo.svg
// @match      http://5y.gdoa.net/CCenter/*
// @grant      GM_addStyle
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" .auto-study-dialog{position:fixed;top:10px;left:10px;padding:16px;background-color:#fcfcfcc3;border-radius:10px;box-shadow:0 0 10px #00000064;border:1px solid #0e0e0e39;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);max-height:70vh;overflow-y:auto;z-index:1000;resize:both;overflow:auto;min-width:200px;min-height:100px;font-size:16px;line-height:1.8}.dialog-header{position:sticky;top:-16px;cursor:move;-webkit-user-select:none;user-select:none;padding:10px;background-color:#e3e3e3;margin:-16px -16px 10px;border-top-left-radius:10px;border-top-right-radius:10px}.dialog-header h2{margin:0}.check-all{margin-top:10px}.info{margin-bottom:10px}.info-title{font-size:20px;font-weight:700;color:#333;margin-bottom:10px}.info-total{font-size:16px;margin-bottom:15px}.info-chapter-title{font-size:18px;font-weight:700;color:#333;margin:15px 0 10px}.chapter-content{margin-left:20px}.info-sub-chapter-title{font-size:16px;font-weight:700;color:#393838;margin:10px 0 5px}.sub-chapter-content{margin-left:20px}.info-sub-chapter-lessons{font-size:14px;color:#313131;margin-bottom:5px}.info-sub-chapter-lessons-list{margin:0 0 15px;padding-left:20px}.info-sub-chapter-lessons-list li{font-size:14px;color:#717070;margin-bottom:3px}.toggle-chapter,.toggle-sub-chapter{cursor:pointer;margin-right:5px}.hidden{display:none}.info-chapter-title,.info-sub-chapter-title{display:flex;align-items:center}.lesson-video-count{font-size:12px;color:#888;margin-left:5px}.info-sub-chapter-lessons-list li{display:flex;justify-content:space-between;align-items:center}.chapter-checkbox,.sub-chapter-checkbox,.lesson-checkbox{margin-right:5px}.minimize-button{position:absolute;top:5px;right:5px;width:20px;height:20px;background-color:#f0f0f0;border:1px solid #ccc;border-radius:50%;cursor:pointer;font-size:16px;line-height:18px;text-align:center;padding:0}.minimize-button:hover{background-color:#e0e0e0}:root{font-family:Inter,Avenir,Helvetica,Arial,sans-serif;font-size:16px;line-height:24px;font-weight:400;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-text-size-adjust:100%}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}button{border-radius:8px;border:1px solid #cdcffe;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;background-color:#1a1a1a;cursor:pointer;transition:border-color .25s;margin-right:10px}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9} ");

(function () {
  'use strict';

  function updateParentCheckbox(chapterIndex, subChapterIndex) {
    const info = document.querySelector(".info");
    if (!info) return;
    if (subChapterIndex) {
      const subChapterCheckbox = info.querySelector(
        `.sub-chapter-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      const lessonCheckboxes = info.querySelectorAll(
        `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      subChapterCheckbox.checked = Array.from(lessonCheckboxes).every(
        (checkbox) => checkbox.checked
      );
    }
    const chapterCheckbox = info.querySelector(
      `.chapter-checkbox[data-chapter="${chapterIndex}"]`
    );
    const subChapterCheckboxes = info.querySelectorAll(
      `.sub-chapter-checkbox[data-chapter="${chapterIndex}"]`
    );
    chapterCheckbox.checked = Array.from(subChapterCheckboxes).every(
      (checkbox) => checkbox.checked
    );
  }
  function addEventListeners(info) {
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
  function addToggleChapterListener(toggle) {
    toggle.addEventListener("click", (e) => {
      const chapterIndex = e.target.getAttribute("data-chapter");
      const chapterContent = document.querySelector(`.chapter-content[data-chapter="${chapterIndex}"]`);
      chapterContent == null ? void 0 : chapterContent.classList.toggle("hidden");
      e.target.textContent = (chapterContent == null ? void 0 : chapterContent.classList.contains("hidden")) ? "▶" : "▼";
    });
  }
  function addToggleSubChapterListener(toggle) {
    toggle.addEventListener("click", (e) => {
      const chapterIndex = e.target.getAttribute("data-chapter");
      const subChapterIndex = e.target.getAttribute("data-sub-chapter");
      const subChapterContent = document.querySelector(
        `.sub-chapter-content[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      subChapterContent == null ? void 0 : subChapterContent.classList.toggle("hidden");
      e.target.textContent = (subChapterContent == null ? void 0 : subChapterContent.classList.contains("hidden")) ? "▶" : "▼";
    });
  }
  function addChapterCheckboxListener(checkbox) {
    checkbox.addEventListener("change", (e) => {
      const chapterIndex = e.target.getAttribute("data-chapter");
      const isChecked = e.target.checked;
      const subChapters = document.querySelectorAll(`.sub-chapter-checkbox[data-chapter="${chapterIndex}"]`);
      const lessons = document.querySelectorAll(`.lesson-checkbox[data-chapter="${chapterIndex}"]`);
      subChapters.forEach((subChapter) => subChapter.checked = isChecked);
      lessons.forEach((lesson) => lesson.checked = isChecked);
    });
  }
  function addSubChapterCheckboxListener(checkbox) {
    checkbox.addEventListener("change", (e) => {
      const chapterIndex = e.target.getAttribute("data-chapter");
      const subChapterIndex = e.target.getAttribute("data-sub-chapter");
      const isChecked = e.target.checked;
      const lessons = document.querySelectorAll(
        `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
      );
      lessons.forEach((lesson) => lesson.checked = isChecked);
      updateParentCheckbox(chapterIndex);
    });
  }
  function addLessonCheckboxListener(checkbox) {
    checkbox.addEventListener("change", (e) => {
      const chapterIndex = e.target.getAttribute("data-chapter");
      const subChapterIndex = e.target.getAttribute("data-sub-chapter");
      updateParentCheckbox(chapterIndex, subChapterIndex);
    });
  }
  function renderChapterContent(chapter, chapterIndex) {
    return `
    <h4 class="info-chapter-title">
      <input type="checkbox" class="chapter-checkbox" data-chapter="${chapterIndex}">
      <span class="toggle-chapter" data-chapter="${chapterIndex}">▶</span>
      ${chapter.title || "未知章节"}
    </h4>
    <div class="chapter-content hidden" data-chapter="${chapterIndex}">
      ${chapter.subChapters && chapter.subChapters.length > 0 ? chapter.subChapters.map(
    (subChapter, subChapterIndex) => renderSubChapterContent(subChapter, chapterIndex, subChapterIndex)
  ).join("") : "<p>没有子章节</p>"}
    </div>
  `;
  }
  function renderSubChapterContent(subChapter, chapterIndex, subChapterIndex) {
    return `
    <h5 class="info-sub-chapter-title">
      <input type="checkbox" class="sub-chapter-checkbox" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}">
      <span class="toggle-sub-chapter" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}">▶</span>
      ${subChapter.title || "未知子章节"}
    </h5>
    <div class="sub-chapter-content hidden" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}">
      <p class="info-sub-chapter-lessons">课程数量: ${subChapter.lessons ? subChapter.lessons.length : 0}</p>
      <ul class="info-sub-chapter-lessons-list">
        ${renderLessonList(subChapter.lessons, chapterIndex, subChapterIndex)}
      </ul>
    </div>
  `;
  }
  function renderLessonList(lessons, chapterIndex, subChapterIndex) {
    if (!lessons || lessons.length === 0) {
      return "<li>没有课程</li>";
    }
    return lessons.map((lesson, lessonIndex) => `
    <li>
      <input type="checkbox" class="lesson-checkbox" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}" data-lesson="${lessonIndex}">
      ${lesson.title || "未知课程"}
      <span class="lesson-video-count">(视频数: ${lesson.videoCount || 0})</span>
      <div class="catalog_child" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}" data-lesson="${lessonIndex}">
        ${lesson.videoLinks && lesson.videoLinks.length > 0 ? lesson.videoLinks.map((link) => `
              <nobr><a class="catalog_icon" onclick="${link}">${link}</a></nobr>
            `).join("") : ""}
      </div>
    </li>
  `).join("");
  }
  function renderLessionCount(lessionCount) {
    const dialog = document.querySelector(".auto-study-dialog");
    const info = dialog == null ? void 0 : dialog.querySelector(".info");
    if (!info) {
      console.error("无法找到 .info 元素");
      return;
    }
    const total = (lessionCount == null ? void 0 : lessionCount.total) || 0;
    const chapters = (lessionCount == null ? void 0 : lessionCount.chapters) || [];
    info.innerHTML = `
    <hr>
    <h3 class="info-title">选择要观看的章节</h3>
    <p class="info-total">总章节数量: ${total}</p>
    ${chapters.length > 0 ? chapters.map((chapter, chapterIndex) => renderChapterContent(chapter, chapterIndex)).join("") : "<p>没有章节</p>"}
  `;
    addEventListeners(info);
    restoreWatchedLessons();
  }
  function crashWarning(varName) {
    alert(`无法找到 ${varName}，这不是预期行为`);
    localStorage.removeItem("watchedLessons");
    localStorage.removeItem("currentLesson");
  }
  async function autoWatchVideos(selectedLessons) {
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
    const catalog_item = catalog_items[currentLesson.subChapterIndex].querySelector(
      ".catalog_cmenu"
    );
    if (!catalog_item) {
      crashWarning("catalog_item");
      return;
    }
    startListeningVideoAndTryingToWatchAnotherVideoAfterFinished();
  }
  function startListeningVideoAndTryingToWatchAnotherVideoAfterFinished() {
    var _a;
    localStorage.setItem("isStartedLesson", "true");
    const currentLesson = JSON.parse(localStorage.getItem("currentLesson") || "{}");
    const chapterIndex = currentLesson.chapterIndex;
    const chapter = document.querySelectorAll(".colum_item")[chapterIndex];
    const catalog_items = chapter.querySelectorAll(".catalog_item");
    const catalog_item = catalog_items[currentLesson.subChapterIndex].querySelector(".catalog_cmenu");
    const li = catalog_item == null ? void 0 : catalog_item.querySelectorAll("li")[currentLesson.lessonIndex];
    if (!li) {
      const videosA = (_a = catalog_items[currentLesson.subChapterIndex]) == null ? void 0 : _a.querySelectorAll(".catalog_child > nobr > .catalog_icon");
      if (videosA) {
        videosA[videosA.length - 1].click();
        setTimeout(listenVideoFinished, 2e3);
      }
    } else {
      const videosA = li == null ? void 0 : li.querySelectorAll(".catalog_child > nobr > .catalog_icon");
      if (videosA) {
        videosA[videosA.length - 1].click();
        setTimeout(listenVideoFinished, 2e3);
      }
    }
  }
  function listenVideoFinished() {
    let currentVideo = null;
    let observer = null;
    function checkVideoStatus() {
      const video = document.querySelector("#ckplayer_a1");
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
        const video = document.querySelector("#ckplayer_a1");
        if (!video || video.ended) {
          console.log("视频已结束");
          handleVideoEnd();
        } else {
          console.log("视频未结束，继续监听");
        }
      }, 1e3);
    }
    function handleVideoEnd() {
      console.log("处理视频结束");
      const selectedLessons = JSON.parse(localStorage.getItem("watchedLessons") || "[]");
      const currentLesson = JSON.parse(localStorage.getItem("currentLesson") || "{}");
      const index = selectedLessons.findIndex(
        (lesson) => lesson.chapterIndex === currentLesson.chapterIndex && lesson.subChapterIndex === currentLesson.subChapterIndex && lesson.lessonIndex === currentLesson.lessonIndex
      );
      if (index !== -1 && index < selectedLessons.length - 1) {
        localStorage.setItem("currentLesson", JSON.stringify(selectedLessons[index + 1]));
      } else {
        console.log("所有选定的课程已完成");
        alert("所有选定的课程已完成");
        localStorage.removeItem("isStartedLesson");
        localStorage.removeItem("watchedLessons");
        localStorage.removeItem("currentLesson");
        observer == null ? void 0 : observer.disconnect();
        localStorage.removeItem("selectedLessons");
      }
      const returnButton = document.querySelector(".video_rhead > a:nth-child(2)");
      if (returnButton) {
        returnButton.click();
      }
    }
    setInterval(checkVideoStatus, 1e3);
  }
  function restoreWatchedLessons() {
    const watchedLessons = JSON.parse(localStorage.getItem("watchedLessons") || "[]");
    const info = document.querySelector(".info");
    watchedLessons.forEach((lesson) => {
      const { chapterIndex, subChapterIndex, lessonIndex } = lesson;
      const checkbox = info == null ? void 0 : info.querySelector(
        `.lesson-checkbox[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"][data-lesson="${lessonIndex}"]`
      );
      if (checkbox) {
        checkbox.checked = true;
        updateParentCheckbox(chapterIndex, subChapterIndex);
        expandChapterAndSubChapter(chapterIndex, subChapterIndex);
      }
    });
  }
  function getSelectedLessons() {
    const selectedLessons = [];
    const lessonCheckboxes = document.querySelectorAll(".lesson-checkbox:checked");
    lessonCheckboxes.forEach((checkbox) => {
      const chapterIndex = checkbox.getAttribute("data-chapter");
      const subChapterIndex = checkbox.getAttribute("data-sub-chapter");
      const lessonIndex = checkbox.getAttribute("data-lesson");
      selectedLessons.push({ chapterIndex, subChapterIndex, lessonIndex });
    });
    return selectedLessons;
  }
  function getLessionCount() {
    const colum_items = document.querySelectorAll(".colum_item");
    const chapters = [];
    colum_items.forEach((colum_item) => {
      var _a, _b;
      const chapterTitle = ((_b = (_a = colum_item.querySelector(".clearfix.ptspread > .label > label")) == null ? void 0 : _a.textContent) == null ? void 0 : _b.trim()) || "未知章节";
      const subChapters = [];
      const catalog_items = colum_item.querySelectorAll(".catalog_item");
      catalog_items.forEach((catalog_item) => {
        var _a2, _b2;
        const subChapterTitle = ((_b2 = (_a2 = catalog_item.querySelector(".colum_menu > .label > label")) == null ? void 0 : _a2.textContent) == null ? void 0 : _b2.trim()) || "未知子章节";
        const lessons = [];
        const catalog_cmenu = catalog_item.querySelector(".catalog_cmenu");
        const lis = catalog_cmenu == null ? void 0 : catalog_cmenu.querySelectorAll("li");
        if (!(lis == null ? void 0 : lis.length)) {
          const videoCount = catalog_item.querySelectorAll(".catalog_child .catalog_icon").length;
          lessons.push({
            title: subChapterTitle,
            videoCount
          });
        } else {
          lis == null ? void 0 : lis.forEach((li) => {
            var _a3, _b3;
            const lessonTitle = ((_b3 = (_a3 = li.querySelector(".label > label")) == null ? void 0 : _a3.textContent) == null ? void 0 : _b3.trim()) || "未知课程";
            const videoCount = li.querySelectorAll(".catalog_child .catalog_icon").length;
            lessons.push({
              title: lessonTitle,
              videoCount
            });
          });
        }
        subChapters.push({
          title: subChapterTitle,
          lessons
        });
      });
      chapters.push({
        title: chapterTitle,
        subChapters
      });
    });
    return {
      total: chapters.length,
      chapters
    };
  }
  function listenListAppear() {
    let isListAppeared = false;
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes);
          const hasColumItem = addedNodes.some(
            (node) => {
              var _a;
              return (_a = node.classList) == null ? void 0 : _a.contains("colum_item");
            }
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
  function addDialogButtons(dialog) {
    const buttons = [
      { className: "check-all", text: "检查所有章节", onClick: () => {
        renderLessionCount(getLessionCount());
        restoreWatchedLessons();
      } },
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
      } },
      { className: "end-session", text: "结束刷课会话", onClick: () => {
        localStorage.removeItem("watchedLessons");
        localStorage.removeItem("currentLesson");
        localStorage.removeItem("isStartedLesson");
      } },
      { className: "toggle-watching", text: "暂停刷课", onClick: () => {
        localStorage.removeItem("isStartedLesson");
      } }
    ];
    buttons.forEach((button) => {
      const buttonElement = document.createElement("button");
      buttonElement.className = button.className;
      buttonElement.innerText = button.text;
      buttonElement.addEventListener("click", button.onClick);
      dialog.appendChild(buttonElement);
    });
  }
  function expandChapterAndSubChapter(chapterIndex, subChapterIndex) {
    const info = document.querySelector(".info");
    const chapterContent = info == null ? void 0 : info.querySelector(`.chapter-content[data-chapter="${chapterIndex}"]`);
    const subChapterContent = info == null ? void 0 : info.querySelector(
      `.sub-chapter-content[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
    );
    chapterContent == null ? void 0 : chapterContent.classList.remove("hidden");
    subChapterContent == null ? void 0 : subChapterContent.classList.remove("hidden");
    const chapterToggle = info == null ? void 0 : info.querySelector(`.toggle-chapter[data-chapter="${chapterIndex}"]`);
    const subChapterToggle = info == null ? void 0 : info.querySelector(
      `.toggle-sub-chapter[data-chapter="${chapterIndex}"][data-sub-chapter="${subChapterIndex}"]`
    );
    if (chapterToggle) chapterToggle.textContent = "▼";
    if (subChapterToggle) subChapterToggle.textContent = "▼";
  }
  function addDraggableFeature(dialog) {
    const header = dialog.querySelector(".dialog-header");
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    function dragStart(e) {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      if (e.target === header) {
        isDragging = true;
      }
    }
    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY, dialog);
      }
    }
    function dragEnd(_) {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
    }
    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }
    header.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
  }
  function addMinimizeFeature(dialog) {
    const minimizeButton = dialog.querySelector(".minimize-button");
    const dialogBody = dialog.querySelector(".dialog-body");
    let isMinimized = false;
    minimizeButton.addEventListener("click", () => {
      if (isMinimized) {
        dialogBody.style.display = "block";
        minimizeButton.textContent = "-";
      } else {
        dialogBody.style.display = "none";
        minimizeButton.textContent = "+";
      }
      isMinimized = !isMinimized;
    });
  }
  function consoleLicense() {
    console.log(
      "%c5Y Helper © Wibus%c\n%c发布于 AGPLv3 许可下。创建于 2024年10月22日",
      "color: #ff6b6b; font-size: 20px; font-weight: bold;",
      "",
      "color: #4ecdc4; font-style: italic;"
    );
  }
  function createDialog() {
    const dialog = document.createElement("div");
    dialog.className = "auto-study-dialog";
    dialog.innerHTML = createDialogContent();
    document.body.appendChild(dialog);
    addDialogButtons(dialog);
    addDraggableFeature(dialog);
    addMinimizeFeature(dialog);
  }
  function createDialogContent() {
    return `
    <div class="dialog-header">
      <h2>5y 学习平台. 自助上课助手</h2>
      <button class="minimize-button">-</button>
    </div>
    <div class="dialog-body">
      <p>这个平台奇奇怪怪的，我还要给你们抹屁股. 气死我了这个东西</p>
      <p>我一天的时间，就浪费在这个平台上了，气死我了。</p>
      <p>它的接口调用非常奇怪，我实在是不想花心思去读js了，直接模拟操作算了吧。</p>
      <p>作者: @wibus-wee</p>
      <div class="info"></div>
    </div>
  `;
  }
  listenListAppear();
  consoleLicense();
  console.trace = () => {
  };
  window.__5yAutoStudy__ = {
    tempStore: {
      lessions: {}
    }
  };
  createDialog();

})();