---
name: mc-networking
description: Fabric 网络通信。PayloadTypeRegistry、CustomPayload、ServerPlayNetworking。触发词：网络、Networking、CustomPayload、PayloadTypeRegistry
platform: fabric
version: "1.21.1"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.21.1）

> **核实结论（先看这条）**：本版（1.21.1）文档树**没有 networking 页**。
> - `data/fabric_1.21.1/fabric-docs/1.21.1/processed/` 下无 `develop_networking.md`；
> - `data/fabric_1.21.1/meta.json` 的 `failures` 明确记录 `develop/networking.md`：1.21.1 尝试 5 个分支（versions/1.21.1、1.21.1.x-archive、archive/1.21.1、archive/1.21.1.x）全部失败，官方按未版本化页面处理（vitepress-skipped-unversioned）。
> 官方页面：https://docs.fabricmc.net/develop/networking （当前主站；历史版本靠站内版本切换，1.21.1 存档未必可得）。
> **策略**：本技能只写机制与决策，不把任何签名当 1.21.1 已核实；写代码前必须先 `search_fabric_docs version=1.21.1`。

## 概念基准（他版正文已入库，只作机制对照）

以下概念取自本仓库已入库的 `data/fabric_1.21.4/.../processed/develop_networking.md` 与 `data/fabric_26.1.2/.../processed/develop_networking.md`（两页同源，正文几乎一致）。**它们不是 1.21.1 签名依据**：

- 包（packet）是网络核心；客户端与服务端的几乎一切交互最终都走包。
- 单机/局域网也存在逻辑服务端：**logical client / logical server**；集成服与专用服都是逻辑服务端，只有专用服是物理服务端。
- 状态不同步 → **desync**（客户端与服务端对世界状态的看法不一致），自定义同步天然需要包。
- **payload** = 包内承载的数据。
- **tracking**：服务端某实体/区块在客户端视图距离内即为「已知」；只给需要知道的玩家发包，是高效网络的原则。
- 服务端是权威方：收到客户端包必须**校验**（示例按网络 ID 找实体 → 必须存在、类型相符、距离限制），防止恶意构造包。

## 1.21.4/1.21.8 页正文的自定义 payload 体系（对照参考，非本版结论）

- Java `Record` 实现 `CustomPayload`；包 ID 用 `CustomPayload.Id`；序列化用 `PacketCodec`；注册在**共通 initializer**：`PayloadTypeRegistry.playS2C().register(Id, Codec)` / `playC2S().register(...)`。
- 发送：`ServerPlayNetworking.send(ServerPlayer, payload)`（服务端发起，先用 isClient 类检查早退）；`ClientPlayNetworking.send(payload)`（客户端发起）。
- 接收：客户端 initializer 中 `ClientPlayNetworking.registerGlobalReceiver(Id, handler)`；服务端在共通 initializer 中 `ServerPlayNetworking.registerGlobalReceiver`；handler 是 `PlayPayloadHandler` 函数式接口（lambda）。
- 查找玩家集合：页面用 `PlayerLookup`（tracking 语义）。
- 26.1.2 已改名：`CustomPacketPayload` + `CustomPacketPayload.Type` + `StreamCodec` + `PayloadTypeRegistry.clientboundPlay()/serverboundPlay()`——**与 1.21.x 不同**。

**应用到 1.21.1 前**：逐项在 `search_fabric_docs query=networking version=1.21.1` 核对。本技能骨架早前注释「1.21+ 用 CustomPayload + PayloadTypeRegistry（不再是 ClientSidePacketRegistry 时代）」——方向性提示，签名一律以本版搜索为准，禁止默写。

## 决策

```
IF 服务端广播一个瞬间事件（爆炸/音效/粒子） → 尽量用服务端世界/实体 API 让 vanilla 自动广播，不手写包
IF 客户端发起动作（点击/交互） → C2S 包；服务端先校验再执行
IF 服务端 → 单个/特定玩家 → S2C 包；面向 tracking 集合，不向全服广播
IF 收客户端包 → 先校验（存在性/类型/距离/权限），再改世界
IF 高频数据（坐标/朝向/速度） → 见下方「区块级 / 插值 / 大包」
```

## 区块级 / 插值 / 大包（策略小节；与 Forge 版同文案，不写类名）

> 本节为策略级写法：只列决策与边界，具体类/方法签名一律以 `search_fabric_docs`（networking 页核实数据）为准，不在此编造。

- **区块级**
  - 服务端收到客户端给的区块/方块坐标 → 先做**已加载校验**：仅当所在区块已加载才访问该处方块/方块实体，否则任意区块生成可被攻击利用（官方网络页的防御示例即同类：按网络 ID 校验实体、限制距离）。
  - 区块级数据按「需要的客户端集合」分发（tracking），避免全服广播。
- **插值**
  - 高频变化数据（坐标/朝向/速度）不要每 tick 一包：发**差值**（delta），或降低发送频率让**客户端插值/平滑**；单次瞬时值（点击、拾取）用单包即可。
- **大包**
  - 单体数据用单包；**批量数据分批**：列表/容器/配方类拆多包或增量发送，避免单包过大被拆包与丢序。
  - 尽量发「变化片段」而非整表；发送频率设上限（每 tick 一次为常规高频上限），防带宽与主线程压力。
- **决策小结**

  ```
  IF 跟踪实体/区块 → 按 tracking 集合分发（尊重视图距离）
  IF 维度切换/会话变化 → 客户端收包先做玩家/维度匹配校验，不匹配直接丢弃
  IF 单值变化 → 单包；IF 批量数据 → 分批/增量；IF 高频 → 降频 + 差值
  IF 服务端用客户端坐标访问区块 → 先做已加载校验
  ```

## 已知反模式（签名层面仍以本版为准）

- ❌ 服务端收包不校验直接执行 → 漏洞
- ❌ 凭旧版记忆写 `ClientSidePacketRegistry` / 老式 Fabric 网络 API → 1.21+ 已换代
- ❌ 在服务端把「客户端类」当权威依据 → 逻辑端边界错误
- ❌ 用 26.1.2 / 1.21.10 改名后的名称直接套 1.21.1

## 快速入口 / 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 数据同步 |
| `mc-entity` | 实体状态同步 |
| `mc-sound` | 客户端 SoundInstance 触发需要 S2C 包 |

- 规则：`06-networking.mdc`；反模式：`fabric/1.21.1/knowledge/antipatterns/`
