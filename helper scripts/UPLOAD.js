let message = "";
let records = [];
let args = $("Command Parser").first().json.args;
let treeRoot = $("Tree").first().json;

// Function to get the ID of a file/folder by path array
function getIdFromPath(pathArray) {
  let current = treeRoot;

  for (let idx = 0; idx < pathArray.length; idx++) {
    let found = false;

    for (const child of current.children) {
      // If last part of path, just match the name
      if (idx === pathArray.length - 1 && child.name === pathArray[idx]) {
        return child; // Found final target
      }
      // If folder, move deeper
      else if (
        child.name === pathArray[idx] &&
        child.mimeType === "application/vnd.google-apps.folder"
      ) {
        current = child;
        found = true;
        break;
      }
    }
    if (!found) {
      return null; // Path invalid
    }
  }
  return null;
}

if (args.length < 1) {
  message = "UPLOAD takes two arguments";
} 
else if (args.length === 1 && args[0] === "/help") {
  message = "UPLOAD path/to/target file_name";
} 
else if (args.length === 2) {
  const path1 = args[0].split("/").filter(Boolean);
  const path2 = args[1].split("/").filter(Boolean);

  const p1 = getIdFromPath([...path2, ...path1]);
  const p2 = getIdFromPath(path2);
  if(path2.length !== 1){
    message = "Provide only the file name";
  }
  else if(p2){
    message = "File already exists in given path";
  }
  else if(!p1){
    message = "Given path is invalid";
  }
  else if(p1.mimeType != "application/vnd.google-apps.folder"){
    message = "Path must lead to a folder";
  }else {
    records.push(path2[0], p1.id);
    message = "Successfully created";
  }
} 
else {
  message = "UPLOAD takes two arguments";
}

return { records, message };
