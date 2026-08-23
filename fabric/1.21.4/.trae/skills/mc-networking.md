---
name: mc-networking
description: Fabric 1.21.4 mc-networking。类名只来自本档核实表与 search_fabric_docs。
platform: fabric
version: "1.21.4"
docsTool: search_fabric_docs
---

# mc-networking（Fabric 1.21.4）

> 本档为**薄档**（Fabric 1.21.4）。
> 文档树核实：`data/fabric_1.21.4/fabric-docs/1.21.4/processed/develop_networking.md`（id `develop-networking`）**已入库**——与 1.21.1 不同，本版有网络页。
> 本档已核实 API（`knowledge/common/verified-api-1.21.4.md`）：PayloadTypeRegistry.playS2C / playC2S、CustomPayload.Id、PacketCodec、ServerPlayNetworking.send / registerGlobalReceiver、ClientPlayNetworking.send / registerGlobalReceiver。
> 官方 URL：https://docs.fabricmc.net/develop/networking 。

## 入口（1.21.4 页正文核实）

- 定义：Java `Record` 实现 `CustomPayload`；三个静态件：标识 ID（页内用 `ResourceLocation`）、`CustomPayload.Id`、`PacketCodec`；覆写 getId 返回包 ID。
- 注册（共通 initializer）：`PayloadTypeRegistry.playS2C().register(Id, Codec)`；C2S 用 `playC2S()`。
- 发送：`ServerPlayNetworking.send(ServerPlayer, payload)`（服务端发起，先 isClient 检查早退）；`ClientPlayNetworking.send(payload)`（客户端发起）。
- 接收：客户端 initializer 里 `ClientPlayNetworking.registerGlobalReceiver(Id, handler)`；服务端在**共通 initializer** 里 `ServerPlayNetworking.registerGlobalReceiver`；handler 为 `PlayPayloadHandler` 函数式接口（lambda）。
- 查找玩家集合：页面用 `PlayerLookup`；**tracking** = 视图距离内才需要通知（页面明示）。

## 行为边界

- 逻辑端：单机/LAN 也有逻辑服务端；服务端是权威。不同步 = desync。
- **服务端校验**（页面示例）：按网络 ID 找实体 → 必须存在、必须为目标类型（living）、距离 ≤ 5；校验通过才应用效果。
- 按 tracking 分发，不要全服广播；实体/位置类数据用可靠通道语义。

## 本版差异（已核实）

- 本页包 ID 写作 `ResourceLocation`（Mojang 风格名）；`CustomPayload` + `PacketCodec` 体系与 1.21.8 相同。
- 与 1.21.10 不同：1.21.10 页出现 `CustomPacketPayload` + `StreamCodec`；与 26.1.2 不同：26.1.2 是 `CustomPacketPayload.Type` + `clientboundPlay()/serverboundPlay()`。
- 本档无其它网络页；细化（如 QUERY 包、handler 细节）以该版 search_fabric_docs 为准。

## 区块级 / 插值 / 大包（策略小节；不写类名）

- 区块级：客户端坐标 → 先做已加载校验再访问；按「需要的客户端集合」（tracking）分发。
- 插值：高频数据降频 + 发差值，客户端平滑；瞬时单值用单包。
- 大包：批量列表/容器拆多包或增量；发变化片段不发表；频率设上限（每 tick 一次）。
- 维度切换/会话变化：客户端收包先做玩家/维度匹配校验，不匹配丢弃。

## 配合 Skill

- `mc-gui`（GUI 同步）、`mc-entity`（实体状态）、`06-networking.mdc`
