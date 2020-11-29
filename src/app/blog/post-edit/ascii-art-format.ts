import 'quill';

export interface QuillInstance {
  on: any;
  getText: any;
}

export default class AsciiArtFormat {
  quill: QuillInstance;
  constructor(quill, options) {
    this.quill = quill;

    this.quill.on('editor-change', () => {
      console.log('AsciiArtFormat sees change');
    });
  }
  blotName = 'ascii-art';
  tagName = 'testtag';
}
