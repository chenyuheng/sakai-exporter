let expanding = false;
let fr = null;

function expand_folder() {
	fr = document.getElementById("fr").contentWindow.document;
	let closed_folders = fr.getElementsByClassName("fa-folder");
	if (closed_folders.length != 0) {
		closed_folders[0].click();
		console.log("expanding folders... remaining: " + closed_folders.length);
	} else {
		expanding = false;
	}
}

function extract_files(doc = document, prefix = "") {
	let tbody_list = doc.getElementsByTagName("tbody");
	console.assert(tbody_list.length == 1);
	let file_list = [];
	for (let i = 2; i < tbody_list[0].children.length; i++) {
		let row_list = tbody_list[0].children[i].children;
		console.assert(row_list.length == 9);
		let file_title = row_list[2];
		if (file_title.children.length == 4) { //是个文件夹
			// 其实啥都没做
		} else if (file_title.children.length == 2) { // 是个文件
			let link = file_title.children[0].href;
			let link_tokens = link.split("/");
			let name = "";
			for (let j = 7; j < link_tokens.length; j++) {
				name += "/" + link_tokens[j];
			}
			let file_obj = {"name": name, "link": link};
			file_list.push(file_obj);
		} else {
			console.error("既不是文件也不是文件夹？")
		}
	}
	return file_list;
}

function get_resources_url(doc = document) {
	let menu_list = doc.getElementsByClassName("Mrphs-toolsNav__menuitem--link ")
	for (i in menu_list) {
		let txt = menu_list[i].children[1].textContent;
		if (txt == "Resources" || txt == "资源") {
			return menu_list[i].href;
		}
	}
	console.error("没得资源栏啊？");
	return null;
}

function load_binary_resource(url) {
  try {
	  var req = new XMLHttpRequest();
	  req.open('GET', url, false);
	  req.overrideMimeType('text\/plain; charset=x-user-defined');
	  req.send(null);
	  if (req.status != 200) return '';
	  return req.responseText;
  } catch (error) {
  	console.log(error);
  	return "";
  }
}

function run() {
	console.log("[1] Getting resources url...");
	let url = get_resources_url();
	console.log("[2] Expanding folders...");
	let ifr = document.createElement("iframe");
	ifr.setAttribute("id", "fr");
	ifr.setAttribute("src", url);
	ifr.setAttribute("width", "1000px");
	ifr.setAttribute("height", "1000px");
	ifr.addEventListener("load", expand_folder);
	expanding = true;
	$("body").append(ifr);
	wait_for_expanding();
}

function save(blob, name) {
    const aTag = document.createElement('a');
    aTag.download = name + ".zip";
    aTag.href = URL.createObjectURL(blob);
    aTag.click();
    URL.revokeObjectURL(blob);
}

function save_zip(zip, name) {
	zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
            var msg = "exporting... progression : " + metadata.percent.toFixed(2) + " %";
            if(metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            console.log(msg);
        }).then(function(content){save(content, name);});
}

function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function wait_for_expanding() {
	if (expanding) {
	    setTimeout("wait_for_expanding()", 500);
	} else {
		console.log("[3] Downloading files...");
		let site_name = document.getElementsByTagName("title")[0].textContent;
		let file_list = extract_files();
		let zip = new JSZip();
		for (i in file_list) {
			let file = file_list[i];
			let file_date = stringToArrayBuffer(load_binary_resource(file["link"]));
			zip.file(file["name"], file_date, {binary:true});
			console.log(file["name"] + ": done;");
		}
		console.log("[4] Generating zip file...");
		save_zip(zip, site_name);
	}
}