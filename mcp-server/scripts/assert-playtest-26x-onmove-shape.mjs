#!/usr/bin/env node
/**
 * 26.x driver "no-call-to-removed-API" gate (regression guard for the 2026-10-31 fix).
 *
 * WHY THIS EXISTS
 *   rewriteForNeoForge26xx injects a real "clickchat" implementation into every 26.x driver.
 *   That block used to call MouseHandler.onMove(long,double,double,double,double) unconditionally.
 *   javap on the official client jars shows that member does NOT exist across all of 26.x:
 *
 *     26.1     no public onMove (only private onMove(long,double,double))
 *     26.1.1   same
 *     26.1.2   same
 *     26.2     same  -> the generated 26.2 driver DID NOT COMPILE
 *     26.3     public void onMove(long,double,double,double,double)   <- only here
 *
 *   A runtime "if (false)" guard is NOT a fix: javac still type-checks the guarded body,
 *   so the symbol must not be emitted at all for versions that lack it.
 *
 * WHAT THIS GATE ASSERTS (text analysis of generator output; no jars, no network)
 *   For every 26.x tier:
 *     - 26.3        => the onMove call IS present, with 5 arguments
 *     - other tiers => the onMove call is ABSENT
 *
 * EXIT CODES: 0 = all tiers match; 1 = a tier violates the expectation.
 *
 * NOT part of npm test (shells out to the local CLI). Run manually:
 *   node mcp-server/scripts/assert-playtest-26x-onmove-shape.mjs
 */

import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");

/** Tiers to check. onMove must be true only where javap proves the public 5-arg member exists. */
const TIERS = [
  { platform: "neoforge", version: "26.1", onMove: false },
  { platform: "neoforge", version: "26.1.1", onMove: false },
  { platform: "neoforge", version: "26.1.2", onMove: false },
  { platform: "neoforge", version: "26.2", onMove: false },
  { platform: "neoforge", version: "26.3", onMove: true },
];

const CALL_HEAD = "client.mouseHandler.onMove(";

/**
 * Extract the argument text of the onMove call, handling nested parentheses such as
 * client.getWindow().handle(). Returns null when the call is absent.
 */
function extractOnMoveArgs(src) {
  const at = src.indexOf(CALL_HEAD);
  if (at < 0) return null;
  let i = at + CALL_HEAD.length;
  let depth = 1;
  const start = i;
  for (; i < src.length && depth > 0; i++) {
    const ch = src[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
  }
  if (depth !== 0) return null;
  return src.slice(start, i - 1);
}

/** Split top-level commas only, so nested calls stay intact. */
function countTopLevelArgs(argText) {
  if (argText.trim() === "") return 0;
  let depth = 0;
  let n = 1;
  for (const ch of argText) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "," && depth === 0) n++;
  }
  return n;
}

let fail = 0;
for (const tier of TIERS) {
  const tag = tier.platform + " " + tier.version;
  let raw;
  try {
    raw = execFileSync(
      process.execPath,
      [
        "dist/cli.js",
        "generate_playtest_driver",
        "--platform", tier.platform,
        "--version", tier.version,
        "--modId", "examplemod",
        "--driverMode", "temporary_client_tick_driver",
        "--scenario", "smoke",
      ],
      { cwd: MCP, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] },
    );
  } catch (e) {
    console.log("FAIL " + tag + " :: generator failed " + String(e).slice(0, 160));
    fail++;
    continue;
  }

  let driver;
  try {
    driver = JSON.parse(raw.slice(raw.indexOf("{"))).result.files["playtest/PlaytestQaDriver.java"];
  } catch {
    console.log("FAIL " + tag + " :: output is not parseable JSON");
    fail++;
    continue;
  }
  if (!driver) {
    console.log("FAIL " + tag + " :: no PlaytestQaDriver.java in output");
    fail++;
    continue;
  }

  const argText = extractOnMoveArgs(driver);
  if (tier.onMove) {
    if (argText === null) {
      console.log("FAIL " + tag + " :: expected an onMove call (public 5-arg exists here) but found none");
      fail++;
      continue;
    }
    const argCount = countTopLevelArgs(argText);
    if (argCount !== 5) {
      console.log("FAIL " + tag + " :: onMove emitted with " + argCount + " args, expected 5");
      fail++;
      continue;
    }
    console.log("ok   " + tag + " :: onMove present, 5 args");
  } else {
    if (argText !== null) {
      console.log(
        "FAIL " + tag + " :: onMove must NOT be emitted here (private 3-arg only => would not compile)",
      );
      fail++;
      continue;
    }
    console.log("ok   " + tag + " :: onMove absent");
  }
}

if (fail > 0) {
  console.log("\nassert-playtest-26x-onmove-shape: " + fail + " tier(s) FAILED");
  process.exit(1);
}
console.log("\nassert-playtest-26x-onmove-shape: ok (" + TIERS.length + " tiers)");
