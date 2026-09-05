// assert-no-invalid-api-shapes.mjs — regression gate for API shapes proven not to compile.
//
// Scan scope is the tracked source docs only (rules, skills, knowledge, code-patterns, root
// docs). Projections under .claude/.trae/.continue/.opencode/.zcode/.agents/.pi/.cursor/agent
// are excluded because assert-skill-mirrors.mjs already guarantees they equal their source, and
// data/** is excluded because it is verbatim upstream corpus, not our advice.
//
// Matching happens ONLY inside fenced code blocks: a "don't write this" mention is allowed as
// inline `code` in prose (the repo's existing convention), so the ❌ rows stay legal while the
// live examples may not.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const BANNED = [
  {
    // CLI: query_loader_api --platform=forge --minecraftVersion=1.17.1 / 1.20.1
    //      --className=ICapabilityProvider
    // → members are only getCapability(Capability<T>, Direction) and getCapability(Capability<T>);
    //   the interface itself declares no type parameters, so `new ICapabilityProvider<X>()`
    //   cannot compile. 13 source blocks / 136 files were repaired for this on 2026-09-05.
    id: 'forge-icapabilityprovider-generic',
    re: /new\s+ICapabilityProvider\s*</,
    why: 'ICapabilityProvider（Forge）是非泛型接口，`new ICapabilityProvider<...>` 编译不过',
  },
];

const files = execFileSync('git', ['-C', ROOT, 'ls-files', '-z'],
  { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  .split('\0').filter(Boolean)
  .filter((p) => /\.(md|mdc)$/.test(p))
  .filter((p) => !/(^|\/)\.(claude|trae|continue|opencode|zcode|agents|pi)\//.test(p))
  .filter((p) => !p.startsWith('data/'))
  .filter((p) => !p.startsWith('community_knowledge/'))
  .filter((p) => !p.startsWith('temp/'));

const failures = [];
for (const rel of files) {
  const text = readFileSync(path.join(ROOT, rel), 'utf8');
  const fenceRe = /```[\w-]*[ \t]*\r?\n([\s\S]*?)```/g;
  let m;
  while ((m = fenceRe.exec(text))) {
    const body = m[1];
    const offset = m.index + m[0].indexOf(body);
    for (const b of BANNED) {
      const local = body.search(b.re);
      if (local < 0) continue;
      const line = text.slice(0, offset + local).split('\n').length;
      failures.push(`${rel}:${line}: [${b.id}] ${b.why}`);
    }
  }
}

if (failures.length) {
  console.error(`assert-no-invalid-api-shapes: ${failures.length} violation(s)`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(`assert-no-invalid-api-shapes: ok (${files.length} 个跟踪文档 / ${BANNED.length} 条禁用形态，只查围栏代码块)`);
