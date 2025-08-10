let message = "";
let records = [];
let args = $("Command Parser").first().json.args;
let treeRoot = $("Tree").first().json;

// Function to get the ID of a file/folder by path array
function getIdFromPath(pathArray, rootFolder) {
  let current = rootFolder;

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
  message = "MOVE takes two arguments";
} 
else if (args.length === 1 && args[0] === "/help") {
  message = "MOVE path/to/target path/to/destination/folder";
} 
else if(args.length === 2 && args[1] === '/'){
  const path1 = args[0].split("/").filter(Boolean);
  const p1 = getIdFromPath(path1, treeRoot);
  if(!p1){
    message = "source path is invalid"
  }
  else{
    records.push(p1.id, treeRoot.id);
    message = "Successfully moved";
  }
}
else if (args.length === 2) {
  const path1 = args[0].split("/").filter(Boolean);
  const path2 = args[1].split("/").filter(Boolean);

  const p1 = getIdFromPath(path1, treeRoot);
  const p2 = getIdFromPath(path2, treeRoot);
  if(!p1){
    message = "Source path is invalid"
  }
  else if(!p2){
    message = "Destination path is invalid";
  }
  else if(p2.mimeType != "application/vnd.google-apps.folder"){
    message = "destination must be a folder";
  }else {
    records.push(p1.id, p2.id);
    message = "Successfully moved";
  }
} 
else {
  message = "MOVE takes two arguments";
}

return { records, message };
