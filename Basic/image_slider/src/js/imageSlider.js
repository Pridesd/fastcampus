export default class Slider {
  #currentPosition = 0; // 현재 몇 번째 슬라이드에 위치했는지

  #slideNumber = 0; // 슬라이드 개수

  #slideWidth = 0; // 슬라이드 너비

  sliderListEl;

  sliderWrapEl;

  nextBtnEl;

  previousBtnEl;

  indicatorWrapEl;

  indicatorListEl;

  controlWrapEL;

  intervalId;

  isInterval = true;

  constructor() {
    this.assignElement();
    this.initSliderNumber();
    this.initSlideWidth();
    this.initSliderListWidth();
    this.autoSlider();
    this.addEvent();
    this.createIndicator();
    this.setIndicator();
  }

  assignElement() {
    this.sliderWrapEl = document.getElementById("slider-wrap");
    this.sliderListEl = this.sliderWrapEl.querySelector("#slider");
    this.nextBtnEl = this.sliderWrapEl.querySelector("#next");
    this.previousBtnEl = this.sliderWrapEl.querySelector("#previous");

    this.indicatorWrapEl = document.getElementById("indicator-wrap");
    this.indicatorListEl = this.indicatorWrapEl.querySelector("ul");
    this.controlWrapEL = this.sliderWrapEl.querySelector("#control-wrap");
  }

  initSliderNumber() {
    this.#slideNumber = this.sliderListEl.querySelectorAll("li").length;
  }

  initSlideWidth() {
    this.#slideWidth = this.sliderWrapEl.clientWidth;
  }

  initSliderListWidth() {
    this.sliderListEl.style.width = `${this.#slideNumber * this.#slideWidth}px`;
  }

  addEvent() {
    this.nextBtnEl.addEventListener("click", this.moveToRight.bind(this));
    this.previousBtnEl.addEventListener("click", this.moveToLeft.bind(this));
    this.indicatorWrapEl.addEventListener(
      "click",
      this.onClickIndicator.bind(this)
    );
    this.controlWrapEL.addEventListener(
      "click",
      this.onClickControlBtn.bind(this)
    );
  }

  moveToRight() {
    // 0 = 0 , 1 = -1000, 2 = -2000, 3 = -3000, 4 = -4000, 5 = -5000, 6 = -6000
    this.#currentPosition += 1;
    if (this.#currentPosition > this.#slideNumber - 1) {
      this.#currentPosition = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPosition
    }px`;
    if (this.isInterval) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.moveToRight.bind(this), 3000);
    }
    this.setIndicator();
  }

  moveToLeft() {
    // 0 = 0 , 1 = -1000, 2 = -2000, 3 = -3000, 4 = -4000, 5 = -5000, 6 = -6000
    this.#currentPosition -= 1;
    if (this.#currentPosition < 0) {
      this.#currentPosition = this.#slideNumber - 1;
    }
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPosition
    }px`;
    if (this.isInterval) {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(this.moveToRight.bind(this), 3000);
    }
    this.setIndicator();
  }

  createIndicator() {
    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#slideNumber; i += 1) {
      const li = document.createElement("li");
      li.dataset.index = i;
      docFragment.appendChild(li);
    }
    this.indicatorListEl.appendChild(docFragment);
  }

  setIndicator() {
    this.indicatorWrapEl.querySelector("li.active")?.classList.remove("active");
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPosition + 1})`)
      .classList.add("active");
  }

  onClickIndicator(e) {
    this.#currentPosition = parseInt(e.target.dataset.index, 10)
      ? parseInt(e.target.dataset.index, 10)
      : this.#currentPosition;
    this.sliderListEl.style.left = `-${
      this.#slideWidth * this.#currentPosition
    }px`;
    this.setIndicator();
  }

  autoSlider() {
    this.intervalId = setInterval(() => {
      this.#currentPosition += 1;
      if (this.#currentPosition >= this.#slideNumber) {
        this.#currentPosition = 0;
      }
      this.sliderListEl.style.left = `-${
        this.#slideWidth * this.#currentPosition
      }px`;
      this.setIndicator();
    }, 3000);
  }

  onClickControlBtn(e) {
    if (e.target.dataset.status === "pause") {
      this.isInterval = false;
      this.controlWrapEL.classList.remove("play");
      this.controlWrapEL.classList.add("pause");
      clearInterval(this.intervalId);
    } else {
      this.isInterval = true;
      this.autoSlider();
      this.controlWrapEL.classList.remove("pause");
      this.controlWrapEL.classList.add("play");
    }
  }
}
