const path = require('path');

module.exports = async function (source, map) {
    this.cacheable && this.cacheable();

    // generated code ends with default export
    // (which is the svelte component)
    if (typeof source !== 'string') {
        throw new Error('Wrong loader usage');
    }
    let [_, origName] = /export default (.+);$/.exec(source) || [];
    if (!origName) {
        throw new Error('Cannot detect component name');
    }

    // detect all svelte props bindings
    const [__, propsRaw] = /let\s+\{(.+)\}\s*=\s*\$\$props/.exec(source) || [];

    const props = (propsRaw || '')
        .split(/,/g)
        .map(x => x.trim());

    const origNameFixed = origName[0].toLowerCase() + origName.substr(1);
    source = source
        .split(origName)
        .join(origNameFixed);

    const nm = origName
        .split(/_/g)
        .map(x => x[0].toLocaleUpperCase() + x.substr(1))
        .join('');


    source =
        `import { inlineView, bindable } from 'aurelia-framework';
    ` + source.substr(0, source.length - `export default ${origNameFixed};`.length)
        + `

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// Aurelia bridge
let ${nm} = class ${nm} {
  bind() {
    new ${origNameFixed}({
        target: this.element,
        props: this,
    });
  }
};
${props.map(p => `
__decorate([
    bindable,
    __metadata("design:type", Object)
], ${nm}.prototype, "${p}", void 0);`)
            .join('\n')}

${nm} = __decorate([
    inlineView('<template><span ref="element"></span></template>')
], ${nm});

// export it
export {
    ${origNameFixed} as default,
    ${nm},
}
        `;

    this.callback(null, source, map);
}
