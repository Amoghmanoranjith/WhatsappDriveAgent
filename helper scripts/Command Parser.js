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

if (!operations.includes(operation)) {
  valid = false;
  error = "Invalid operation";
}

return {
  valid,
  error: valid ? null : error,
  operation,
  args,
};
