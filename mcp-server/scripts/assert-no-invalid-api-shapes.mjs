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
  // ── sweep81 C-1：从「已修好的行为」回填**全局**回归判据 ─────────────────────────
  // 只收**全局无歧义**的族：任何平台/版本都不存在这个 Gradle 任务（上游 tasks 页 = 0；全仓
  // `.gradle/.kts` 里 `task loom` 定义 = 0；真实任务见 Loom develop 页：generateModJson /
  // download / enigma / validateMixinNames 与 genSources）。sweep80 已在 235 个文件里清掉 706 处，
  // 本规则防「再一次从邻档拷回」。**注意写法**：旧复核曾用 `gradlew loom` 漏掉 `gradlew clean loom`，
  // 这里两种形态都钉。
  {
    id: 'fabric-phantom-loom-task',
    re: /\.\/gradlew\s+(?:clean\s+)?loom\b/,
    why: '`loom` 不是 Gradle 任务（Task \'loom\' not found）；刷新映射后源码用 `./gradlew clean genSources`，任务名以 `./gradlew tasks` 为准',
  },
  // 版本区间型族（`Properties.of()` 正反两面 / 1.20+ 的 `TAB_MISC`）**不放在本门** ——
  // 本门设计是全局无版本上下文；版本区间判据在 assert-forge-blockshape-family.mjs（C-6）。
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
