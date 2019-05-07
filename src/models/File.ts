export default class File {
  id: number
  title: string
  path: string
  createdAt: number
  updatedAt: number
  extension: string
  size: number
  type: string

  constructor(id: number, title: string, path: string, createdAt: number, updatedAt: number, extension: string, size: number, type: string) {
    this.id = id
    this.title = title
    this.path = path
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.extension = extension
    this.size = size
    this.type = type
  }

  sizeInMB() : string {
    return  (this.size / (1024 ^ 2)).toFixed(1)
  }

  getSize(): string {
    let decimals = 1
    if (this.size === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(this.size) / Math.log(k));

    return parseFloat((this.size / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getCreationDatetime() : string {
    return new Date(this.createdAt * 1000).toLocaleString()
  }

  getUpdateDatetime() : string {
    return new Date(this.updatedAt * 1000).toLocaleString()
  }
}