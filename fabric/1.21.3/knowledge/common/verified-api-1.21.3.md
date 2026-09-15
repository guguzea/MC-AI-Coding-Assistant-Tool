# Fabric 1.21.3 已核实 API

来源（本档特殊，先读再抄）：
1. **本档没有官方 develop 文档树** —— `data/fabric_1.21.3/fabric-docs/1.21.3/failures.json` 原文：
   `"reason": "no fabric-docs versions/ tree for this MC version; search wiki or DOC_NOT_FOUND"`。
   所以**禁止**把 1.21.4/1.21.11 的 develop 文档当本档（同 `verified-api-1.21.4.md` 的纪律）。
2. 本表可核来源只有两个：
   - `fabric-wiki` 1.21.3 快照（`data/fabric_1.21.3/fabric-wiki/1.21.3/processed/*.md`，7 页）；
   - `loader-api-summaries/1.21.3-fabric-api.json`（source=official，`yarn-1.21.3+build.2`，
     1192 类，从官方 fabric-api 的 sources jar 抽出）。

| 名称 | 出处 |
|------|------|
| `Registry.register(Registries.*, …)`（vanilla/共享，非 FAPI 专属） | wiki 1.21.3/tutorial_blocks |
| `Identifier.of(namespace, path)`（1.21+ 形态；`new Identifier(…)` 已弃用，见 wiki 双写示例） | wiki 1.21.3/tutorial_blocks |
| `Item.Settings`（yarn 侧命名；mojmap 侧为 `Item.Properties`） | wiki 1.21.3/tutorial_blocks |
| `ItemGroupEvents.modifyEntriesEvent` / `$ModifyEntries` | loader-api-summaries 1.21.3-fabric-api（`net.fabricmc.fabric.api.itemgroup.v1`） |
| `FabricItemGroup` / `FabricItemGroupEntries` | loader-api-summaries 1.21.3-fabric-api（同上包） |
| `PayloadTypeRegistry.playS2C / playC2S` | loader-api-summaries 1.21.3-fabric-api（`…api.networking.v1`） |
| `ServerPlayNetworking.send / registerGlobalReceiver`（`$Context` / `$PlayPayloadHandler`） | loader-api-summaries 1.21.3-fabric-api（同上包） |
| `ClientPlayNetworking.send / registerGlobalReceiver`（`…api.client.networking.v1`） | loader-api-summaries 1.21.3-fabric-api |
| `FuelRegistryEvents.BUILD`（`$BuildCallback` / `$ExclusionsCallback`） | loader-api-summaries 1.21.3-fabric-api（`…api.registry`） |
| `FabricBlockEntityTypeBuilder` / `.Factory` | loader-api-summaries 1.21.3-fabric-api（`…object.builder.v1.block.entity`） |
| `DataGeneratorEntrypoint#onInitializeDataGenerator` | loader-api-summaries 1.21.3-fabric-api（`…api.datagen.v1`） |
| loom（版本见本档 `scaffold/` 的 `pack.meta.json`，buildVerified=true；本档无 loom 文档可引） | scaffold 真机构建 |

**本档与 1.21.4 表的三处已知差异（版本差异实证，勿照抄 1.21.4）**：
- `CompostableItemRegistry`：**1.21.3 无**（1.21.3-fabric-api 摘要零命中；1.21.4 才引入）。
- `CustomPayload.Id / PacketCodec`：1.21.3 的 fabric-api 摘要里只有 impl/mixin 侧类；正文该用
  vanilla `net.minecraft.network.protocol.common.custom.CustomPayload`（**本档无文档可核**，写作前先
  `query_api` 或自备 jar 走 `ingest_loader_api`）。
- `ItemGroupEvents` 在 1.21.3 已存在（与 1.21.4 相同），但**界面条目参数类型**以摘要签名为准，禁止默写。

核不到的类名写成「以该版文档为准，禁止默写」。
