var news = require('./ffnews'),
    fs = require('fs');

news.getNews(function (err, news) {
  if (err) console.log(err);
  fs.writeFile('./output', JSON.stringify(news));
});

