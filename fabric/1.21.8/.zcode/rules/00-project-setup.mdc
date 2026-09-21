---
description: 00-project-setup Fabric 1.21.8
alwaysApply: true
---

# 00-project-setup — 工程（Fabric 1.21.8）

来源：search_fabric_docs version=1.21.8。核实表 knowledge/common/verified-api-1.21.8.md。

Java 21。Loom id net.fabricmc.fabric-loom-remap（remap 线专用；26.x 去混淆用 net.fabricmc.fabric-loom）。download_official_mdk 若无 pin 则 MDK_NOT_PINNED。

**映射口径（本档讲解基线 = Yarn，Mojmap 作对照列）**：本档核实表 `knowledge/common/verified-api-1.21.8.md` 通篇写 Yarn 名（`CustomPayload.Id` / `PacketCodec`，无一个 mojmap 名），本档 24 件 Skill 的 frontmatter 也是 `mappings: yarn` —— 落笔按 Yarn。上游文档页正文用 Mojang 名（`ResourceLocation` / `StreamCodec` / `CustomPacketPayload`），查文档看到它们是**口径差异不是另一套 API**，回本档代码仍写 Yarn 名。逐件对照见各 Skill 正文「映射口径」块；数据 = Mojang `client.txt` ⋈ `data/fabric_1.21.8/mappings/yarn-mappings.sqlite` 的 obf 短名 join（本档 9020 对、obf 键零冲突）。⚠️ 官方模板里的 `mappings loom.officialMojangMappings()` 是**显式声明改用 mojmap**，不是 Loom 免声明的默认（`migrateMappings --mappings` 默认值仍是 `net.fabricmc:yarn:<version>:v2`），"升了版就不用写 yarn_mappings"不要采信。禁止同一段代码混用两套名；升 26.1 前必须先转 Mojmap（26.1 去混淆后无 Yarn 层）。本档渲染另有 1.21.8 起的 `HudElementRegistry` / `Matrix3x2fStack`，与 1.21.4 不同，见 `mc-renderer`。
