export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Recurso nao encontrado') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}
