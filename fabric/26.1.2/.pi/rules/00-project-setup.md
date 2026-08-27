---
description: 00 — 工程（26.1.2）
---

# 00 — 工程（26.1.2）

文档：`26.1.2/develop_getting-started_creating-a-project`、`26.1.2/develop_getting-started_building-a-mod`、`26.1.2/develop_loader_fabric-mod-json`、`26.1.2/develop_loom_index`、`26.1.2/develop_porting_index`。

## Decision Flow

```
→ 新建工程 → Fabric Template Mod Generator（creating-a-project）
→ 从 1.21.11 移植 → develop_porting_index：Java 25、去掉 mappings、Loom 插件 id 换成 net.fabricmc.fabric-loom、implementation 取代 modImplementation、jar 取代 remapJar、AW header official
→ 元数据 → fabric.mod.json（develop_loader_fabric-mod-json），id 全小写无 -
→ 禁止 Yarn；禁止读 1.21.11 规则；禁止为 26.2 克隆 data/fabric_26.2
```
