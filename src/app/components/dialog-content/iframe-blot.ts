/*
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed') as any;

class IframeBlot extends BlockEmbed {
  static blotName = 'iframe';
  static tagName = 'iframe';
  static className = 'ql-iframe';

  static create(value: string) {
    let node: any = super.create();
    node.setAttribute('src', value);
    node.setAttribute('frameborder', '0');
    node.setAttribute('allowfullscreen', true);
    node.style.width = '100%';
    node.style.height = '315px';
    return node;
  }

  static value(node: any) {
    return node.getAttribute('src');
  }
}

Quill.register(IframeBlot);
*/