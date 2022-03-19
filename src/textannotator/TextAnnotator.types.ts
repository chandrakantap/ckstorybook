export interface Token {
  tokenId: string;
  text: string;
  offset: number;
  labelName?: string;
}

export interface Label {
  name: string;
  color: string;
  fontColor: string;
}
