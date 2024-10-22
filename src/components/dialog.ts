import { addDialogButtons } from "../utils/dialog.util";
import { addDraggableFeature } from "../utils/draggable.util";
import { listenListAppear } from "../utils/lessons.util";

export function createDialog() {
  const dialog = document.createElement("div");
  dialog.className = "auto-study-dialog";
  dialog.innerHTML = createDialogContent();
  document.body.appendChild(dialog);

  addDialogButtons(dialog);
  addDraggableFeature(dialog);
}

function createDialogContent() {
  return `
    <div class="dialog-header">
      <h2>5y 学习平台. 自助上课助手</h2>
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