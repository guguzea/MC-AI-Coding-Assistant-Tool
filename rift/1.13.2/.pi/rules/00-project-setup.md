---
description: 00 — Rift 工程
---

# 00 — Rift 工程

- `tweaker-client` + `RiftLoaderClientTweaker` + Java 8
- `riftmod.json` 在 `src/main/resources`
- 依赖：`libs/rift-1.0.4-106.jar`（**非 dev** —— 2026-10-05 真机：dev jar 缺 `mixins.rift.refmap.json`、运行期 `InvalidMixinException: No refMap loaded`；非 dev 件含 14 225 B refmap、客户端能起）。scaffold 实钉在 `scaffold/build.gradle:51` 的 `implementation name: 'rift-1.0.4-106'`（旧本行引用的 `build.gradle:19` 与 `rift-1.0.3-45-dev` 均失实，2026-10-06 更正）；取法（JitPack curl + sha256）见 `scaffold/libs/README.md`。wiki 曾写 `implementation 'org.dimdev:rift:1.0.3-45:dev'` + 官方 maven `https://www.dimdev.org/maven/`：**坐标 JitPack 上不存在、maven 域名 DNS ENOTFOUND**（2026-10-05 实测）⇒ 禁止照抄
