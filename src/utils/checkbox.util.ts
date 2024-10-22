export function updateParentCheckbox(
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
