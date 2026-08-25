# Forge 1.7.10

核实表：knowledge/common/verified-api.md（search_forge_docs version=1.7.10 javadoc）。
改口：search_docs({platform:"forge", version:"1.7.10"})。
download_official_mdk 对本版 **永远 MDK_NOT_PINNED**（maven mdk zip 404），禁止写入 mdk-checksums 假 pin。
不要把 1.12.2/1.16+ Capability、DeferredRegister、DataGen 当本版教程。

## 配置（不落盘树级 mc-config）

不要为本档新写 `mc-config` Skill。配置走仓库根 `knowledge/libs/all-platforms/mc-config/SKILL.md` + `generate_config`（工作流 `mc-config`）。LiteLoader / Rift / ModLoader / 基岩不要套 Cloth / ForgeConfigSpec。

