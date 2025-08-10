function prop(at) {
  const childrenIds = tree.get(at) || [];
  
  const children = childrenIds.map(childId => prop(childId));

  return {
    id: at,
    name: recos.get(at)?.name || null,
    mimeType: recos.get(at)?.mimeType || null,
    children: children
  };
}

const records = $("Get folder ID").all();
const s1 = new Set();
const tree = new Map();
const recos = new Map();

// Insert the first parent of each record
for (const record of records) {
  if (record.json.parents && record.json.parents.length > 0) {
    s1.add(record.json.parents[0]);
  }
}

// Remove each record’s own ID from the set
for (const record of records) {
  s1.delete(record.json.id);
}

// The remaining value in the set is the root ID
const root = Array.from(s1)[0];

// Build tree and metadata map
for (const record of records) {
  const id = record.json.id;
  recos.set(id, {
    name: record.json.name,
    mimeType: record.json.mimeType
  });

  if (record.json.parents && record.json.parents.length > 0) {
    const parent = record.json.parents[0];
    if (!tree.has(parent)) {
      tree.set(parent, []);
    }
    tree.get(parent).push(id);
  }
}

// Build final nested structure
const result = prop(root);
result.name = '$root'
result.mimeType = 'root directory'
console.log(result);
return [result]
