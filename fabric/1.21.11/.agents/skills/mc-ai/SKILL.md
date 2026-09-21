---
name: mc-ai
description: 实体 AI Goal、Brain。触发词：Goal、targetSelector
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
---

# mc-ai

> 本档正文的类名/签名只来自 `data/fabric_1.21.11` 本档语料：页面 `fabric-docs/1.21.11/processed/develop_entities_first-entity.md` 的「Adding Goals」一节（该节是本档语料里**唯一**成节讲实体 AI 的正文，全库 `grep -rliE "goals"` 在 processed 页面里只命中这一页）；页内转引 `@[code transcludeWith=:::goals](@/reference/1.21.11/src/main/java/com/example/docs/entity/MiniGolemEntity.java)` 与 `@[code transcludeWith=:::types](@/reference/1.21.11/src/main/java/com/example/docs/entity/ModEntityTypes.java)` 已去 `reference/` 读到真身。页内没有的签名一律留 `TODO(未核实)`，禁止用邻版（1.21.10 / 1.21.1 / 26.1）或 Forge 档的 AI 章节补全。

## Goal 是什么、优先级怎么算

页内原话：「Goals are the system that handle an entity's objective/aim, providing them with a defined set of behavior.」并且：**Goals 有优先级——priority 数值越低越优先**（页内：「goals with a lower value for the priority are prioritized over goals with a higher value for the priority」）。

页内同时规定做法：「To add goals to the entity, you need to create a `registerGoals` method in your entity's class that defines the goals for the entity.」

## 挂 Goal：`registerGoals` + `goalSelector.addGoal(int, Goal)`

`reference/1.21.11/src/main/java/com/example/docs/entity/MiniGolemEntity.java` 的 `//:::goals` 区段真身（逐字照抄）：

```java
@Override
protected void registerGoals() {
	this.goalSelector.addGoal(0, new TemptGoal(this, 1, Ingredient.of(Items.WHEAT), false));
	this.goalSelector.addGoal(1, new RandomStrollGoal(this, 1));
	this.goalSelector.addGoal(2, new LookAtPlayerGoal(this, Cow.class, 4));
	this.goalSelector.addGoal(3, new RandomLookAroundGoal(this));
}
```

- 覆写点是 `protected void registerGoals()`（无参、返回 `void`），挂在实体类自己身上；注册表进的是 `goalSelector`，`addGoal(int priority, <Goal>)`。
- 本例宿主类是 `MiniGolemEntity extends PathfinderMob`。页内对 `PathfinderMob` 的定性：「the class used by most mobs with pathfinding, such as `Zombie` and `Villager`」。

## 页内用到的四个 Goal

页内的 info 列表逐条说明（下表第二列是页内原话，第三列是上面代码里实读的构造实参；页内没解释的参数语义本件不解释）：

| Goal 类 | 页内说明 | 实读的构造调用 |
| --- | --- | --- |
| `TemptGoal` | The entity is attracted towards a player holding an item. | `new TemptGoal(this, 1, Ingredient.of(Items.WHEAT), false)` |
| `RandomStrollGoal` | Walks/wanders around the world. | `new RandomStrollGoal(this, 1)` |
| `LookAtPlayerGoal` | Despite the name, this accepts any entity. Used here to look at the `Cow` entity. | `new LookAtPlayerGoal(this, Cow.class, 4)` |
| `RandomLookAroundGoal` | To look in random directions. | `new RandomLookAroundGoal(this)` |

对应的 import（`MiniGolemEntity.java` 逐字出现）：

```java
import net.minecraft.world.entity.PathfinderMob;
import net.minecraft.world.entity.ai.goal.LookAtPlayerGoal;
import net.minecraft.world.entity.ai.goal.RandomLookAroundGoal;
import net.minecraft.world.entity.ai.goal.RandomStrollGoal;
import net.minecraft.world.entity.ai.goal.TemptGoal;
import net.minecraft.world.entity.animal.cow.Cow;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.crafting.Ingredient;
```

> 注意 `net.minecraft.world.entity.animal.cow.Cow` 是本档（1.21.11 官方名）的包路径，邻版未必同名，不要照抄到别的档。

## 与属性的联动

`TemptGoal` 依赖引诱距离：同页把属性描述为「Attributes decide various things including the maximum health, movement speed, and tempt range of the entity.」，实体类里同一参考文件有 `createCubeAttributes()`：

```java
public static AttributeSupplier.Builder createCubeAttributes() {
	return PathfinderMob.createMobAttributes()
			.add(Attributes.MAX_HEALTH, 5)
			.add(Attributes.TEMPT_RANGE, 10)
			.add(Attributes.MOVEMENT_SPEED, 0.3);
}
```

属性由 `ModEntityTypes.registerAttributes()` 用 `FabricDefaultAttributeRegistry.register(MINI_GOLEM, MiniGolemEntity.createCubeAttributes())` 挂上（同页 `:::types` 转引的参考文件真身）。属性面本身请读同档 `develop_entities_attributes.md`（`mc-entity` / 该页），本件不展开。

## 本档未覆盖（禁止默写）

- **`targetSelector`**：本档语料（页面正文 + `reference/1.21.11` 全部 .java/.md）**零出现**。frontmatter 的触发词写了它，但本档没有对应正文 ⇒ 需要目标选择器/攻击型 Goal 时改走 `search_fabric_docs version=1.21.11`（`query=entity ai` / `targetSelector`）或 `get_minecraft_source`，零命中就停，禁止按 Forge 档或记忆补 `NearestAttackableTargetGoal` 一类名字。
- **`Brain` / Activity / Sensor / Memory 模块**：本档语料零出现（frontmatter 提到 Brain，但本档官方文档没有该章节）⇒ 不写。
- **自定义 `Goal` 子类**：`Goal` 基类本身、其生命周期方法（能否开始/结束/是否需要 tick 之类）在本档语料未出现 ⇒ `TODO(未核实)`。
- **Goal 的移除、优先级冲突行为、`goalSelector` 的类型与获取方式以外的 API**：页内只演示 `addGoal(int, Goal)` ⇒ 其余不猜。
- **实体注册与渲染**：走同页的 `:::registerclass` / `:::types` 与渲染章节，见 `mc-entity`，本件不复制。

## 相关

- 实体：`04-entity.mdc` / `mc-entity`（同页 `develop_entities_first-entity.md`）；属性：同档 `develop_entities_attributes.md`
- 注册：`01-registry.mdc` / `mc-registry`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_entities_first-entity")`
