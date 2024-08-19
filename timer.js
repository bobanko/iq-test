export class Timer {
  interval = null;
  timeStart = null;
  _isRunning = false;

  get isRunning() {
    return this._isRunning;
  }

  constructor() {
    //
  }

  handlers = [];

  onUpdate(handler) {
    this.handlers.push(handler);
  }

  removeOnUpdate(handler) {
    // todo(vmyshko): impl
  }

  _timerInterval() {
    const diff = this.getDiff();

    this.handlers.forEach((handler) => {
      handler(diff);
    });
  }

  start() {
    this._isRunning = true;
    clearInterval(this.interval);
    this.timeStart = new Date().getTime();

    // todo(vmyshko): mb increase update rate?
    this.interval = setInterval(() => this._timerInterval(), 1000);
    this._timerInterval(); //first intstant run
  }

  stop() {
    this._isRunning = false;
    this._timerInterval(); //last intstant run
    clearInterval(this.interval);
  }

  getDiff() {
    const timeNow = new Date().getTime();
    const diff = timeNow - this.timeStart;
    return diff;
  }
}
