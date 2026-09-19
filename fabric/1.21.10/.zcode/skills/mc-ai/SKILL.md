---
name: mc-ai
description: 实体 AI Goal、Brain。触发词：Goal、targetSelector
platform: fabric
version: "1.21.10"
dependencies: []
mappings: yarn
---

# mc-ai（1.21.10）

> 一手来源：Yarn 类名 `net/minecraft/entity/ai/goal/GoalSelector` 经本档映射库核实存在（`data/fabric_1.21.10/mappings/yarn-mappings.sqlite` 含该路径记录）。Fabric docs 语料无 AI 专页。

## Decision Flow

```
→ 实体行为 = 优先级 Goal 系统 → Goal 子类（Yarn 名 net.minecraft.entity.ai.goal.Goal）
→ goal 容器 → net.minecraft.entity.ai.goal.GoalSelector（映射库已钉）
→ goal 挂载方法签名 → 本档无一手语料，写前先核实
→ 注册与生命周期 → mc-registry、01-registry.mdc、04-entity.mdc
```

## 本档口径（已核实）

- Yarn 命名 `entity/ai/goal/GoalSelector`、`entity/ai/goal/Goal` 在本档映射库中有记录。
- goal 挂载/优先级方法链本档无一手来源——先核实再写。

## 反模式

- 把 mojmap 名当 Yarn 全名用（Yarn 是 `net.minecraft.entity.ai.goal.*` 包）。
- 凭记忆写挂载链。

## 下一步

- 名字核实：`convert_mapping`（to=yarn）/ 本档映射库；反模式库：同档 `knowledge/`。
