---
name: mc-networking
description: Fabric 网络通信。PayloadTypeRegistry、CustomPayload、ServerPlayNetworking。触发词：网络、Networking、CustomPayload、PayloadTypeRegistry
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.21.11）

> 核实源：`data/fabric_1.21.11/fabric-docs/1.21.11/processed/develop_networking.md`（id `develop-networking`；官方 https://docs.fabricmc.net/develop/networking ）。
> **本档有网络页**——与 1.21.1 不同（1.21.1 树缺页、缺页注记见 1.21.1 档）；页为**过渡态**（新旧名并存，看下文）。
> 本包 `mappings: yarn`；【口径冲突提示】页面给 Mojang/官方名（`CustomPacketPayload`/`StreamCodec`/`LocalPlayer` 等），而包内 `06-networking.mdc` 与既有骨架采用 Yarn 口径（`CustomPayload` + `PacketCodec` + `net.minecraft.util.Identifier.of`）——**两者不一致处一律以 `search_fabric_docs version=1.21.11` 复核为准，禁止默写**。

## 版本事实（本页正文核实）

- 包（packet）是网络核心；单机/LAN 也有**逻辑服务端**（集成服与专用服都是逻辑服务端，仅专用服是物理服务端）；不同步 = **desync**。
- payload = 包内数据；**tracking** = 视图距离内已知，「只通知需要知道的玩家」是高效网络原则。

## 自定义 payload 五步（本页正文核实）

1. **定义**：Java `Record` 实现 **`CustomPacketPayload`**（页内参数例：`BlockPos`）；页内 ID 用 **`Identifier`**（例 `example-mod:summon_lightning`）；静态件：**`CustomPayload.Id`**（页内写法；26.1.2 页为 `CustomPacketPayload.Type`）、**`StreamCodec`**；覆写 `type` 返回 payload ID。
2. **注册**：共通 initializer 中 `PayloadTypeRegistry.playS2C().register(Id, StreamCodec)`；C2S 用 **`PayloadTypeRegistry.playC2S().register`**（26.1.2 的 `clientboundPlay()/serverboundPlay()` 是本版以前/以后的变化，勿混）。
3. **服务端发送**：`ServerPlayNetworking.send(ServerPlayer, payload)`——仅服务端发起（页内先 `isClient` 检查早退）；玩家集合用 **`PlayerLookup`**（tracking 语义）。
4. **客户端发送**：`ClientPlayNetworking.send(payload)`；客户端触发侧用 **`isClientSide()`** 确保仅逻辑客户端执行（页内此处写法；与步骤 3 的 `isClient` 是页面自身混用）。
5. **接收**：客户端 initializer `ClientPlayNetworking.registerGlobalReceiver(Id, handler)`；服务端共通 initializer `ServerPlayNetworking.registerGlobalReceiver`；handler = **`PlayPayloadHandler`** 函数式接口（lambda）。

## 行为边界（页面核实）

- **服务端校验不可省**（页面示例）：按网络 ID 找实体 → 存在、目标类型（living）、距玩家 ≤ 5，全部通过才应用效果。
- 按 tracking 集合分发，不向全服广播。
- 禁用 SimpleChannel 等 Forge 网络体系；禁用旧世代 `ClientSidePacketRegistry`/`FabricPacket`（骨架原有反模式成立）。

## 与 26.1.2 差异（已核实）

| 项 | 1.21.11 页 | 26.1.2 页 |
|----|-----------|-----------|
| payload 接口 | CustomPacketPayload | CustomPacketPayload |
| ID 类型页内写法 | CustomPayload.Id | CustomPacketPayload.Type |
| 编解码 | StreamCodec | StreamCodec |
| 注册 | playS2C / playC2S | clientboundPlay / serverboundPlay |
| 包 ID 名 | Identifier | Identifier |

> 与 1.21.4/1.21.8（CustomPayload + PacketCodec）也不同；与 1.21.10（CustomPacketPayload + CustomPayload.Id + StreamCodec，但页内 ID 名 `ResourceLocation`）只有包 ID 名差异。**禁止跨版套用**，各行以各自版本文档为准。

## 区块级 / 插值 / 大包（策略小节；不写类名）

- 区块级：客户端坐标先做**已加载校验**再访问方块；按需要的客户端集合（tracking）分发。
- 插值：高频数据降频 + 发差值；瞬时单值用单包。
- 大包：批量列表/容器拆多包或增量；发变化片段不发表；频率上限每 tick 一次。
- 维度切换/会话变化：客户端收包先做玩家/维度匹配校验，不匹配丢弃。

## 核不到时

- `search_fabric_docs`（version=1.21.11）无结果 → 停止输出；禁止 1.21.11 wiki / 1.21.x 记忆顶上；禁止把 26.1 页当本版全文。

## 下一步

- `get_doc_full`（id `develop-networking`）取参考代码段落后再示例化；示例引用页内含的 `PlayerLookup`/校验模式。
