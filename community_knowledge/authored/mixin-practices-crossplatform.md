---
id: authored/mixin-practices-crossplatform
title: Mixin 实务与兼容性（跨加载器）
tags: [mixin, inject, redirect, mixinextras, wrapoperation, accessor, mixins-json, fabric, forge]
summary: @Mixin 合并语义；@Inject/@Redirect/@Overwrite 兼容性排序；MixinExtras（WrapOperation 等，Fabric Loader 0.15+ 自带）优先；mixins.json 注册要点；唯一命中描述符、私有成员 Accessor；调试与冲突排查。
mcHint: 概念全版本通用；MixinExtras 随 Fabric Loader 0.15+ / NeoForge 自带
sourceKind: authored
---

# Mixin 实务与兼容性（跨加载器）

自写短文。依据 Fabric Wiki Mixin 系列导论页（原文已核对）+ 本仓库已有 `mc-mixin` skill / `permitted/mcmod-3993` mixin 篇交叉整理。**Mixin 是最后手段**：能事件/原版 API 解决的不要 mixin。

## 心智模型

- Mixin 在目标类**加载前**改写字节码，把你的成员「合并」进目标类；运行时 mixin 类本身不存在（Accessor 除外）。
- 所以：mixin 类不能被 new、不能静态引用其成员；方法签名/字段名必须与目标（按 mappings）完全一致。
- 需要「字节码视角」读目标：`INVOKEVIRTUAL owner.method(desc)`；IDE 装 MCDev（IntelliJ）插件辅助。

## 手段选择（按兼容性从好到坏）

| 手段 | 行为 | 多 mod 同点 | 建议 |
|------|------|-------------|------|
| `@Inject`（含 `locals`/`cancellable`） | 在 `@At` 点前后插入逻辑，不动原指令 | ✅ 可叠加 | **首选** |
| MixinExtras `@ModifyExpressionValue` / `@ModifyReturnValue` 等 | 包一层结果修改 | ✅ 可链式 | **优于裸 Redirect** |
| `@ModifyArg` / `@ModifyVariable` / `@ModifyConstant` | 改参数/局部变量/常量 | 视位置 | 谨慎 |
| `@Redirect` | 替换掉一条目标指令 | ❌ 一对一独占 | 尽量换 WrapOperation |
| `@Overwrite` | 整个方法重写 | ❌ 必然冲突 | 几乎禁用 |

- **MixinExtras**：Fabric Loader 0.15+ 与新版 NeoForge 自带，直接 import 用，不用额外依赖声明（老环境才要自带 jar）。
- `@Redirect` 的排他性 = 你的 mod 会和任何同点 redirect 冲突；这是「我的 mod 和 XX 不兼容」的头号来源。

## mixins.json 与注册

```json
{
  "required": true,
  "package": "com.example.mixin",
  "compatibilityLevel": "JAVA_17",
  "minVersion": "0.8",
  "client": ["ClientOnlyMixin"],
  "mixins": ["CommonMixin"],
  "injectors": { "defaultRequire": 1 }
}
```

- 每个 mixin 类都要登记进对应数组；`client` 数组里的类只进客户端 jar 环境（服务端不加载）。
- `defaultRequire: 1` 表示注入失败即崩——开发期保留（早暴露），发布可权衡降级为 soft。

## 各平台启用 Mixin 的方式

| 平台/时代 | 启用途径 | 备注 |
|-----------|----------|------|
| Fabric（全版本） | Loader 原生：mixins.json 在 `fabric.mod.json` 的 `"mixins"` 数组登记 | 无需额外依赖 |
| Forge **1.8–1.12.2** | **MixinBooter**（CleanroomMC，单构建覆盖全区间）：路线一 = 依赖 `zone.rong:mixinbooter` + 实现 `ILateMixinLoader`/`IEarlyMixinLoader` 声明 config；路线二 = MixinGradle 插件生成 refmap。内置 MixinExtras。上游：https://github.com/CleanroomMC/MixinBooter | 中文教程见 `links/mcmod-dev-tutorials`（3340） |
| Forge 1.16–1.20.x / NeoForge | dev 期用 MixinGradle 类插件出 refmap、运行时由 loader 装载 mixin config；**具体声明方式随版本演进** | 写码前以当档 `search_forge_docs` / `search_neoforge_docs`（关键词 mixin）核实 |


## 高频坑

1. **描述符对不上静默失效或崩溃**：`method = "methodName(Lnet/minecraft/…;)V"` 里名字随 mappings（Yarn vs Mojmap）不同——抄别人的 mixin 先换算成工程映射。
2. **私有字段访问**：用 `@Accessor`/`@Invoker` 接口生成 getter/setter/invoke，不要反射硬来。
3. **客户端类混入公共 mixin**：目标是 client-only 类（如 Screen）时必须放 `client` 数组 + 类内不 import 服务端会碰的东西。
4. **`<init>`/`<clinit>` 目标**：构造器注入 `method = "<init>"` + `at = @At("TAIL")`（RETURN 可能多处命中）。
5. **泛型擦除后的 desc**：`List<BlockPos>` 在字节码里就是 `Ljava/util/List;`。

## 排查清单

- 注入没生效：先查 mixins.json 是否登记 → target 类名是否映射正确 → `@At` 点是否存在（加 `-Dmixin.debug.countInjections=true` 或 MCDev dump 对照）。
- 启动崩在 mixin prepare：compatibilityLevel 过低或包路径错。
- 与他 mod 冲突：看崩溃栈里同目标的其它 mixin；优先把自己的 Redirect 改成 Inject/WrapOperation 让位。

## 自检

- 干净环境启动 + 装常见大 mod 后启动（兼容冒烟）。
- 专用服启动（验证没有 client-only 泄漏进公共 mixin）。
- 注入点日志确认命中次数符合预期。

## 不清楚时

- Fabric Wiki 系列：https://wiki.fabricmc.net/tutorial:mixin_introduction （glossary/first-mixin/registration/@Inject/accessors/redirectors/tips/examples 各分页）
- MixinExtras 中文详解+Wiki 翻译：https://www.mcmod.cn/post/6498.html
- Mixin 官方 javadoc 与 SpongePowered wiki；MixinExtras: https://github.com/LlamaLad7/MixinExtras
- 本仓库：skill `mc-mixin`、`permitted/mcmod-3993/mixin-basics`
