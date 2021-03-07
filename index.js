const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const argv = yargs(hideBin(process.argv)).argv;

(async () => {
  if (argv.find && argv.max) {
    const find = argv.find;
    const maxData = argv.max;
    const url = [];
    const resultScrapper = [];
    await axios
      .get(`https://www.imdb.com/find?q=${find}&s=tt&ttype=ft&ref_=fn_ft`)
      .then((result) => {
        const $ = cheerio.load(result.data);
        $("td.result_text > a").map((i, item) => {
          url.push(`https://www.imdb.com${$(item).attr("href")}`);
        });
      });

    let loop = 0;
    let dataIndex = 0;
    const condition = url.length >= maxData ? maxData : url.length;
    console.log(`[====================================]`);
    console.log(`||       SCRAPPER DETAIL MOVIE      ||`);
    console.log(`||       https://www.imdb.com       ||`);
    console.log(`||==================================||`);
    console.log(`|| Find Keyword : ${argv.find}`);
    console.log(`|| Max Result : ${condition}`);
    console.log(`[====================================]\n`);
    while (dataIndex <= condition) {
      const casts = [];
      await axios
        .get(url[loop])
        .then((result) => {
          const $ = cheerio.load(result.data);
          $("tr.odd > td:nth-child(2)").map((i, item) => {
            casts.push($(item).text().trim());
          });
          $("tr.even > td:nth-child(2)").map((i, item) => {
            casts.push($(item).text().trim());
          });
          const subtext = $(
            "#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > div.subtext"
          )
            .text()
            .trim()
            .replace(/\s|\s\n|\n|\r/g, "");
          const category = `${
            $("div.title_wrapper > h1").text().trim()[0] === " "
              ? $("div.title_wrapper > h1").text().trim()[1]
              : $("div.title_wrapper > h1").text().trim()[0]
          }${
            $("div.title_wrapper > h1").text().trim()[1] === " "
              ? $("div.title_wrapper > h1").text().trim()[2]
              : $("div.title_wrapper > h1").text().trim()[1]
          }-${Math.floor(Math.random() * (100 - 10)) + 10}`.toUpperCase();
          const release = subtext.split("|")[2].replace(/\(\w*\)/g, "");
          let release_date = release.split(/\d*/g).join("");
          release_date = `${release.split(release_date)[0]} ${release_date} ${
            release.split(release_date)[1]
          }`;
          const i = subtext.split("|").length === 3 ? 0 : 1;

          const json = {
            name: $("div.title_wrapper > h1").text().trim(),
            image: $("div.poster > a > img").attr("src"),
            description: $("#titleStoryLine > div:nth-child(3) > p > span").text().trim(),
            rating: $("div.ratingValue > strong > span").text(),
            duration: subtext.split("|")[0 + i].replace("h", " hours ").replace("min", " minutes"),
            release_date: release_date,
            director: $("div.plot_summary > div:nth-child(2) > a").text(),
            genre: subtext.split("|")[1 + i].replace(/,/g, ", "),
            casts: JSON.stringify(casts),
            category: category,
          };
          resultScrapper.push(json);
          console.log(`[${dataIndex + 1}][SUCCESS SCRAP] => ${json.name}`);
          dataIndex++;
        })
        .catch(() => {
          console.log(`[-][FAILED SCRAP] => SKIP FILM!`);
        });
      loop++;
    }
    fs.writeFileSync("IMDb - Films.json", JSON.stringify(resultScrapper, null, 2));
  } else {
    console.log(`[FATAL ERROR] => Wrong Format!`);
    console.log(`[FORMAT MUST BE LIKE] => node index --find="drama" --max=10`);
  }
})();
