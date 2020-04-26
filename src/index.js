// Credits to https://github.com/MauriceConrad/iCloud-API
var express = require("express");
var app = express();

app.listen(3000, () => {
	console.log("Server running on port 3000");
	app.get("/get", (req, res, next) => {
		res.json([true]);
	});
});





