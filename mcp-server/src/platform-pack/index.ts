import { actionable } from "../utils/actionable.js";
import { detectModProject, listPlatformPacks } from "./detect.js";
import { sessionPlatformPack } from "./session.js";
import { deactivatePlatformPack, writePlatformPack } from "./write.js";

export { detectModProject, listPlatformPacks } from "./detect.js";
export { sessionPlatformPack } from "./session.js";
export { writePlatformPack, deactivatePlatformPack, packWriteTestHooks } from "./write.js";
export { PACK_HOSTS, expandHosts, upsertHostMarker, beginMarker, endMarker } from "./hosts.js";

export type ActivateArgs = {
  action: "list" | "session" | "write" | "deactivate";
  platform?: string;
  minecraftVersion?: string;
  hosts?: string[];
  topics?: string[];
  includeAllRules?: boolean;
  task?: string;
  skillNames?: string[];
  includeSkills?: boolean;
  writeSkillStubs?: boolean;
  includeSkillBodies?: boolean;
  dryRun?: boolean;
  confirmed?: boolean;
  projectPath?: string;
};

export function activatePlatformPack(args: ActivateArgs) {
  const action = args.action;
  if (action === "list") {
    return { ok: true, action: "list", ...listPlatformPacks() };
  }
  if (action === "session") {
    return sessionPlatformPack({
      platform: String(args.platform ?? ""),
      minecraftVersion: String(args.minecraftVersion ?? ""),
      topics: args.topics,
      includeAllRules: args.includeAllRules,
      task: args.task,
      skillNames: args.skillNames,
    });
  }
  if (action === "write") {
    return writePlatformPack({
      action: "write",
      platform: args.platform,
      minecraftVersion: args.minecraftVersion,
      hosts: args.hosts,
      includeSkills: args.includeSkills,
      writeSkillStubs: args.writeSkillStubs,
      includeSkillBodies: args.includeSkillBodies,
      dryRun: args.dryRun,
      confirmed: args.confirmed,
      projectPath: args.projectPath,
    });
  }
  if (action === "deactivate") {
    return deactivatePlatformPack({
      action: "deactivate",
      hosts: args.hosts,
      dryRun: args.dryRun,
      confirmed: args.confirmed,
      projectPath: args.projectPath,
    });
  }
  return {
    ok: false,
    action: actionable("INVALID_INPUT", "action 必须是 list | session | write | deactivate。", [
      "传入 action",
    ]),
  };
}
