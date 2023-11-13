export interface FileType {
  name: string
}

export interface FileListType {
  files: FileType[]
}

export interface UrlUploadResponseType {
  url: string
  newUrl: string
}
