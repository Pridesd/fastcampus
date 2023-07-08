class DatePicker {
  monthData = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  #calendarDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  selectedDate = {
    data: '',
    date: 0,
    month: 0,
    year: 0,
  };

  dateInputEl;
  datePickerEl;
  calendarEl;
  calendarMonthEl;
  monthContentEl;
  prevBtnEl;
  nextBtnEl;
  calendarDatesEl;

  constructor() {
    this.assignElement();
    this.initCalendarDate();
    this.initDateInput();
    this.addEvent();
  }

  initCalendarDate() {
    const data = new Date(); //현재 날짜 기반 저장
    const date = data.getDate();
    const month = data.getMonth(); //0부터 시작하는 거 유의
    const year = data.getFullYear();
    this.#calendarDate = {
      data,
      date,
      month,
      year,
    };
  }

  assignElement() {
    this.datePickerEl = document.getElementById('date-picker');
    this.dateInputEl = this.datePickerEl.querySelector('#date-input');
    this.calendarEl = this.datePickerEl.querySelector('#calendar');
    this.calendarMonthEl = this.calendarEl.querySelector('#month');
    this.monthContentEl = this.calendarMonthEl.querySelector('#content');
    this.prevBtnEl = this.calendarMonthEl.querySelector('#prev');
    this.nextBtnEl = this.calendarMonthEl.querySelector('#next');
    this.calendarDatesEl = this.calendarEl.querySelector('#dates');
  }

  initDateInput() {
    this.selectedDate = { ...this.#calendarDate };
    this.dateInputEl.textContent = this.formatingDate(this.selectedDate.data);
  }

  addEvent() {
    this.dateInputEl.addEventListener('click', this.toggleCalendar.bind(this));
    this.prevBtnEl.addEventListener('click', this.prevMonth.bind(this));
    this.nextBtnEl.addEventListener('click', this.nextMonth.bind(this));
    this.calendarDatesEl.addEventListener('click', this.onClickDate.bind(this));
  }
  formatingDate(dateData) {
    const year = dateData.getFullYear();
    let month = dateData.getMonth() + 1;
    if (month < 10) {
      month = `0${month}`;
    }
    let date = dateData.getDate();
    if (date < 10) {
      date = `0${date}`;
    }
    return `${year}/${month}/${date}`;
  }
  onClickDate(e) {
    this.calendarEl.querySelector('.selected')?.classList.remove('selected');
    this.selectedDate = {
      data: new Date(
        this.#calendarDate.year,
        this.#calendarDate.month,
        e.target.dataset.date,
      ),
      year: this.#calendarDate.year,
      month: this.#calendarDate.month,
      date: e.target.dataset.date,
    };
    this.dateInputEl.textContent = this.formatingDate(this.selectedDate.data);
    const selected = this.calendarDatesEl.querySelector(
      `[data-date='${this.selectedDate.date}']`,
    );
    selected.classList.add('selected');
    this.calendarEl.classList.remove('active');
  }

  toggleCalendar() {
    if (this.calendarEl.classList.contains('active')) {
      this.#calendarDate = { ...this.selectedDate };
    }
    this.calendarEl.classList.toggle('active');
    this.updateMonth();
    this.updateDates();
    if (
      this.selectedDate.year === this.#calendarDate.year &&
      this.selectedDate.month === this.#calendarDate.month
    ) {
      const selected = this.calendarDatesEl.querySelector(
        `[data-date='${this.selectedDate.date}']`,
      );
      selected.classList.add('selected');
    }
  }
  nextMonth() {
    this.#calendarDate.month++;
    if (this.#calendarDate.month >= 12) {
      this.#calendarDate.month = 0;
      this.year++;
    }
    this.updateMonth();
    this.updateDates();
  }
  prevMonth() {
    this.#calendarDate.month--;
    if (this.#calendarDate.month < 0) {
      this.#calendarDate.month = 11;
      this.#calendarDate.year--;
    }
    this.updateMonth();
    this.updateDates();
  }
  updateMonth() {
    this.monthContentEl.textContent = `${this.#calendarDate.year} ${
      this.monthData[this.#calendarDate.month]
    }`;
  }
  updateDates() {
    this.calendarDatesEl.innerHTML = '';
    //그 해당 월이 몇 일까지 있는지 알 수 있음
    const numOfDates = new Date(
      this.#calendarDate.year,
      this.#calendarDate.month + 1,
      0,
    ).getDate();
    const fragment = new DocumentFragment();
    for (let i = 1; i <= numOfDates; i++) {
      const date = document.createElement('div');
      date.classList.add('date');
      date.textContent = i;
      date.dataset.date = i;
      fragment.appendChild(date);
    }
    fragment.firstChild.style.gridColumnStart =
      //getDay를 통해 요일에 대한 인덱스를 받을 수 있음
      new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay() +
      1;
    this.calendarDatesEl.appendChild(fragment);
    this.colorSaturday();
    this.colorSunday();
    this.markToday();
  }

  markToday() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const today = currentDate.getDate();
    if (
      currentYear === this.#calendarDate.year &&
      currentMonth === this.#calendarDate.month
    ) {
      const todayEl = this.calendarDatesEl.querySelector(
        `.date:nth-child(${today})`,
      );
      todayEl.classList.add('today');
    }
  }

  colorSaturday() {
    const saturdayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        7 -
        new Date(this.#calendarDate.year, this.#calendarDate.month, 1).getDay()
      })`,
    );
    for (let i = 0; i < saturdayEls.length; i++) {
      saturdayEls[i].style.color = 'blue';
    }
  }
  colorSunday() {
    const sundayEls = this.calendarDatesEl.querySelectorAll(
      `.date:nth-child(7n+${
        (8 -
          new Date(
            this.#calendarDate.year,
            this.#calendarDate.month,
            1,
          ).getDay()) %
        7
      })`,
    );
    for (let i = 0; i < sundayEls.length; i++) {
      sundayEls[i].style.color = 'red';
    }
  }
}

new DatePicker();
