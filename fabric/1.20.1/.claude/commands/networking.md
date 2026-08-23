---
name: mc-networking
description: Fabric 网络通信。ServerPlayNetworking、ClientPlayNetworking、PacketByteBufs。触发词：网络、Networking、PacketByteBuf、ServerPlayNetworking
platform: fabric
version: "1.20.1"
dependencies: []
mappings: yarn
---

# 网络通信（Fabric 1.20.1）

> **核实结论**：本版（1.20.1）**没有 fabric-docs 版本树**（`data/fabric_1.20.1/meta.json`：`pages: []`；failures.json：无 versions/1.20.1 与可用归档，不要用 main/VitePress 当本档官方树）。本档 wiki 亦无网络页。
> **策略**：以下代码为骨架既有写法，与包内 `06-networking.mdc` 一致，但**未在本版文档树核实**；机制/策略部分与签名部分严格分开。Fabric 网络在 1.21 前为「频道 + PacketByteBuf」世代，与 1.21+ 的进度 payload（CustomPayload）体系**不是一套**。

## 快速开始（骨架既有，1.20.1 世代频道式 API）

```java
import net.fabricmc.fabric.api.networking.v1.PacketByteBufs;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.fabricmc.fabric.api.networking.v1.ClientPlayNetworking;
import net.minecraft.util.Identifier;

public static final Identifier MY_PACKET_ID = new Identifier(MOD_ID, "my_packet");

// 服务端：接收 C2S（ModInitializer.onInitialize）
ServerPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (server, player, handler, buf, responseSender) -> {
    int value = buf.readInt();
    server.execute(() -> {
        // 主线程处理
    });
});

// 客户端：接收 S2C（ClientModInitializer.onInitializeClient）
ClientPlayNetworking.registerGlobalReceiver(MY_PACKET_ID, (client, handler, buf, responseSender) -> {
    int value = buf.readInt();
    client.execute(() -> {
        // 主线程处理
    });
});
```

## 发送

```java
var buf = PacketByteBufs.create();
buf.writeInt(value);
ServerPlayNetworking.send(player, MY_PACKET_ID, buf); // S2C
ClientPlayNetworking.send(MY_PACKET_ID, buf);         // C2S
```

> 注：1.20.1 Yarn 为 `new Identifier(MOD_ID, ...)`（`String` id）与 `Identifier`；上方为骨架/包内规则既有，使用前用 `query_api` + `search_community_docs` 复核一句。

## 概念机制（他版正文核对后的机制对照，非本版签名）

- 包（packet）是网络核心；单机/LAN 也有**逻辑服务端**（集成服也是逻辑服务端）；不同步 = **desync**。
- **tracking**：只在视图距离内、需要知道的客户端收到通知——按需要集合分发，不向全服广播。
- 服务端是权威：客户端包不可信，收包后**先校验**（存在性/类型/距离/权限）再执行。

## 区块级 / 插值 / 大包（策略小节；不写类名）

- **区块级**：服务端收到客户端给的区块/方块坐标 → 先做**已加载校验**，仅当区块已加载才访问方块/方块实体（否则任意区块生成可被攻击利用）；按「需要的客户端集合」（tracking）分发。
- **插值**：高频数据（坐标/朝向/速度）不要每 tick 一包：发**差值**（delta）或降频让客户端插值/平滑；瞬时单值（点击/拾取）用单包。
- **大包**：批量数据（列表/容器/配方）拆多包或增量发送；发「变化片段」而非整表；频率上限（每 tick 一次为常规高频上限）。
- **决策小结**：
  ```
  IF 跟踪实体/区块 → 按 tracking 集合分发（尊重视图距离）
  IF 维度切换/会话变化 → 收包先做玩家/维度匹配校验，不匹配丢弃
  IF 单值 → 单包；IF 批量 → 分批/增量；IF 高频 → 降频 + 差值
  IF 服务端用客户端坐标访问区块 → 先做已加载校验
  ```

## 查证路径

1. `query_api`（1.20.1 在覆盖范围）：核 `Identifier` 等 Vanilla 类；
2. `search_docs` / `search_fabric_docs`（1.20.1）→ 预期 DOC_NOT_FOUND；
3. `search_community_docs`（社区实务；`community_knowledge/AGENT_USAGE.md`：短文不替代 API 规范）；
4. 不要用 1.21+/26.x 的 payload 体系签名改版本号冒充本档。

## 常见错误

- 在网络线程改世界：必须 `server.execute` / `client.execute`
- 只在 common 注册客户端接收器：S2C 必须放在 `ClientModInitializer`
- 包 ID 两端不一致

## 扩展点

| 配合 Skill | 协作说明 |
|-----------|---------|
| `mc-gui` | GUI 槽位/进度同步 |
| `mc-entity` | 实体状态同步 |
