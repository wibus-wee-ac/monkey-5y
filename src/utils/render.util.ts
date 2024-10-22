import { addEventListeners } from "./event-listener.util";
import { restoreWatchedLessons } from "./lessons.util";

// 渲染章节内容
export function renderChapterContent(chapter: any, chapterIndex: number) {
  return `
    <h4 class="info-chapter-title">
      <input type="checkbox" class="chapter-checkbox" data-chapter="${chapterIndex}">
      <span class="toggle-chapter" data-chapter="${chapterIndex}">▶</span>
      ${chapter.title || "未知章节"}
    </h4>
    <div class="chapter-content hidden" data-chapter="${chapterIndex}">
      ${chapter.subChapters && chapter.subChapters.length > 0
        ? chapter.subChapters.map((subChapter: any, subChapterIndex: number) => 
            renderSubChapterContent(subChapter, chapterIndex, subChapterIndex)
          ).join('')
        : "<p>没有子章节</p>"
      }
    </div>
  `;
}

// 渲染子章节内容
export function renderSubChapterContent(subChapter: any, chapterIndex: number, subChapterIndex: number) {
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

// 渲染课程列表
export function renderLessonList(lessons: any[], chapterIndex: number, subChapterIndex: number) {
  if (!lessons || lessons.length === 0) {
    return "<li>没有课程</li>";
  }
  return lessons.map((lesson: any, lessonIndex: number) => `
    <li>
      <input type="checkbox" class="lesson-checkbox" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}" data-lesson="${lessonIndex}">
      ${lesson.title || "未知课程"}
      <span class="lesson-video-count">(视频数: ${lesson.videoCount || 0})</span>
      <div class="catalog_child" data-chapter="${chapterIndex}" data-sub-chapter="${subChapterIndex}" data-lesson="${lessonIndex}">
        ${lesson.videoLinks && lesson.videoLinks.length > 0
          ? lesson.videoLinks.map((link: string) => `
              <nobr><a class="catalog_icon" onclick="${link}">${link}</a></nobr>
            `).join('')
          : ""
        }
      </div>
    </li>
  `).join('');
}

export function renderLessionCount(lessionCount: any) {
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
    ${chapters.length > 0
      ? chapters.map((chapter: any, chapterIndex: number) => renderChapterContent(chapter, chapterIndex)).join('')
      : "<p>没有章节</p>"
    }
  `;

  addEventListeners(info);
  restoreWatchedLessons();
}
