(function addLanguages() {
    let languageSelect = document.getElementById('article-language');

    languages.forEach(language => {
        let optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(language.name));
        optionElement.value = language.code;
        languageSelect.appendChild(optionElement);
    });
})();

const apiEndpoint = 'wikipedia.org/api/rest_v1/page/metadata/';
const wikiEndpoint = 'wikipedia.org/wiki/';

function createEntryNode(entry) {
    let node = document.createElement('div');

    let classNames = isSelectedLanguageRTL() ? ['rtl'] : [];
    classNames = entry.level > 1 ? [...classNames, 'entry--nested'] : classNames;
    node.classList.add(...classNames);

    let anchor = document.createElement('a');
    anchor.href = getAnchorHref(entry);
    anchor.target = '_blank';

    let content = document.createTextNode([entry.number, entry.html].join(' '));
    anchor.appendChild(content);
    node.appendChild(anchor);
    return node;
}

function createResultNode(entries) {
    let rootNode =  document.createElement("div");

    let parentStack = [rootNode];
    let previousLevel = 0;
    entries.forEach(entry => {
        let entryNode = createEntryNode(entry);
        parentStack.splice(0, previousLevel - entry.level + 1, entryNode);
        parentStack[1].appendChild(entryNode);
        previousLevel = entry.level;
    });

    return rootNode;
}

function fetchData() {
    setResult('Loading...');

    fetch(getEndpoint(apiEndpoint))
        .then(response => response.json())
        .then(response => setResult(createResultNode(response.toc.entries)))
        .catch(error => setResult('Not found'))
    ;
}

function getAnchorHref(entry) {
    return getEndpoint(wikiEndpoint) + '#' + entry.anchor;
}

function getCanonicalTitle() {
    return document.getElementById('article-title').value
        .trim()
        .split(' ')
        .join('_');
}

function getEndpoint(requestedEndpoint) {
    return 'https://' + getSelectedLanguage() + '.' + requestedEndpoint + getCanonicalTitle()
}

function getSelectedLanguage() {
    return document.getElementById('article-language').value;
}

function isSelectedLanguageRTL() {
    return languages
        .find(language => language.code === getSelectedLanguage())
        .rtl
        ;
}

function setResult(result) {
    if (result instanceof Element || result instanceof HTMLDocument) {
        document.getElementById('result').innerHTML = '';
        document.getElementById('result').appendChild(result);
    } else {
        document.getElementById('result').innerHTML = result;
    }
}