var express = require("express"),
		news = require("./modules/ffnews/ffnews"),
		winston = require("winston"),
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

require("api/news_routes")(app);

app.listen(8080, function () {
	console.log("Listening on 8080");
});

