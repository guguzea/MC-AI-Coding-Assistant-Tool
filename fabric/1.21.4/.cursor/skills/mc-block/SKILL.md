---
name: mc-block
description: Fabric 1.21.4 mc-block。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.4"
docsTool: search_fabric_docs
mappings: yarn
mappings_alt: mojmap
---

# mc-block（Fabric 1.21.4）

### ⚠️ 映射口径：本档语料是 mojmap

本件正文出现的下列名字是 **mojmap（Mojang 官方映射）/ 上游文档页写法**，本档 frontmatter 已声明 `mappings: yarn`，落笔须用右列。两套名不能混用。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `BlockBehaviour` | `AbstractBlock` | 1.16.5–1.21.11 | join（`net.minecraft.block.AbstractBlock`） |

- 上表只证**类名存在与包路径**，**不证**方法名/参数/返回值。逐签名以本档语料为准：`search_fabric_docs version=1.21.4`，或 `get_minecraft_source`（需 JDK 17+）/ IDE `./gradlew genSources`。
- 两套同名的类（`ItemStack` / `BlockPos` 等）不在表内，直接写。`net.fabricmc.fabric.api.*`（Fabric API 自身不混淆）与示例工程自造类名也不在表内。

核实表：knowledge/common/verified-api-1.21.4.md。
必须 search_fabric_docs query=blocks version=1.21.4。核不到禁止默写。

方块注册见 first-block 页。禁止默写邻档 BlockBehaviour 签名。

反面：DeferredRegister、SimpleChannel、邻档 Yarn 记忆、1.21.11 wiki。
