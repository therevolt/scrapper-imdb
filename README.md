# About
Scrapper IMDb Detail Movie

## How it's work?
It's have 2 version
#### Automatic Version
1. Clone This Repository & Go To Folder
```
git clone https://github.com/therevolt/scrapper-imdb
```
2. Install All Modules
```
npm install
```
4. Run Script
```
node index --find="KEYWORD_MOVIES" --max="MAX DATA AS YOU NEED"
```
5. Done!, Data Will Saved On ```IMDb - Films.json```
![Preview](https://i.ibb.co/7JPWMbW/imdb4.png)


#### Manual Version
1. Open IMDb Website & Search Movie (for example url: [here](https://www.imdb.com/title/tt6882604/?ref_=ttls_li_tt))
2. Right Click > Inspect Element > Console
![Preview](https://i.ibb.co/PmJ804b/imdb.png)
3. Input Text Below > Enter
```javascript
const arr2 = []
document.querySelectorAll("tr.odd > td:nth-child(2)").forEach((item) => arr2.push((item).textContent.toString().trim().replace(/\n|\r/,"")))
document.querySelectorAll("tr.even > td:nth-child(2)").forEach((item) => arr2.push((item).textContent.toString().trim().replace(/\n|\r/,"")))

const arr3 = []

let text = document.querySelector("#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div.subtext").textContent.trim().replace(/\s|\s\n|\n|\r/g,"")

let category = `${document.querySelector("div.title_wrapper > h1").textContent.trim()[0] === " " ? document.querySelector("div.title_wrapper > h1").textContent.trim()[1] : document.querySelector("div.title_wrapper > h1").textContent.trim()[0]}${document.querySelector("div.title_wrapper > h1").textContent.trim()[1] === " " ? document.querySelector("div.title_wrapper > h1").textContent.trim()[2] : document.querySelector("div.title_wrapper > h1").textContent.trim()[1]}-${Math.floor(Math.random() * (100 - 10) ) + 10}`

let release = text.split("|")[3].replace(/\(\w*\)/g,"")
let release_date = release.split(/\d*/g).join("")
release_date = `${release.split(release_date)[0]} ${release_date} ${release.split(release_date)[1]}`

const json = {
name: document.querySelector("div.title_wrapper > h1").textContent.trim(),
image: document.querySelector("div.poster > a > img").src,
description: document.querySelector("#titleStoryLine > div:nth-child(3) > p > span").textContent.trim(),
rating: document.querySelector("div.ratingValue > strong > span").textContent,
duration: text.split("|")[1].replace("h"," hours ").replace("min"," minutes"),
release_date: release_date,
director: document.querySelector("div.plot_summary > div:nth-child(2) > a").text,
genre: text.split("|")[2].replace(/,/g,", "),
casts: JSON.stringify(arr2),
category: category.toUpperCase()
}

console.log(JSON.stringify(json))
```
![Preview](https://i.ibb.co/1ZgXvV3/imdb2.png)
4. Done!, You got result in stringify object
![Preview](https://i.ibb.co/WyXPzGW/imdb3.png)
