---
name: mc-networking
description: Fabric 26.1.2 mc-networking。核不到则 search_fabric_docs version=26.1.2，禁止输出。
platform: fabric
version: "26.1.2"
dependencies: []
mappings: official
---

# 网络（Fabric 26.1.2）

> 核实源：`data/fabric_26.1.2/fabric-docs/26.1.2/processed/develop_networking.md`（id `develop-networking`；官方 https://docs.fabricmc.net/develop/networking ）。
> 本版为**去混淆官方名**（`mappings: official`）：包 ID 口径 **`Identifier`**（页内 `Identifier.fromNamespaceAndPath` 是 26.1 系列写法）。
> 【路线处理】本技能原有骨架（Record 实现 CustomPacketPayload / PayloadTypeRegistry.clientboundPlay / StreamCodec 等）已用本版页面逐项复核，**修正后的口径见下**；凡本页没有的签名（如收/发上下文里的具体上下文类）一律不写。

## 版本事实（本页正文核实）

- 包（packet）是网络核心；单机/LAN 也有**逻辑服务端**（集成服与专用服都是逻辑服务端，仅专用服是物理服务端）；不同步 = **desync**。
- payload = 包内数据；**tracking** = 服务端实体/区块对客户端视图距离内已知，「只通知需要知道的玩家」是高效网络原则。

## 自定义 payload 五步（本页正文核实）

1. **定义**：Java `Record` 实现 **`CustomPacketPayload`**（页内参数例：`BlockPos`）；三静态件：`Identifier`（页内例 `example-mod:summon_lightning`）、嵌套 **`CustomPacketPayload.Type`**（页面正文出现 `CustomPayload.Type` 写法，即同一嵌套类型）、**`StreamCodec`**；覆写 type 返回 payload ID（1.21.1 的 `CustomPayload` + `PacketCodec` + `getId` 组合已换代）。
2. **注册**：共通 initializer 中 `PayloadTypeRegistry.clientboundPlay().register(Type, StreamCodec)`；C2S 用 **`PayloadTypeRegistry.serverboundPlay().register`**（不再 playS2C/playC2S）。
3. **服务端发送**：`ServerPlayNetworking.send(ServerPlayer, payload)`——只在服务端发起（页面示例先 `isClientSide()` 早退）；玩家集合用 **`PlayerLookup`**（tracking 语义）。
4. **客户端发送**：`ClientPlayNetworking.send(payload)`；客户端触发侧用 `isClientSide()` 确保只在逻辑客户端执行（页面示例注册在客户端 initializer）。
5. **接收**：客户端 initializer `ClientPlayNetworking.registerGlobalReceiver(Type, handler)`；服务端共通 initializer `ServerPlayNetworking.registerGlobalReceiver`；handler = **`PlayPayloadHandler`** 函数式接口（lambda）。

## 行为边界（页面核实）

- **服务端校验不可省**（页面示例）：按网络 ID 找实体 → 必须存在、必须为目标类型（living）、目标距玩家 ≤ 5，全部通过才应用效果——客户端包不可信。
- 按 tracking 集合分发，不向全服广播。
- 禁用 SimpleChannel 等 Forge 网络体系（本文件骨架原注成立）。

## 与 1.21.x 差异（本版要点）

| 项 | 1.21.1（文档树无页） | 1.21.4/1.21.8 | 1.21.10 | 26.1.2 |
|----|--------|--------|--------|--------|
| payload 接口 | 未核实 | CustomPayload | CustomPacketPayload（过渡态） | CustomPacketPayload |
| ID 类型 | 未核实 | CustomPayload.Id | CustomPayload.Id | CustomPacketPayload.Type |
| 编解码 | 未核实 | PacketCodec | StreamCodec | StreamCodec |
| 注册 | 未核实 | playS2C/playC2S | playS2C/playC2S | clientboundPlay/serverboundPlay |
| 包 ID 名 | 未核实 | ResourceLocation（页内） | ResourceLocation（页内） | **Identifier** |

> 上表只为差异提示；1.21.x 各行以各自版本文档为准，**禁止跨版套用**。

## 区块级 / 插值 / 大包（策略小节；不写类名）

- 区块级：客户端坐标先做**已加载校验**再访问方块；按需要的客户端集合（tracking）分发。
- 插值：高频数据降频 + 发差值；瞬时单值用单包。
- 大包：批量列表/容器拆多包或增量；发变化片段不发表；频率上限每 tick 一次。
- 维度切换/会话变化：客户端收包先做玩家/维度匹配校验，不匹配丢弃。

## 核不到时

- `search_fabric_docs`（version=26.1.2）无结果 → 停止输出；禁止 1.21.11 wiki / 1.21.x 记忆顶上；禁止把 26.1 克隆成 26.2。

## 下一步

- `get_doc_full`（id `develop-networking`）取参考代码段落后再示例化；示例引用页内含的 `PlayerLookup`/校验模式。
