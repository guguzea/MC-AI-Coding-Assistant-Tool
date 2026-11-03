# `rift/1.13` 的游玩自测驱动（真机验证过的源码）

> 2026-11-03 回填。来源：`F:\B AND D MOD\mod\`（该目录是用户指定的改动区）。

## 这份代码是什么

bandd_playtest **二合一**模组的一层：**桥面**（命令级 9 动作）+ **驱动面**（玩家级 15 动作），
共用同一份**版本无关 core**（9 类，见 `mcp-server/src/generators/playtest-mod-core.ts`）。

架构（四层，**只有最底一层与平台相关**）：

```
HttpApi（HTTP 线程：只入队，绝不碰 MC）
  → ActionQueue（HTTP 线程等 tick 线程结果，超时报 TIMEOUT）
    → PlaytestCore.onTick()（客户端 tick 线程：drain → plan.tick → botFollowStep → 仲裁让位）
      → GameBridge（唯一接口，24 个方法）
        → <本档适配层>（唯一碰 MC 类的地方）
```

## 验证强度

**L-b 达成**（驱动动作真的驱动玩家）：`press forward` ⇒ **dz = +12.800 格**。生产（官方混淆）客户端 + `reobfJar`；dev 环境 refmap 对不上（42 个 mixin miss）。

## 真机坑（必读，勿重踩）

- **reobf 不改反射字符串** ⇒ 适配层**禁止**用反射找 MC 字段（真机实测：`未知按键：forward`、`NoSuchFieldException: keyCode`）。
  生成器已有 `assertNoReflectiveMcAccess` 在生成期拦。
- **HTTP 端口是动态的**：`HttpApi.start()` 从首选端口往后试 20 个 ⇒ 消费方实时解析（读 `qa.log` 的 `[QA] http listening on 127.0.0.1:<port>`，或探活 `/status`）。
- **能力必须如实自报**：`GameBridge.unavailableActions()` 按实际做得到的列白名单；谎报比不报更糟。
- 逐档坑位清单：`community_knowledge/authored/ingame-playtest-automation.md` 编号 **91–101**。

## 相关记录

`F:\B AND D MOD\artifacts\` 下：`rift-1.13-lb-record.md`、`modloader-1.6.2-lb-record.md`、`modloader-1.2.5-1.5.2-lb-record.md`。
