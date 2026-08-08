import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("H:/MC_skill/data/fabric_1.20.1/mappings/yarn-mappings.sqlite", {
  readOnly: true,
});
console.log("meta", db.prepare("SELECT key, value FROM meta").all());
console.log("methods", db.prepare("SELECT COUNT(*) AS c FROM methods").get());
console.log(
  "getHealth",
  db
    .prepare(
      `SELECT owner_named, name_named, name_official, descriptor_named
       FROM methods WHERE name_named = ? AND owner_named LIKE ?`,
    )
    .all("getHealth", "%LivingEntity%"),
);
db.close();
