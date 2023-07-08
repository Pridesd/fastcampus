console.log('ddd');
class DrawingBoard {
  MODE = 'NONE'; //NONE, BRUSH, ERASER 3개의 상태가 존재
  IsMouseDown = false;
  IsNav = false;
  eraserColor = '#FFFFFF';
  backgroundColor = '#FFFFFF';
  imgRecord = [];

  containerEl;
  canvasEl;
  toolBarEL;
  brushEl;
  colorPickerEl;
  brushPanelEl;
  brushSizeEl;
  brushSizePreviewEl;
  eraserEl;
  navigatorEl;
  imgNavEl;
  canvasImgEl;
  undoEl;
  clearEl;
  downloadEl;
  constructor() {
    this.assignElement();
    this.initContext();
    this.initCanvasBackground();
    this.addEvent();
  }
  assignElement() {
    this.containerEl = document.getElementById('container');
    this.canvasEl = this.containerEl.querySelector('#canvas');
    this.toolBarEL = this.containerEl.querySelector('#toolbar');
    this.brushEl = this.toolBarEL.querySelector('#brush');
    this.colorPickerEl = this.toolBarEL.querySelector('#colorPicker');
    this.brushPanelEl = this.containerEl.querySelector('#brushPanel');
    this.brushSizeEl = this.brushPanelEl.querySelector('#brushSize');
    this.brushSizePreviewEl =
      this.brushPanelEl.querySelector('#brushSizePreview');
    this.eraserEl = this.toolBarEL.querySelector('#eraser');
    this.navigatorEl = this.toolBarEL.querySelector('#navigator');
    this.imgNavEl = this.containerEl.querySelector('#imgNav');
    this.canvasImgEl = this.imgNavEl.querySelector('#canvasImg');
    this.undoEl = this.toolBarEL.querySelector('#undo');
    this.clearEl = this.toolBarEL.querySelector('#clear');
    this.downloadEl = this.toolBarEL.querySelector('#download');
  }
  initContext() {
    this.context = this.canvasEl.getContext('2d');
    //캔버스에 작업을 하기 위해선 context를 가지고 와야함
    //캔버스에 2d를 구현하기 위해서
  }

  initCanvasBackground() {
    this.context.fillStyle = this.backgroundColor; //캔버스 배경색 지정
    this.context.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height); //캔버스 기준으로 0,0부터 너비 높이만큼 사각형을 지정
  }
  addEvent() {
    this.brushEl.addEventListener('click', this.onClickBrush.bind(this));
    this.canvasEl.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvasEl.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasEl.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvasEl.addEventListener('mouseout', this.onMouseOut.bind(this));
    this.brushSizeEl.addEventListener(
      'input',
      this.onChangeBrushSize.bind(this),
    );
    this.colorPickerEl.addEventListener('input', this.onChangeColor.bind(this));
    this.eraserEl.addEventListener('click', this.onClickEraser.bind(this));
    this.navigatorEl.addEventListener(
      'click',
      this.onClickNavigator.bind(this),
    );
    this.undoEl.addEventListener('click', this.onClickUndo.bind(this));
    this.clearEl.addEventListener('click', this.onClickClear.bind(this));
    this.downloadEl.addEventListener('click', this.onClickDownload.bind(this));
  }

  onClickDownload() {
    this.downloadEl.href = this.canvasEl.toDataURL('image/jpeg', 1); //데이터 형식, 품질
    this.downloadEl.download = 'example.jpeg';
  }

  onClickClear() {
    this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
    this.imgRecord = [];
    this.updateNavigator();
    this.initCanvasBackground();
  }

  onClickUndo() {
    if (this.imgRecord.length === 0) {
      alert('더이상 뒤로 갈 수 없습니다.');
      return;
    }
    let prevUrl = this.imgRecord.pop();
    let prevImg = new Image();
    prevImg.onload = () => {
      this.context.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.context.drawImage(
        prevImg,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
        0,
        0,
        this.canvasEl.width,
        this.canvasEl.height,
      ); //이미지, 기준점, 그릴 크기, 바탕이 되는 기준점, 바탕 크기
    }; //이미지가 확실히 로드되었을 때 사용
    prevImg.src = prevUrl;
  }

  saveState() {
    if (this.imgRecord.length > 4) {
      this.imgRecord.shift();
      this.imgRecord.push(this.canvasEl.toDataURL());
    } else this.imgRecord.push(this.canvasEl.toDataURL());
  }

  onClickNavigator(e) {
    this.IsNav = this.IsNav ? false : true;
    this.navigatorEl.classList.toggle('active');
    this.imgNavEl.classList.toggle('hide');
    this.updateNavigator();
  }

  updateNavigator() {
    this.canvasImgEl.src = this.canvasEl.toDataURL(); //
  }

  onClickEraser(e) {
    const isActive = e.currentTarget.classList.contains('active');
    this.MODE = isActive ? 'NONE' : 'ERASE';
    this.canvasEl.style.cursor = isActive ? 'default' : 'crosshair';
    this.eraserEl.classList.toggle('active');
    this.brushPanelEl.classList.add('hide');
    this.brushEl.classList.remove('active');
  }

  onClickBrush(e) {
    const isActive = e.currentTarget.classList.contains('active');
    this.MODE = isActive ? 'NONE' : 'BRUSH';
    this.canvasEl.style.cursor = isActive ? 'default' : 'crosshair';
    this.brushEl.classList.toggle('active');
    this.brushPanelEl.classList.toggle('hide');
    this.eraserEl.classList.remove('active');
  }
  onMouseDown(e) {
    if (this.MODE === 'NONE') return;
    this.IsMouseDown = true;
    const currentPosition = this.getMousPosition(e); //캔버스 기준 x, y좌표를 구하는 로직

    //설명용
    this.context.beginPath(); //경로를 시작하겠다.
    this.context.moveTo(currentPosition.x, currentPosition.y); //펜의 위치를 x,y로 움직여줘
    this.context.lineCap = 'round'; //라인 끝을 둥글게
    if (this.MODE === 'BRUSH') {
      this.context.strokeStyle = this.colorPickerEl.value; //라인의 색깔
      this.context.lineWidth = this.brushSizeEl.value; //라인 두께
    } else {
      this.context.strokeStyle = this.eraserColor; //배경색으로 덮어버림
      this.context.lineWidth = 20;
    }
    // this.context.lineTo(400, 400); //캔버스 기준으로 이만큼 선을 움직여줘
    // this.context.stroke(); //그려줘
    this.saveState();
  }

  onMouseUp() {
    if (this.MODE === 'NONE') return;
    this.IsMouseDown = false;

    if (this.IsNav) this.updateNavigator();
  }
  onMouseOut() {
    if (this.MODE === 'NONE') return;
    this.IsMouseDown = false;
    if (this.IsNav) this.updateNavigator();
  }

  onMouseMove(e) {
    if (!this.IsMouseDown) return;
    const currentPosition = this.getMousPosition(e);
    this.context.lineTo(currentPosition.x, currentPosition.y);
    this.context.stroke();
  }

  getMousPosition(e) {
    const boundaries = this.canvasEl.getBoundingClientRect();
    return {
      x: e.clientX - boundaries.left,
      y: e.clientY - boundaries.top,
    };
  }
  onChangeBrushSize(e) {
    this.brushSizePreviewEl.style.width = `${e.target.value}px`;
    this.brushSizePreviewEl.style.height = `${e.target.value}px`;
  }
  onChangeColor(e) {
    this.brushSizePreviewEl.style.backgroundColor = e.target.value;
  }
}

new DrawingBoard();
