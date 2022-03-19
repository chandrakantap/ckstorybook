export interface Token {
  tokenId: string;
  text: string;
  offset: number;
  labelName?: string;
}
export interface AnnotationResult {
  tokenId: string;
  labelName: string;
  startPosition: number;
  endPosition: number;
  text: string;
}

export interface Label {
  name: string;
  color: string;
  fontColor: string;
}
