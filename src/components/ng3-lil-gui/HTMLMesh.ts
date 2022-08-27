import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  sRGBEncoding,
  Color
} from 'three';

// copied from https://github.com/mrdoob/three.js/tree/master/examples/jsm/interactive until available in three-stdlib

class HTMLMesh extends Mesh {
  public dispose = () => { }

  constructor(dom: any) {

    const texture = new HTMLTexture(dom);

    const geometry = new PlaneGeometry(texture.image.width * 0.001, texture.image.height * 0.001);
    const material = new MeshBasicMaterial({ map: texture, toneMapped: false, transparent: true });

    super(geometry, material);

    const onEvent = (event: any) => {

      texture.dispatchDOMEvent(event);

    }

    this.addEventListener('mousedown', onEvent);
    this.addEventListener('mousemove', onEvent);
    this.addEventListener('mouseup', onEvent);
    this.addEventListener('click', onEvent);

    this.dispose = () => {

      geometry.dispose();
      material.dispose();

      texture.dispose();

      this.removeEventListener('mousedown', onEvent);
      this.removeEventListener('mousemove', onEvent);
      this.removeEventListener('mouseup', onEvent);
      this.removeEventListener('click', onEvent);

    };

  }

}

class HTMLTexture extends CanvasTexture {
  private scheduleUpdate: any;
  private observer: any;

  constructor(private dom: any) {

    super(new html2canvas().get(dom));

    this.dom = dom;

    this.anisotropy = 16;
    this.encoding = sRGBEncoding;
    this.minFilter = LinearFilter;
    this.magFilter = LinearFilter;

    // Create an observer on the DOM, and run html2canvas update in the next loop
    const observer = new MutationObserver(() => {

      if (!this.scheduleUpdate) {

        // ideally should use xr.requestAnimationFrame, here setTimeout to avoid passing the renderer
        this.scheduleUpdate = setTimeout(() => this.update(), 16);

      }

    });

    const config = { attributes: true, childList: true, subtree: true, characterData: true };
    observer.observe(dom, config);

    this.observer = observer;

  }

  dispatchDOMEvent(event: any) {

    if (event.data) {

      this.htmlevent(this.dom, event.type, event.data.x, event.data.y);

    }

  }

  htmlevent(element: any, event: any, x: number, y: number) {

    const mouseEventInit = {
      clientX: (x * element.offsetWidth) + element.offsetLeft,
      clientY: (y * element.offsetHeight) + element.offsetTop,
      view: element.ownerDocument.defaultView
    };

    window.dispatchEvent(new MouseEvent(event, mouseEventInit));

    const rect = element.getBoundingClientRect();

    x = x * rect.width + rect.left;
    y = y * rect.height + rect.top;

    function traverse(element: any) {

      if (element.nodeType !== Node.TEXT_NODE && element.nodeType !== Node.COMMENT_NODE) {

        const rect = element.getBoundingClientRect();

        if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {

          element.dispatchEvent(new MouseEvent(event, mouseEventInit));

          if (element instanceof HTMLInputElement && element.type === 'range' && (event === 'mousedown' || event === 'click')) {

            const [min, max] = ['min', 'max'].map(property => parseFloat((element as any)[property]));

            const width = rect.width;
            const offsetX = x - rect.x;
            const proportion = offsetX / width;
            element.value = (min + (max - min) * proportion).toString();
            element.dispatchEvent(new InputEvent('input', { bubbles: true }));

          }

        }

        for (let i = 0; i < element.childNodes.length; i++) {

          traverse(element.childNodes[i]);

        }

      }

    }

    traverse(element);

  }

  update() {

    this.image = new html2canvas().get(this.dom);
    this.needsUpdate = true;

    this.scheduleUpdate = null;

  }

  override dispose() {

    if (this.observer) {

      this.observer.disconnect();

    }

    this.scheduleUpdate = clearTimeout(this.scheduleUpdate);

    super.dispose();

  }

}

class Clipper {

  private clips: Array<any> = [];
  private isClipping = false;

  constructor(private context: any) { }

  doClip() {

    if (this.isClipping) {

      this.isClipping = false;
      this.context.restore();

    }

    if (this.clips.length === 0) return;

    let minX = - Infinity, minY = - Infinity;
    let maxX = Infinity, maxY = Infinity;

    for (let i = 0; i < this.clips.length; i++) {

      const clip = this.clips[i];

      minX = Math.max(minX, clip.x);
      minY = Math.max(minY, clip.y);
      maxX = Math.min(maxX, clip.x + clip.width);
      maxY = Math.min(maxY, clip.y + clip.height);

    }

    this.context.save();
    this.context.beginPath();
    this.context.rect(minX, minY, maxX - minX, maxY - minY);
    this.context.clip();

    this.isClipping = true;

  }

  add(clip: any) {

    this.clips.push(clip);
    this.doClip();

  }

  remove() {

    this.clips.pop();
    this.doClip();

  }
}

class html2canvas {
  static canvases = new WeakMap();

  private range = document.createRange();
  private color = new Color();

  private context: any;
  private offset: any;
  private clipper: any;

  get(element: any): HTMLCanvasElement {

    this.offset = element.getBoundingClientRect();

    let canvas;

    if (html2canvas.canvases.has(element)) {

      canvas = html2canvas.canvases.get(element);

    } else {

      canvas = document.createElement('canvas');
      canvas.width = this.offset.width;
      canvas.height = this.offset.height;

      html2canvas.canvases.set(element, canvas);
    }

    this.context = canvas.getContext('2d'/*, { alpha: false }*/);

    this.clipper = new Clipper(this.context);

    // console.time( 'drawElement' );

    this.drawElement(element);

    // console.timeEnd( 'drawElement' );

    return canvas;
  }



  drawText(style: any, x: number, y: number, text: string) {

    if (text !== '') {

      if (style.textTransform === 'uppercase') {

        text = text.toUpperCase();

      }

      this.context.font = style.fontWeight + ' ' + style.fontSize + ' ' + style.fontFamily;
      this.context.textBaseline = 'top';
      this.context.fillStyle = style.color;
      this.context.fillText(text, x, y + parseFloat(style.fontSize) * 0.1);

    }

  }

  buildRectPath(x: number, y: number, w: number, h: number, r: number) {

    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;

    this.context.beginPath();
    this.context.moveTo(x + r, y);
    this.context.arcTo(x + w, y, x + w, y + h, r);
    this.context.arcTo(x + w, y + h, x, y + h, r);
    this.context.arcTo(x, y + h, x, y, r);
    this.context.arcTo(x, y, x + w, y, r);
    this.context.closePath();

  }

  drawBorder(style: any, which: any, x: number, y: number, width: number, height: number) {

    const borderWidth = style[which + 'Width'];
    const borderStyle = style[which + 'Style'];
    const borderColor = style[which + 'Color'];

    if (borderWidth !== '0px' && borderStyle !== 'none' && borderColor !== 'transparent' && borderColor !== 'rgba(0, 0, 0, 0)') {

      this.context.strokeStyle = borderColor;
      this.context.lineWidth = parseFloat(borderWidth);
      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(x + width, y + height);
      this.context.stroke();

    }

  }

  drawElement(element: HTMLInputElement, style?: any) {

    let x = 0, y = 0, width = 0, height = 0;

    if (element.nodeType === Node.TEXT_NODE) {

      // text

      this.range.selectNode(element);

      const rect = this.range.getBoundingClientRect();

      x = rect.left - this.offset.left - 0.5;
      y = rect.top - this.offset.top - 0.5;
      width = rect.width;
      height = rect.height;

      let nodeValue = '';
      if (element.nodeValue) nodeValue = element.nodeValue.trim();

      this.drawText(style, x, y, nodeValue);

    } else if (element.nodeType === Node.COMMENT_NODE) {

      return;

    } else if (element instanceof HTMLCanvasElement) {

      // Canvas element
      if (element.style.display === 'none') return;

      this.context.save();
      const dpr = window.devicePixelRatio;
      this.context.scale(1 / dpr, 1 / dpr);
      this.context.drawImage(element, 0, 0);
      this.context.restore();

    } else {

      if (element.style.display === 'none') return;

      const rect = element.getBoundingClientRect();

      x = rect.left - this.offset.left - 0.5;
      y = rect.top - this.offset.top - 0.5;
      width = rect.width;
      height = rect.height;

      style = window.getComputedStyle(element);

      // Get the border of the element used for fill and border

      this.buildRectPath(x, y, width, height, parseFloat(style.borderRadius));

      const backgroundColor = style.backgroundColor;

      if (backgroundColor !== 'transparent' && backgroundColor !== 'rgba(0, 0, 0, 0)') {

        this.context.fillStyle = backgroundColor;
        this.context.fill();

      }

      // If all the borders match then stroke the round rectangle

      const borders = ['borderTop', 'borderLeft', 'borderBottom', 'borderRight'];

      let match = true;
      let prevBorder = null;

      for (const border of borders) {

        if (prevBorder !== null) {

          match = (style[border + 'Width'] === style[prevBorder + 'Width']) &&
            (style[border + 'Color'] === style[prevBorder + 'Color']) &&
            (style[border + 'Style'] === style[prevBorder + 'Style']);

        }

        if (match === false) break;

        prevBorder = border;

      }

      if (match === true) {

        // They all match so stroke the rectangle from before allows for border-radius

        const width = parseFloat(style.borderTopWidth);

        if (style.borderTopWidth !== '0px' && style.borderTopStyle !== 'none' && style.borderTopColor !== 'transparent' && style.borderTopColor !== 'rgba(0, 0, 0, 0)') {

          this.context.strokeStyle = style.borderTopColor;
          this.context.lineWidth = width;
          this.context.stroke();

        }

      } else {

        // Otherwise draw individual borders

        this.drawBorder(style, 'borderTop', x, y, width, 0);
        this.drawBorder(style, 'borderLeft', x, y, 0, height);
        this.drawBorder(style, 'borderBottom', x, y + height, width, 0);
        this.drawBorder(style, 'borderRight', x + width, y, 0, height);

      }

      if (element instanceof HTMLInputElement) {

        let accentColor = style.accentColor;

        if (accentColor === undefined || accentColor === 'auto') accentColor = style.color;

        this.color.set(accentColor);

        const luminance = Math.sqrt(0.299 * (this.color.r ** 2) + 0.587 * (this.color.g ** 2) + 0.114 * (this.color.b ** 2));
        const accentTextColor = luminance < 0.5 ? 'white' : '#111111';

        if (element.type === 'radio') {

          this.buildRectPath(x, y, width, height, height);

          this.context.fillStyle = 'white';
          this.context.strokeStyle = accentColor;
          this.context.lineWidth = 1;
          this.context.fill();
          this.context.stroke();

          if (element.checked) {

            this.buildRectPath(x + 2, y + 2, width - 4, height - 4, height);

            this.context.fillStyle = accentColor;
            this.context.strokeStyle = accentTextColor;
            this.context.lineWidth = 2;
            this.context.fill();
            this.context.stroke();

          }

        }

        if (element.type === 'checkbox') {

          this.buildRectPath(x, y, width, height, 2);

          this.context.fillStyle = element.checked ? accentColor : 'white';
          this.context.strokeStyle = element.checked ? accentTextColor : accentColor;
          this.context.lineWidth = 1;
          this.context.stroke();
          this.context.fill();

          if (element.checked) {

            const currentTextAlign = this.context.textAlign;

            this.context.textAlign = 'center';

            const properties = {
              color: accentTextColor,
              fontFamily: style.fontFamily,
              fontSize: height + 'px',
              fontWeight: 'bold'
            };

            this.drawText(properties, x + (width / 2), y, '✔');

            this.context.textAlign = currentTextAlign;

          }

        }

        if (element.type === 'range') {
          const [min, max, value] = ['min', 'max', 'value'].map(property => parseFloat((element as any)[property]));
          const position = ((value - min) / (max - min)) * (width - height);

          this.buildRectPath(x, y + (height / 4), width, height / 2, height / 4);
          this.context.fillStyle = accentTextColor;
          this.context.strokeStyle = accentColor;
          this.context.lineWidth = 1;
          this.context.fill();
          this.context.stroke();

          this.buildRectPath(x, y + (height / 4), position + (height / 2), height / 2, height / 4);
          this.context.fillStyle = accentColor;
          this.context.fill();

          this.buildRectPath(x + position, y, height, height, height / 2);
          this.context.fillStyle = accentColor;
          this.context.fill();

        }

        if (element.type === 'color' || element.type === 'text' || element.type === 'number') {

          this.clipper.add({ x: x, y: y, width: width, height: height });

          this.drawText(style, x + parseInt(style.paddingLeft), y + parseInt(style.paddingTop), element.value);

          this.clipper.remove();

        }

      }

    }

    /*
    // debug
    context.strokeStyle = '#' + Math.random().toString( 16 ).slice( - 3 );
    context.strokeRect( x - 0.5, y - 0.5, width + 1, height + 1 );
    */

    const isClipping = style.overflow === 'auto' || style.overflow === 'hidden';

    if (isClipping) this.clipper.add({ x: x, y: y, width: width, height: height });

    for (let i = 0; i < element.childNodes.length; i++) {

      this.drawElement((element.childNodes as any)[i], style);

    }

    if (isClipping) this.clipper.remove();

  }

}


export { HTMLMesh };
