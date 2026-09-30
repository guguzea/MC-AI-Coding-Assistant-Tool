# Fabric 1.21.4 scaffold

只引用 data/fabric_1.21.4 已核实口径。search_fabric_docs version=1.21.4。
禁止抄 fabric/1.21.11/scaffold。无 wiki。Java 21。Loom：id "net.fabricmc.fabric-loom-remap"（remap 线专用；26.x 去混淆用 net.fabricmc.fabric-loom）。

## 兼容声明（钉值）

- 本目录 `gradle.properties` / `build.gradle` 里的版本钉值随 modloader 与工具链演进，**可能过期或与最新构建不兼容**。实测例：`fabric-language-kotlin` 1.14.1 要求 `fabricloader >=0.19.5`，而某档钉 0.19.3 时 `runClient` 在依赖解析阶段直接拒启（`Incompatible mods found!`，无崩溃报告）。
- **钉值仅供参考，一律以实际解析结果与该 loader / 库的官方发布为准**；引用前按当前 maven / Modrinth 事实核对。
- 发现钉值过期或有误，请提 issue：<https://github.com/guguzea/MC-AI-Coding-Assistant-Tool/issues>

