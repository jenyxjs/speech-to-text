import { Component } from '../Component/Component.js';
import { createElement } from './createElement.js';

export class Control extends Component {
	constructor (options) {
		super();

		this.defineProperty('node', { enumerable: false });
		var tagName = options?.tagName || 'div';
		this.node = document.createElement(tagName);
		this._.visible = true;
		this.options = options;

		Control.init.call(this);
	}

	static stylesheet = createElement('style', document.head).sheet;

	static async init () {
		this.node.className = this.className;

		this.on('name', event => {
			this.node.setAttribute('data-name', this.name);
		});
	}

	get visible () {
		return this._.visible;
	}

	set visible (visible) {
		if (this.visible != visible) {
			this._.visible = visible;
			this.refreshVisible();
			this.emit('visible');
		}
	}

	refreshVisible () {
		if (this.visible) {
			var display = this._.styleIndex?.display || '';
		} else {
			var display = 'none';
		}

		this.node.style.display = display;
	}

	get style () {
		return this._.style || [];
	}

	set style (style) {
		if (typeof style == 'string') style = style.split(';');
		this._.styleIndex = concatStyle(this.style, style);
		this._.style = indexToStyle(this._.styleIndex);
		this.node.style.cssText = this._.style.join(';');
		this.refreshVisible();
	}

	get className () {
		var cssName = [];
		var constructor = this.constructor;

		while (constructor.name) {
			cssName.push(constructor.name);
			constructor = constructor.__proto__;
		};

		cssName.pop();

		return 'jn-' + cssName.join('-');
	}

	get parentNode () {
		return this.node.parentNode;
	}

	set parentNode (parentNode) {
		this.node && parentNode.appendChild(this.node);
	}

	set options (options) {
		if (options?.node) {
			for (var attr in options.node) {
				this.node[attr] = options.node[attr];
			}
			delete options.node;
		}

		super.options = options;
	}

	appendChild (name, child) {
		super.appendChild(name, child);

		if (child.parentNode) {
			child.parentNode.appendChild(child.node);
		} else {
			this.node
				&& child.node
				&& !child.node.parentNode
				&& this.node.appendChild(child.node);
		}
	}

	removeChildren () {
		this.node.innerHTML = '';
		super.removeChildren();
	}
}

function concatStyle (styles1, styles2) {
	var index = {};

	styles1.forEach(value => {
		var key = value.split(':')[0];
		var value = value.split(':')[1];
		index[key] = value.trim();
	});

	styles2.forEach(value => {
		if (value.trim()) {
			var key = value.split(':')[0].trim();
			var value = value.split(':')[1].trim();
			index[key] = value;
		}
	});

	return index;
}

function indexToStyle (index) {
	var style = [];

	for (var i in index) {
		style.push(`${i}: ${index[i]}`);
	}

	return style;
}