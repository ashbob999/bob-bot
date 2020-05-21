const pg = require("./../libs/pg");


function getRows(query, callback) {
	//const pg = require("./libs/pg");
	let result, error;
	const client = new pg.Client({
	  connectionString: process.env.DATABASE_URL,
	  ssl: {
	    rejectUnauthorized: false
	  }
	});

	client.connect();
	//query = "SELECT table_schema,table_name FROM information_schema.tables;";
	//query = "SELECT * FROM times;";
	client.query(query, (err, res) => {
/*
		if (err) throw err;
		error = err;
		
		console.log("s");
		//console.log(res.rows);
		for (let row of res.rows) {
			console.log(JSON.stringify(row));
		}
		result = res.rows;
		console.log("e");
*/
callback(res, err);
		client.end();
	});
	return {result, error};
}

function dateTime() {
	return new Date().toISOString().slice(0, 19).replace("T", " ");
}

module.exports = {
	name: "Database.js",
	getRows,
	dateTime,
}