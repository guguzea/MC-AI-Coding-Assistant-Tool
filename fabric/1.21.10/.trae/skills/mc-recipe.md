---
name: mc-recipe
description: Fabric 1.21.10 mc-recipe。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.10"
docsTool: search_fabric_docs
mappings: yarn
mappings_alt: mojmap
---

# mc-recipe（Fabric 1.21.10）

### ⚠️ 映射口径：本档语料是 mojmap

本件正文出现的下列名字是 **mojmap（Mojang 官方映射）/ 上游文档页写法**，本档 frontmatter 已声明 `mappings: yarn`，落笔须用右列。两套名不能混用。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `RecipeProvider` | `RecipeGenerator` | 1.21.3–1.21.11 | join（`net.minecraft.data.recipe.RecipeGenerator`） |

- 上表只证**类名存在与包路径**，**不证**方法名/参数/返回值。逐签名以本档语料为准：`search_fabric_docs version=1.21.10`，或 `get_minecraft_source`（需 JDK 17+）/ IDE `./gradlew genSources`。
- 两套同名的类（`ItemStack` / `BlockPos` 等）不在表内，直接写。`net.fabricmc.fabric.api.*`（Fabric API 自身不混淆）与示例工程自造类名也不在表内。

核实表：knowledge/common/verified-api-1.21.10.md。
必须 search_fabric_docs query=recipes version=1.21.10。核不到禁止默写。

RecipeProvider 加到 DataGeneratorEntrypoint。

反面：DeferredRegister、SimpleChannel、邻档 Yarn 记忆、1.21.11 wiki。
