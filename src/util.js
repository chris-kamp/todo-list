//Create a node with given properties
function create({type, id, cl, src, textContent, eventListener, val, parent}) {
    const element = document.createElement(type);
    setID(element, id);
    setCl(element, cl);
    setSrc(element, src);
    setTextContent(element, textContent);
    setVal(element, val),
    addEL(element, eventListener);

    parent.appendChild(element);
    return element;
}

function setID(element, id) {
    if(id !== undefined) {
        element.setAttribute("id", id);
    }
}

function setCl(element, cl) {
    if(cl !== undefined) {
        element.setAttribute("class", cl);
    }
}

function setTextContent(element, textContent) {
    if(textContent !== undefined) {
        element.textContent = textContent;
    }
}

function setSrc(element, src) {
    if(src !== undefined) {
        element.setAttribute("src", src);
    }
}

function setVal(element, val) {
    if(val !== undefined) {
        element.setAttribute("value", val);
    }
}

function addEL(element, eventListener) {
    if(eventListener !== undefined) {
        element.addEventListener(eventListener.type, eventListener.callback);
    }
}

//Delete all children of a node
function clearChildren(node) {
    node.querySelectorAll("*").forEach(child => {
        child.remove();
    });
}

export {clearChildren, create};