const KEY_API = "06a25bbf1edc44c0ba09aaf6714a439f";
const newsList = document.querySelector(".news-list");
const element = document.querySelector(".js-choise");
const formSearch = document.querySelector(".form-search");
const title = document.querySelector(".title");

const choise = new Choices(element, {
  searchEnabled: false,
  itemSelectText: "",
});
console.log(choise);

const getData = async (url) => {
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": KEY_API,
    },
  });
  const data = await response.json();
  return data;
};


const getCorrectFormat = isoDate => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-Gb',{
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    })

    const fullTime = date.toLocaleString('en-Gb',{
        hour: 'numeric',
        minute: 'numeric',        
    })
return `<span class = "news-date">${fullDate}</span> ${fullTime}`
}

const getImage = url =>new Promise((resolve, regect)=>{    
        const image = new Image(270,200);       
        image.addEventListener('load', ()=>{
            resolve(image)
        }),
        image.addEventListener('error', ()=>{
            image.src = 'image/noFoto.jpg';
            resolve(image)
        }),
        image.src =url || 'image/noFoto.jpg';
        image.className = 'news-image'
        return image;
})


const renderCard = (data) => {
  newsList.textContent = "";
  data.forEach( async(news) => {
    const card = document.createElement("li");
    card.className = "news-item";
    const image = await getImage(news.urlToImage);
    card.append(image);

    card.insertAdjacentHTML('beforeend', `
    <h3 class="news-title">
            <a href="${news.url}" class="news-link" target="_blank">${news.title|| ''}}</a>
           </h3>
           <p class="news-descriptions">${news.description|| ''}</p>
           <div class="news-footer">
               <time class="news-datetime" datetime="${news.publishedAt}">
               ${getCorrectFormat(news.publishedAt)}
               </time> 
               <div class="news-author">${news.author|| ''}</div>
           </div>            
    `); 
    newsList.append(card);
  });
};

const loadNews = async () => {
  newsList.innerHTML = '<li class="preload"></li>';
  const country = localStorage.getItem("country") || "ua";
  choise.setChoiceByValue(country);
  title.classList.add("hide");
  const data = await getData(
    `https://newsapi.org/v2/top-headlines?country=${country}&pageSize=30`
  );
  renderCard(data.articles);
};

const loadSearch = async (value) => {
  const data = await getData(`https://newsapi.org/v2/everything?q=${value}`);
  title.classList.remove("hide");
  title.textContent = `По даному запиту ${value} результатів ${data.articles.length}`;
  choise.setChoiceByValue('');
  renderCard(data.articles);

};

element.addEventListener("change", (event) => {
  const value = event.detail.value;
  localStorage.setItem("country", value);
  loadNews();
});

formSearch.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = formSearch.search.value;
  loadSearch(value);
  formSearch.reset();
});

loadNews();
