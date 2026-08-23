---
name: mc-networking
description: Fabric 1.21.8 mc-networking。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.8"
docsTool: search_fabric_docs
---

# mc-networking（Fabric 1.21.8）

> 本档为**薄档**（Fabric 1.21.8）。
> 文档树核实：`data/fabric_1.21.8/fabric-docs/1.21.8/processed/develop_networking.md`（id `develop-networking`）已入库。
> 本档已核实 API（`knowledge/common/verified-api-1.21.8.md`）：PayloadTypeRegistry.playS2C / playC2S、CustomPayload.Id、PacketCodec、ServerPlayNetworking.send / registerGlobalReceiver、ClientPlayNetworking.send / registerGlobalReceiver。
> 官方 URL：https://docs.fabricmc.net/develop/networking 。

## 入口（1.21.8 页正文核实）

- 定义：Java `Record` 实现 `CustomPayload`；包 ID（页内 `ResourceLocation`）、`CustomPayload.Id`、`PacketCodec`；覆写 getId。
- 注册：共通 initializer 中 `PayloadTypeRegistry.playS2C().register(Id, Codec)`；C2S 用 `playC2S()`。
- 发送：`ServerPlayNetworking.send(ServerPlayer, payload)`（先 isClient 检查，仅服务端发起）；`ClientPlayNetworking.send(payload)`。
- 接收：客户端 initializer `ClientPlayNetworking.registerGlobalReceiver(Id, handler)`；服务端共通 initializer `ServerPlayNetworking.registerGlobalReceiver`；handler = `PlayPayloadHandler`（lambda）。
- 玩家集合：`PlayerLookup`；**tracking**：视图距离内才通知。

## 行为边界

- 逻辑端概念：单机/LAN 也有逻辑服务端；desync = 状态不同步。
- **服务端校验不可省**：按网络 ID 找实体 → 存在、目标类型、距离 ≤ 5。
- 面向 tracking 集合分发；不做全服广播。

## 本版差异（已核实）

- 与 1.21.4 完全同体系（CustomPayload.Id + PacketCodec + playS2C/playC2S）。
- 与 1.21.10 不同：1.21.10 页出现 `CustomPacketPayload` + `StreamCodec`。
- 与 26.1.2 不同：26.1.2 为 `CustomPacketPayload.Type` + `StreamCodec` + `clientboundPlay()/serverboundPlay()`，且包 ID 用 `Identifier` 口径。
- 页内 `ResourceLocation`/`ServerPlayer` 为文档风格名；确切签名以本版 search_fabric_docs 为准。

## 区块级 / 插值 / 大包（策略小节；不写类名）

- 区块级：客户端坐标先做已加载校验；按需要的客户端集合（tracking）分发。
- 插值：高频降频 + 差值，客户端平滑；瞬时单值单包。
- 大包：批量拆多包/增量；发变化片段；频率上限每 tick 一次。
- 维度/会话变化：收包先做玩家匹配校验。

## 配合 Skill

- `mc-gui`、`mc-entity`、`06-networking.mdc`
