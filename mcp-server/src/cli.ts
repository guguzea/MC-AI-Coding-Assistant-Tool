#!/usr/bin/env node
/**
 * mc-skill CLI — status / query / convert / warmup / descriptor
 */
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function load() {
  const api = await import(pathToFileURL(join(root, "dist/api/index.js")).href);
  const mappings = await import(pathToFileURL(join(root, "dist/mappings/index.js")).href);
  const descriptor = await import(pathToFileURL(join(root, "dist/utils/descriptor.js")).href);
  const pathUtil = await import(pathToFileURL(join(root, "dist/utils/path.js")).href);
  return { api, mappings, descriptor, pathUtil };
}

function printJson(obj: unknown) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

function usage() {
  printJson({
    usage: [
      "mc-skill status [--version=1.20.1]",
      "mc-skill warmup [--version=1.20.1]",
      "mc-skill query <className> [methodName] [--version=1.20.1]",
      "mc-skill convert --from=mcp --to=mojang --name=getHealth [--owner=...] [--descriptor=()F] [--kind=method|field|class] [--version=1.20.1]",
      "mc-skill descriptor <jniDescriptor> [--name=method]",
    ],
  });
}

function parseFlags(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (const a of argv) {
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) flags[a.slice(2, eq)] = a.slice(eq + 1);
      else flags[a.slice(2)] = true;
    } else positional.push(a);
  }
  return { flags, positional };
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === "-h" || argv[0] === "--help") {
    usage();
    return;
  }
  const cmd = argv[0];
  const { flags, positional } = parseFlags(argv.slice(1));
  const { api, mappings, descriptor, pathUtil } = await load();

  if (cmd === "status") {
    const version = String(flags.version ?? "1.20.1");
    await api.warmupApi([version]);
    printJson({
      ok: true,
      dataPaths: pathUtil.diagnoseDataPaths(),
      api: api.listApiPreloadStatuses(),
      focus: api.getApiPreloadStatus(version),
    });
    api.disposeApiData();
    return;
  }

  if (cmd === "warmup") {
    const version = String(flags.version ?? "1.20.1");
    const statuses = await api.warmupApi([version]);
    printJson({ ok: true, statuses });
    api.disposeApiData();
    return;
  }

  if (cmd === "query") {
    const className = positional[0];
    if (!className) {
      usage();
      process.exit(2);
    }
    const methodName = positional[1];
    const version = String(flags.version ?? "1.20.1");
    const result = await api.queryApi({ className, methodName, version });
    printJson(result);
    api.disposeApiData();
    return;
  }

  if (cmd === "convert") {
    const from = String(flags.from ?? "");
    const to = String(flags.to ?? "");
    const memberName = String(flags.name ?? positional[0] ?? "");
    if (!from || !to || !memberName) {
      usage();
      process.exit(2);
    }
    const result = mappings.convertMapping({
      from: from as "mojang" | "mcp" | "yarn" | "parchment",
      to: to as "mojang" | "mcp" | "yarn" | "parchment",
      memberName,
      ownerClass: flags.owner ? String(flags.owner) : undefined,
      descriptor: flags.descriptor ? String(flags.descriptor) : undefined,
      version: flags.version ? String(flags.version) : undefined,
      memberKind: flags.kind
        ? (String(flags.kind) as "class" | "method" | "field" | "auto")
        : "auto",
      allow_fallback: flags.allow_fallback === true || flags.allow_fallback === "true",
    });
    printJson(result);
    return;
  }

  if (cmd === "descriptor") {
    const desc = positional[0];
    if (!desc) {
      usage();
      process.exit(2);
    }
    const name = String(flags.name ?? "method");
    printJson({
      descriptor: desc,
      returnType: descriptor.returnType(desc),
      parameterTypes: descriptor.parameterTypes(desc),
      readableSignature: descriptor.readableSignature(name, desc),
    });
    return;
  }

  usage();
  process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
