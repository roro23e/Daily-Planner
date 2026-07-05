import "dotenv/config";
import { seedWorkspace, usingFirestore } from "./db.js";

const data = await seedWorkspace();

console.log(`Seeded ${usingFirestore() ? "Firestore" : "local JSON"} database.`);
console.log(`${data.users.length} users, ${data.tasks.length} tasks, ${data.groups.length} groups.`);
