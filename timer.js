export class Timer {
  interval = null;
  timeStart = null;
  _isRunning = false;
  _intervalMs = 100;

  get isRunning() {
    return this._isRunning;
  }

  constructor({ intervalMs } = { intervalMs: 100 }) {
    //
    this._intervalMs = intervalMs;
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
    this.interval = setInterval(() => this._timerInterval(), this._intervalMs);
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
