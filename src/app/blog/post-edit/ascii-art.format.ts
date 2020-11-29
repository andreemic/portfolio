import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
let Block = Quill.import('blots/inline');

export class AsciiArtFormat extends Block {
  constructor() {
    super();
    this.blotName = 'ascii-art';
    this.tagName = 'section';
    this.className = 'ascii-art';
  }
  create(value: any) {
    console.log(value);
    return value;
  }
  static formats(domNode: HTMLElement) {
    console.log(domNode);
    return this.tagName;
  }
}

export function asciiArtBtnHandler() {
  console.log(this);
  this.quill.format('ascii-art');
}
