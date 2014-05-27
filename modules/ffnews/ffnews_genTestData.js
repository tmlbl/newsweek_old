var news = require('./ffnews'),
    fs = require('fs');

news.getNews(function (err, news) {
  if (err) throw (err);
  fs.writeFile('test/integration/sampledata', JSON.stringify(news), function (err) {
  	if (err) throw err;
		process.exit(0);
  });
});
