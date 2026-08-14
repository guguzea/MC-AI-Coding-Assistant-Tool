# clone-audit 签字

六档教程骨架相似（DeferredRegister + Payload）是官方文档同构，不是从 Forge 1.20.4 粘贴。
1.20.4 网络是单数 Handler + write/id；1.21+ 是复数 Handlers + StreamCodec。26.1 另有 Java 25 / 去混淆 / ModContainer。
超 70% Dice = 疑似；本文件记为「同骨架换类名，对照官方文档签字」。误报不算验收失败。

## 2026-08-15 实测（`node scripts/clone-audit.mjs`）

- 比较 **10** 对（计划 1 额外树已在盘：`liteloader/1.8.9`、`1.10.2`、`modloader/1.2.5`、`fabric/26.1.2`）
- **60** 条 `SUSPECTED_CLONE`，全部落在邻档 NeoForge 互比（1.21.1↔1.20.4 … 26.1↔1.21.11）
- **`neoforge/1.20.4` vs `forge/1.20.4`：0 条**（未达 70%）。不是从 Forge 规则拷贝。
- **计划 1 四对均为 0 条**（同骨架换类名误报未出现，不算粘贴邻版）：
  - `liteloader/1.8.9` vs `liteloader/1.12.2`：0（未核实 stub，未克隆 1.12.2 核实表）
  - `liteloader/1.10.2` vs `liteloader/1.12.2`：0
  - `modloader/1.2.5` vs `modloader/1.6.4`：0（MCP named 未打开，未克隆 1.6.4）
  - `fabric/26.1.2` vs `fabric/1.21.11`：0（从 `data/fabric_26.1.2` 写，不是邻版 01–10 粘贴）
- 邻档 NeoForge 部分文件 Dice=1（如 1.21.3↔1.21.1 的 item/entity/client-server）：这些 API 在官方文档间未改类名，生成器按同口径写。对照 docs.neoforged.net 签字为同骨架误报。
