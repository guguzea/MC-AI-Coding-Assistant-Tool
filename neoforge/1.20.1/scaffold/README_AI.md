# NeoForge 1.20.1 scaffold

最小入口：@Mod + DeferredRegister（见 1.20.1/concepts_registries）。
元数据以该版文档为准。不要抄 neoforge/1.20.4 scaffold。
MDK：无官方 pin 则 MDK_NOT_PINNED，禁止编 SHA。

## 兼容声明（钉值）

- 本目录 `gradle.properties` / `build.gradle` 里的版本钉值随 modloader 与工具链演进，**可能过期或与最新构建不兼容**。实测例：`fabric-language-kotlin` 1.14.1 要求 `fabricloader >=0.19.5`，而某档钉 0.19.3 时 `runClient` 在依赖解析阶段直接拒启（`Incompatible mods found!`，无崩溃报告）。
- **钉值仅供参考，一律以实际解析结果与该 loader / 库的官方发布为准**；引用前按当前 maven / Modrinth 事实核对。
- 发现钉值过期或有误，请提 issue：<https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/issues>

