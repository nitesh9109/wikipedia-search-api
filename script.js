let searchTextEle = document.querySelector("#searchText");
let searchOutputEle = document.querySelector("#searchOutput");

searchTextEle.focus();

searchTextEle.addEventListener("input", (e) => {
  search(e.target.value);
});

let timeOut;
function search(searchText) {
  if (timeOut) {
    clearTimeout(timeOut);
  }

  if (!searchText) {
    searchOutputEle.innerHTML = "";
    return;
  }

  try {
    timeOut = setTimeout(async () => {
      let url = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info|extracts&inprop=url&utf8=&format=json&origin=*&srlimit=10&srsearch=${searchText}`;
      let response = await fetch(url);
      let json = await response.json();

      let searchHtmlResult = generateHtml(json.query.search, searchText);
      searchOutputEle.innerHTML = searchHtmlResult;
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

const highlight = (str, keyword, className = "highlight") => {
  const hl = `<span class="${className}">${keyword}</span>`;
  return str.replace(new RegExp(keyword, "gi"), hl);
};

function generateHtml(outputs, searchText) {
  return outputs
    .map((result) => {
      const title = highlight(result.title, searchText);
      const snippet = highlight(result.snippet, searchText);

      return `<article>
      <a target="_blank" href="https://en.wikipedia.org/?curid=${result.pageid}">
        <h2 class="heading">${title}</h2>
        </a>
        <div class="summary">${snippet}...</div>
      </article>`;
    })
    .join("");
}
