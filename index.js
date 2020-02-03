(function addLanguages() {
    let languageSelect = document.getElementById('article-language');

    languages.forEach(language => {
        let optionElement = document.createElement('option');
        optionElement.appendChild(document.createTextNode(language.name));
        optionElement.value = language.code;
        languageSelect.appendChild(optionElement);
    });
})();

