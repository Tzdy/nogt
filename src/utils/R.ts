export class R<T> {
  code = 20000;
  message = 'ok';
  data: T;

  constructor(data: T, code = 20000, message = 'ok') {
    this.data = data;
    this.code = code;
    this.message = message;
  }

  static OK<T>(data?: T) {
    return new R<T>(data);
  }
}
