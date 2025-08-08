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

const command = $("Webhook").first().json.body.Body.trim();
const operations = [
  "HELP",
  "MOVE",
  "DELETE",
  "LIST",
  "SUMMARY",
  "CREATE",
  "UPLOAD",
];

function tokenize(cmd) {
  const regex = /"([^"]+)"|\S+/g;
  return [...cmd.matchAll(regex)].map((m) => m[1] || m[0]);
}

const tokens = tokenize(command);
let operation = tokens[0];
const args = tokens.slice(1);

let valid = true;
let error = "";
let records = [];

function getId(path) {
  const pathItems = path.split("/").filter(Boolean);
  // pathItems more than 2 items return record = {} valid = false, error = invalid query parameter, operations are folder based
  if (pathItems.length > 2) {
    valid = false;
    error = "Invalid query parameter";
    return [];
  } else if (pathItems.length === 1) {
    // if len of pathItems is 1 then search for this value in Get folder ID where mime type is folder and return that record if not found return
    for (const item of $("Get folder ID").all()) {
      if (item.json.name === pathItems[0]) {
        records.push(item.json);
        return [];
      }
    }
    valid = false;
    error = `${pathItems[0]} not found`;
  } else if (pathItems.length === 2) {
    // if len is 2 find the pathItems[0] such that mime is folder in Get folder ID not found then return valid = false, error = pathItems[0] not found
    // iterate through list and search in Get folder ID where name = pathItems[1] and parents.parents[0] = current ID
    let parent = {};
    for (const item of $("Get folder ID").all()) {
      if (item.json.name == pathItems[0]) {
        parent = item.json;
        break;
      }
    }
    if (parent) {
      for (const item of $("Get folder ID").all()) {
        const json = item.json;
        if (
          json.parents &&
          json.parents[0] === parent.id &&
          json.name === pathItems[1]
        ) {
          records.push(json);
          valid = true;
          return [];
        }
      }
      valid = false;
      error = `${pathItems[1]} not found`;
    } else {
      valid = false;
      error = `${pathItems[1]} not found`;
    }
  }
  return [];
}

if (!operations.includes(operation)) {
  valid = false;
  error = "Invalid operation";
} else {
  switch (operation) {
    case "HELP":
      if (args.length !== 0) {
        valid = false;
        error = `${operation} takes no arguements`;
      }
      break;

    case "LIST":
      if (args.length !== 1) {
        valid = false;
        error = `${operation} requires target folder name`;
      } else {
        getId(args[0]);
        for (const item of $("Get folder ID").all()) {
          if (item.json.parents && item.json.parents[0] === records[0].id) {
            records.push(item.json);
          }
        }
        records.shift();
      }
      break;

    case "SUMMARY":
      if (args.length !== 1) {
        valid = false;
        error = `${operation} requires target folder name`;
      } else {
        getId(args[0]);
        for (const item of $("Get folder ID").all()) {
          if (
            item.json.parents &&
            item.json.parents[0] === records[0].id &&
            [
              "application/vnd.google-apps.document",
              "text/plain",
              "application/pdf",
            ].includes(item.json.mimeType)
          ) {
            records.push(item.json);
          }
        }
        records.shift();
      }
      break;

    case "CREATE":
      if (args.length != 1) {
        valid = false;
        error = "CREATE takes only one arguement, name of folder";
      }
      for (const item of $("Get folder ID").all()) {
        if (
          item.json.mimeType === "application/vnd.google-apps.folder" &&
          item.json.name === args[0]
        ) {
          valid = false;
          error = "folder name already exists pls use some other name";
          break;
        }
      }
      break;

    case "DELETE":
      if (args.length < 1) {
        valid = false;
        error = "DELETE takes an arguement";
      } else if (args[0] === "CONFIRM") {
        const key = $vars.key;
        const phone = $("Webhook").first().json.body.From.split("+91")[1];
        const decode = xorDecrypt(args[1], phone);

        if (decode === key) {
          for (const item of $("Get folder ID").all()) {
            if (item.json.mimeType === "application/vnd.google-apps.folder") {
              records.push(item.json);
            }
          }
          $("Webhook").first().json.body.Body = "DELETE ~all";
        } else {
          valid = false;
          error = "unauthorized attempt";
        }
      } else if (args[0] === "~all") {
        const key = $vars.key;
        const phone = $("Webhook").first().json.body.From.split("+91")[1];
        const code = xorEncrypt(key, phone);
        valid = false;
        error = `Are you sure?\n Reply with DELETE CONFIRM ${code}`;
      } else {
        getId(args[0]);
      }
      break;

    case "UPLOAD":
      if (args.length !== 2) {
        valid = false;
        error = "UPLOAD require folder_name file_name";
      } else if ($("Webhook").first().json.body.MediaUrl0) {
        getId(args[0]);
        for (const item of $("Get folder ID").all()) {
          if (item.json.parents && item.json.parents[0] === records[0].id && args[1] === item.json.name) {
            valid = false;
            error = "file with same name already exists"
          }
        }
      } else {
        valid = false;
        error = "please upload a media";
      }
      break;

    case "MOVE":
      if (args.length !== 2) {
        valid = false;
        error = "MOVE requires file_path and dest_folder_name";
      } else {
        getId(args[0]);
        getId(args[1]);
      }
      break;

    default:
      valid = false;
      error = "Unknown error";
  }
}
return {
  records,
  valid,
  error: valid ? null : error,
  operation,
  args,
};
