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
  message = "SUMMARY takes one argument";
} else if (args.length === 1 && args[0] === "/help") {
  message = "SUMMARY path/to/folder_name";
} else if (args.length === 1) {
  const path1 = args[0].split("/").filter(Boolean);
  let p1 = getIdFromPath(path1);
  if(path1.length === 0){
    p1 = treeRoot.id
  }
  if (!p1) {
    message = "Folder not found";
  }
  if (
    [
      "application/vnd.google-apps.document",
      "text/plain",
      "application/pdf",
    ].includes(p1.mimeType)
  ) {
    records.push(p1);
  } else if (p1.mimeType === "application/vnd.google-apps.folder") {
    for (const child of p1.children) {
      if (
        [
          "application/vnd.google-apps.document",
          "text/plain",
          "application/pdf",
        ].includes(child.mimeType)
      )
        records.push(child);
    }
  }
  else{
    message = "Summary only possible for txt, pdf, doc the folder you provided might not have these";
  }
} else {
  message = "SUMMARY takes one argument";
}

return { records, message };
