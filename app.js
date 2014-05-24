var express = require("express"),
		news = require("./modules/ffnews"),
		winston = require("winston"),
    db = require("db/db"),
		app = express();

app.use("/static", express.static(__dirname + "/static"));

winston.add(winston.transports.File, { filename: "winston.log" });
winston.remove(winston.transports.Console);

app.get("/", function (req, res) {
	res.sendfile("./main.html", {}, function (err) {
		if (!err) {
			winston.log("info", "User accessed index.html");
		}
	});
});

app.get("/api/news", function (req, res) {
	news(function (err, data) {
		if (err) {
			res.send(500, err);
		}
    //data = news.cleanJSON(data);
    //data = news.formatDates(data);
    //data = news.checkDates(data);
    //db.save("ffnews", data);
		res.send(data);
	});
});

app.listen(8080, function () {
	console.log("Listening on 8080");
});

