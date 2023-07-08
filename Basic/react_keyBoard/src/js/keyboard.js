export class Keyboard {
  #swichEl;
  #containerEl;
  #fontEl;
  #keyboardEl;
  #inputGroupEl;
  #inputEl;
  #keyEl;
  #keyPress = false;
  #mouseDown = false;
  constructor() {
    this.#assignElement();
    this.#addEvent();
  }
  #assignElement() {
    this.#containerEl = document.getElementById("container");
    this.#swichEl = this.#containerEl.querySelector("#switch");
    this.#fontEl = this.#containerEl.querySelector("#font");
    this.#keyboardEl = this.#containerEl.querySelector(".keyboard");
    this.#inputGroupEl = this.#containerEl.querySelector("#input-group");
    this.#inputEl = this.#inputGroupEl.querySelector("#input");
  }
  #addEvent() {
    this.#swichEl.addEventListener("change", this.#onChangeTheme);
    this.#fontEl.addEventListener("change", this.#onChangeFont);
    document.addEventListener("keydown", this.#onKeydown.bind(this)); //bind를 통해 클래스의 this를 바라보도록 함
    document.addEventListener("keyup", this.#onKeyUp.bind(this));
    this.#inputEl.addEventListener("input", this.#onInput.bind(this));
    this.#keyboardEl.addEventListener(
      "mousedown",
      this.#onMouseDown.bind(this)
    );
    document.addEventListener("mouseup", this.#onMouseUp.bind(this));
  }
  #onChangeTheme(e) {
    document.documentElement.setAttribute(
      "theme",
      e.target.checked ? "dark-mode" : ""
    );
  }
  #onChangeFont(e) {
    document.body.style.fontFamily = e.target.value;
  }
  #onKeydown(e) {
    //   console.log(e.key, /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(e.key));// /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/이거는 한글 정규식 test를 통해 한글이 입력됐는지 확인
    if (!this.#mouseDown) {
      this.#inputGroupEl.classList.toggle("error", e.key === "Process"); //bind가 없을 경우 window에서 찾기 때문에 오류가 발생함
      this.#keyboardEl
        .querySelector(`[data-code=${e.code}]`)
        ?.classList.add("active"); //?를 옵셔널 채이닝이라고 함 해당 값이 존재할 때만 다음 함수를 실행
      this.#keyPress = true;
    }
  }
  #onKeyUp(e) {
    if (!this.#mouseDown) {
      this.#keyboardEl
        .querySelector(`[data-code=${e.code}]`)
        ?.classList.remove("active");
      this.#keyPress = false;
    }
  }
  #onInput(e) {
    e.target.value = e.target.value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/, "");
  }
  #onMouseDown(e) {
    if (!this.#keyPress) {
      this.#mouseDown = true;
      e.target.closest("div.key")?.classList.add("active"); //본인을 포함하여 조상중에 해당하는 값이 있는지 찾음
    }
  }
  #onMouseUp(e) {
    if (!this.#keyPress) {
      this.#mouseDown = false;
      const keyEl = e.target.closest("div.key");
      const isActive = !!keyEl?.classList.contains("active"); //!!를 취급하므로서 불리안 값으로 변경
      const val = keyEl?.dataset.val; //data-val => dataset.val
      if (isActive && !!val) {
        if (val === "Space") {
          this.#inputEl.value += " ";
        } else if (val === "Backspace") {
          this.#inputEl.value = this.#inputEl.value.slice(0, -1);
        } else {
          this.#inputEl.value += val;
        }
      }
      this.#keyboardEl.querySelector(".active")?.classList.remove("active");
    }
  }
}
