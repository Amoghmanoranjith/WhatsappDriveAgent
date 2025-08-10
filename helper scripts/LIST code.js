let message = "LIST takes one or no arguements";
let args = $("Command Parser").first().json.args;

// if no args then list the folders at root
if (args.length === 0) {
  let message = "in your drive:\n";
  const children = $("Tree").first().json.children;

  for (let idx = 0; idx < children.length; idx++) {
    const item = children[idx];
    message += `\n#${idx + 1} ${item.name}\n`;
  }
  return { message };
}

const path = args[0].split("/").filter((part) => part !== "");

// if /help then return what to do stuff
if (path.length === 1 && args[0] === "/help") {
  message =
    "LIST <folder_name> will return the files in that folder \n LIST with no arguements will return the folders in your drive";
}
// find folder id which matches the given path
else if (args.length === 1) {
  message = `in ${args[0]}:\n`;
  let currentFolder = $("Tree").first().json;
  for (let idx = 0; idx < path.length; idx++) {
    // if at any level we dont find the specified folder we stop
    let found = false;
    for (const child of currentFolder.children) {
      if (
        child.name === path[idx] &&
        child.mimeType === "application/vnd.google-apps.folder"
      ) {
        currentFolder = child;
        found = true;
        break;
      }
    }
    if (!found) {
      message = "This command is for listing folders";
      return { message };
    }
  }
  for (let idx = 0; idx < currentFolder.children.length; idx++) {
    const child = currentFolder.children[idx];
    message += `\n#${idx + 1}. ${child.name} :${child.mimeType.split('.').pop()}`;
  }
  return { message };
}
return { message };
