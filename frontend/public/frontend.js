document.getElementById("list-dataset-button").addEventListener("click", handleListDataset);

function handleListDataset() {
	console.log("handleListDataset");
	makeAPICall('http://localhost:4321/datasets', "get", {})
		.then((result) => {
			return result.json();
		}).then((r) => {
		var datasets = r["result"];
		console.log(r);

		if (document.getElementsByTagName("table").length > 0) {
			var table = document.getElementsByTagName("table")[0];
			table.remove();
		}
		if (datasets.length === 0) {
			var emptyDatasetDiv = document.createElement("div");
			emptyDatasetDiv.innerHTML = "no dataset added";
			return
		}
		//https://stackoverflow.com/questions/14643617/create-table-using-javascript
		var body = document.getElementsByTagName('body')[0];
		var tbl = document.createElement('table');
		tbl.id = "datasetTable"

		tbl.style.width = '40%';
		tbl.setAttribute('border', '1');
		var tbdy = document.createElement('tbody');
		for (var i = 0; i < datasets.length; i++) { //row
			var tr = document.createElement('tr');
			var idtd = document.createElement('td');
			idtd.innerHTML = datasets[i].id;
			tr.appendChild(idtd);
			var deletetd = document.createElement('td');
			var deleteBtn = document.createElement('button');
			var id = datasets[i].id;
			deleteBtn.id = id;
			deleteBtn.addEventListener("click", function (e) {
				handleDeleteDataset(e.target.id)
				console.log(e.target.id);
			});
			deleteBtn.innerHTML = "deleteDataset";
			deletetd.appendChild(deleteBtn);
			tr.appendChild(deletetd);
			tbdy.appendChild(tr);
		}
		tbl.appendChild(tbdy);
		body.appendChild(tbl);
	});
}

function handleDeleteDataset(id) {
	makeAPICall('http://localhost:4321/dataset/' + id, "delete", {}).then((r) => {
		return r;
	}).then((r) => {
		console.log(r);
		var result = r.json();
		console.log(result);
		if (r["ok"]) {
			alert("dataset " + id + " already removed!");
		} else {
			alert("dataset " + id + " can't be removed with error")
		}
		handleListDataset();
	}).catch((error) => {
		console.log(error);
	})
}

makeAPICall = (url, method, body) => {
	var content = {
		method: method,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
	}
	if (method !== "get" && method !== "delete") {
		content["body"] = JSON.stringify(body);
	}
	return fetch(url, content);
}
