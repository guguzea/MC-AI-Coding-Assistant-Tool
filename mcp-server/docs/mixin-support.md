# Mixin / AT / AW 校验支持矩阵（T4）

`mixin_analyze`、`validate_at`、`validate_aw` 的校验能力说明（Wave D，依赖 T2 的 jar 缓存管线）。

## 1. `mixin_analyze` 两级模式

### 1.1 静态路径（默认，`deep` 缺省 / `false`）

正则 + 映射层解析，**零字节码依赖、零网络、零下载**。与历史行为完全一致：

| 支持形态 | 说明 |
|---|---|
| SRG `func_123_a` / `field_123_a` | 经 `convert_mapping`（mcp 层）解析 |
| Yarn `method_123` / `field_123` | 经 yarn-sqlite 解析 |
| Mojang `m_123_` | 经 mojang 层解析 |
| 可读方法名 + ownerClass | 经 `query_api` 确认（重载 → AMBIGUOUS 引导补 desc） |
| `method+desc` 一体字符串 | `hurt(Lnet/minecraft/...;F)V` |
| `@Inject method + desc` 分离 | `method=..., desc=...` |
| `method = { "a", "b" }` 数组 | 逐个展开 |

输出：`{ok, version, mixinsJson, mixins[], warnings, errors, supportMatrix}`。

### 1.2 字节码深度校验（`deep: true`）

在静态结果**之后纯附加** `deepResult` 字段，静态字段零改动。需要目标版本的
**remapped 客户端 jar**（T2 `get_minecraft_source` 产物，`$MC_SKILL_CACHE`）：

| 场景 | 行为 |
|---|---|
| jar 未缓存（默认缓存为空） | `deepResult = {available:false, action: CACHE_MISS}`，引导先调 `get_minecraft_source`（**绝不自动下载**） |
| `jarPath` 显式传入 | 优先使用该 jar（`jarPath` > 缓存扫描） |
| jar 可用 | 真实字节码校验（见下），`deepResult = {available:true, verified, errors[], warnings[], checkedTargets, jarPath, mapping}` |

字节码级校验内容：

1. **目标类存在性**：`@Mixin` 目标在 jar 中不存在 → error + 建议（含映射层/内部类提示）。
2. **可访问性**：private（内部）类 → error；final 类 → warning（mixin 可注入 final 类，
   但其中的 final 方法无法 `@Overwrite`）。
3. **方法选择器**：`method` / `method[]` 与 jar 字节码方法表（名 + descriptor）匹配；
   本类 + 父类继承链；无 descriptor 时多重重载 → AMBIGUOUS warning + 候选列表；
   混淆/SRG 名与命名层 jar 不匹配 → error + `convert_mapping` 建议。
4. **`@At(target=...)` 调用点**：INVOKE 类 @At → 目标方法必须存在（继承链）；
   FIELD 类 @At → 目标字段必须存在（含 record 组件）；且**选择器方法体内必须真实
   出现对该目标的调用**（调用点指令匹配）——不存在则 error + 建议核对 selector/target。
5. `@Overwrite` 目标为 final 方法 → warning。

## 2. `validate_at`（Forge / NeoForge Access Transformer）

参数：`{atContent?, projectPath?, version?, jarPath?}`（`atContent` 与 `projectPath` 至少其一；可合并）。

| 校验项 | 说明 |
|---|---|
| 行格式 | `<access> <owner> [<member> [<descriptor>]]`，access ∈ public/protected/private（可带 `-f` / `-static`） |
| 类存在性 | owner 类必须在 jar 中；支持 `Outer$Inner` 与 `Outer.Inner` 归一化 |
| 成员存在性 | 本类 + **父类继承链**（继承成员声明于父类 → 通过 + warning 注明声明类）；record 组件视为可达 |
| 映射层不匹配 | jar 为 yarn/mojmap 而 AT 用 SRG/混淆名 → error + `convert_mapping` 建议 |
| 跨文件冲突 | 同一 `atContent` 内用 `# ===== file: 名字 =====` 分隔多个文件；同一类/成员被不同 access 修改 → `crossFileConflicts`；完全重复 → warning |
| `projectPath` | 只读扫描 `**/META-INF/*_at.cfg`；**跳过** `node_modules` / `build` / `.gradle` / `.git` / `run` / `out` / `dist` / `bin` / `.idea` 等 |

输出：`{ok, valid, errors[], warnings[], checkedMembers, crossFileConflicts, version, jarPath, mapping, scannedFiles?}`。
jar 不可用 → `{ok:false, action: CACHE_MISS}`（引导 `get_minecraft_source` / 传 `jarPath`）。

## 3. `validate_aw`（Fabric Access Widener）

参数：`{awContent?, projectPath?, version?, jarPath?}`（`awContent` 与 `projectPath` 至少其一）。

| 校验项 | 说明 |
|---|---|
| header | `accessWidener v[12] <namespace>`；namespace ∉ named/intermediary/official → warning |
| 条目格式 | `[transitive ]<accessible\|extendable\|mutable> <class\|method\|field> <owner> [<member> <descriptor>]` |
| 类/成员存在性 | 同 AT 框架（继承链 / record / 内部类） |
| Fabric 语义 | `transitive` 仅 v2（v1 使用 → warning）；`extendable` 目标是 final 类 → warning；`mutable` 用于方法 → warning |
| 跨文件冲突 | `# ===== file: 名字 =====` 分隔多文件；同目标不同类型 → 冲突；transitive 标记不一致 / 重复 → warning |
| `projectPath` | 只读扫描 `**/*.accesswidener`（同样排除构建/IDE 目录） |

输出形状同 `validate_at`。

## 4. jar 定位优先级

`jarPath` 参数 > `$MC_SKILL_CACHE` 缓存扫描（`remapped/minecraft-<version>-*.jar`
（优先 yarn 再 mojmap）> `remapped/<version>/*.jar` > `jars/minecraft-<version>-client.jar`）。
全部未命中 → `CACHE_MISS`（**不自动下载**，遵守离线优先红线）。

## 5. `@At(HEAD|RETURN|TAIL)` 位置语义

无 `target` 时仅作**存在性级**位置标注：不按「调用点缺失」报错（非完整注入点仿真）。
有 `target` 时仍走 INVOKE/FIELD 存在性与调用点匹配逻辑。

## 6. 边界与诚实失败

- 所有新路径沿用 `actionable()` envelope：`CACHE_MISS` / `NOT_FOUND` / `INVALID_INPUT` /
  `DEEP_VALIDATION_FAILED`，禁假成功。
- 字节码解析失败（非 class 文件 / 截断 jar）→ 可操作错误，进程不崩溃。
- `deep` 默认 false，静态路径零回归（`test-deep-mixin.mjs` 断言输出形状逐字段不变）。
- **D3 有意偏离**：classfile / jar 解析为纯 Node（`src/mixin/bytecode.ts`），**不**起 Java 子进程做字节码分析。

## 7. private 内部类

目标类 `ACC_PRIVATE`（常见于 `Outer$Inner`）→ deep 校验 error：`目标类是 private（内部类），mixin 无法注入` + suggestion。