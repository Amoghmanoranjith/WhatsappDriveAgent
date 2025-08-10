function toHex(str) {
  return str
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex) {
  let str = "";
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

function xorEncrypt(code, key) {
  let encrypted = "";
  for (let i = 0; i < code.length; i++) {
    const codeChar = code.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    encrypted += String.fromCharCode(codeChar ^ keyChar);
  }
  return toHex(encrypted);
}

function xorDecrypt(tokenHex, key) {
  const encrypted = fromHex(tokenHex);
  let decrypted = "";
  for (let i = 0; i < encrypted.length; i++) {
    const encChar = encrypted.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(encChar ^ keyChar);
  }
  return decrypted;
}
let message = "Deletion successful";
let records = [];
let args = $("Command Parser").first().json.args;
let currentFolder = $("Tree").first().json;

if (args.length < 1) {
  message = "DELETE takes an arguement";
}
else if (args.length === 1 && args[0] === "/help") {
  message =
    "DELETE takes folder_name or file_name or ~all for deleting all folders in drive";
}
else if (args[0] === "CONFIRM") {
  const key = $vars.key;
  const phone = $("Webhook").first().json.body.From.split("+91")[1];
  const decode = xorDecrypt(args[1], phone);

  if (decode === key) {
    for (const item of currentFolder.children) {
      records.push({ id: item.id });
    }
    $("Webhook").first().json.body.Body = "DELETE ~all";
  } else {
    message = "unauthorized attempt";
  }
} 
else if (args[0] === "~all") {
  const key = $vars.key;
  const phone = $("Webhook").first().json.body.From.split("+91")[1];
  const code = xorEncrypt(key, phone);
  message = `Are you sure?\n Reply with DELETE CONFIRM ${code}`;
  return {message};
} 
else if (args.length === 1) {
  const path = args[0].split("/").filter((part) => part !== "");
  for (let idx = 0; idx < path.length; idx++) {
    // if at any level we dont find the specified folder we stop
    let found = false;
    for (const child of currentFolder.children) {
      if (idx === path.length - 1 && child.name === path[idx]) {
        records.push(child.id);
        found = true;
        break;
      } else if (
        child.name === path[idx] &&
        child.mimeType === "application/vnd.google-apps.folder"
      ) {
        currentFolder = child;
        found = true;
        break;
      }
    }
    if (!found) {
      message = "The given path is invalid";
      return { message };
    }
  }
  message = "Successfully deleted"
} else {
  message = "DELETE takes one arguement";
}

return {records, message};
