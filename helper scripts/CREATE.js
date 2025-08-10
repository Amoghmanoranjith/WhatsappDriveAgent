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
  message = "CREATE takes two arguments";
} 
else if (args.length === 1 && args[0] === "/help") {
  message = "CREATE path/to/target folder_name";
} 
else if(args.length === 2 && args[0] === '/'){
  const path1 = args[1].split("/").filter(Boolean);
  const p1 = getIdFromPath(path1, treeRoot);
  if(path1.length !== 1){
    message = "Invalid syntax.";
  }
  else if(p1){
    message = "Folder already exists";
  }
  else{
    records.push(path1[0], treeRoot.id);
    message = "Successfully created folder";
  }
}
else if (args.length === 2) {
  const path1 = args[0].split("/").filter(Boolean);
  const path2 = args[1].split("/").filter(Boolean);

  const p1 = getIdFromPath([...path2, ...path1], treeRoot);
  const p2 = getIdFromPath(path2, treeRoot);
  if(path2.length !== 1){
    message = "Provide only the folder name";
  }
  else if(p2){
    message = "Folder already exists"
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
  message = "CREATE takes two arguments";
}

return { records, message };
