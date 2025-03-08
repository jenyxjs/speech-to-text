export function createElement (tagName, parentNode, attrs, css) {
	var node = document.createElement(tagName);

	if (attrs) for (var i in attrs) node[i] = attrs[i];
	if (css) node.style.cssText = (typeof css == 'object') ?
		css.join(';') : css;

	parentNode?.appendChild(node);
	return node;
}