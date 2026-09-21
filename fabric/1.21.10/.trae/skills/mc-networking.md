---
name: mc-networking
description: Fabric 1.21.10 mc-networking。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.10"
docsTool: search_fabric_docs
mappings: yarn
mappings_alt: mojmap
---

# mc-networking（Fabric 1.21.10）

### ⚠️ 映射口径：本档语料是 mojmap

本件正文出现的下列名字是 **mojmap（Mojang 官方映射）/ 上游文档页写法**，本档 frontmatter 已声明 `mappings: yarn`，落笔须用右列。两套名不能混用。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `CustomPacketPayload` | `CustomPayload` | 1.20.4–1.21.11 | join（`net.minecraft.network.packet.CustomPayload`） |
| `ResourceLocation` | `Identifier` | 1.14.4–1.21.10 | join（`net.minecraft.util.Identifier`） |
| `ServerPlayer` | `ServerPlayerEntity` | 1.14.4–1.21.11 | join（`net.minecraft.server.network.ServerPlayerEntity`） |
| `StreamCodec` | `PacketCodec` | 1.21.1–1.21.11 | join（`net.minecraft.network.codec.PacketCodec`） |

- 上表只证**类名存在与包路径**，**不证**方法名/参数/返回值。逐签名以本档语料为准：`search_fabric_docs version=1.21.10`，或 `get_minecraft_source`（需 JDK 17+）/ IDE `./gradlew genSources`。
- 两套同名的类（`ItemStack` / `BlockPos` 等）不在表内，直接写。`net.fabricmc.fabric.api.*`（Fabric API 自身不混淆）与示例工程自造类名也不在表内。

> 本档为**薄档**（Fabric 1.21.10）。
> 文档树核实：`data/fabric_1.21.10/fabric-docs/1.21.10/processed/develop_networking.md`（id `develop-networking`）已入库。
> 本档已核实 API（`knowledge/common/verified-api-1.21.10.md`）：PayloadTypeRegistry.playS2C / playC2S、CustomPayload.Id、PacketCodec、ServerPlayNetworking.send / registerGlobalReceiver、ClientPlayNetworking.send / registerGlobalReceiver（表内为 1.21.10 档口径，以表为准）。
> 官方 URL：https://docs.fabricmc.net/develop/networking 。

## 入口（1.21.10 页正文核实——注意本页是过渡态）

- 定义：Java `Record` 实现 **`CustomPacketPayload`**（页内写实）；而 ID 类型页内仍写 **`CustomPayload.Id`**；序列化改 **`StreamCodec`**（页内核实；与 1.21.8 的 `PacketCodec` 不同）。
- 注册：共通 initializer 中 `PayloadTypeRegistry.playS2C().register(...)` / `playC2S().register(...)`（**未**变 26.1.2 的 clientboundPlay/serverboundPlay）。
- 发送：`ServerPlayNetworking.send(ServerPlayer, payload)` / `ClientPlayNetworking.send(payload)`。
- 接收：客户端 initializer `ClientPlayNetworking.registerGlobalReceiver`；服务端共通 initializer `ServerPlayNetworking.registerGlobalReceiver`；handler = `PlayPayloadHandler`（lambda）。
- 玩家集合：`PlayerLookup`；tracking = 视图距离内才通知。

## 行为边界

- 逻辑端与 desync 概念同官方口径；服务端是权威。
- **服务端校验不可省**（按网络 ID 找实体 → 存在、类型、距离 ≤ 5）。
- 面向 tracking 集合分发，不做全服广播。

## 本版差异（已核实）

- 本页自身混用新旧名（`CustomPacketPayload` 与 `CustomPayload.Id` 并存、`StreamCodec` 出现）——**这是页面原文的过渡态**，选型前必须 `search_fabric_docs query=networking version=1.21.10` 逐项确认，禁止凭本页一处措辞下结论。
- 与 1.21.4/1.21.8 不同：后两者为 `CustomPayload` + `PacketCodec`。
- 与 26.1.2 不同：26.1.2 为 `CustomPacketPayload.Type` + `Identifier` 口径 + `clientboundPlay()/serverboundPlay()`。
- 页内 ID 写作 `ResourceLocation`（文档风格名），确切包名以本版核实为准。

## 区块级 / 插值 / 大包（策略小节；不写类名）

- 区块级：客户端坐标先做已加载校验；按需要的客户端集合（tracking）分发。
- 插值：高频降频 + 差值；瞬时单值单包。
- 大包：批量拆多包/增量；发变化片段；频率上限每 tick 一次。
- 维度/会话变化：收包先做玩家匹配校验。

## 配合 Skill

- `mc-gui`、`mc-entity`、`06-networking.mdc`
