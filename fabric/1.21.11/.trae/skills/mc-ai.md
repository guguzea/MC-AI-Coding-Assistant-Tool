---
name: mc-ai
description: 实体 AI Goal、Brain。触发词：Goal、targetSelector
platform: fabric
version: "1.21.11"
dependencies: []
mappings: yarn
mappings_alt: mojmap
---

# mc-ai

> 本档正文的类名/签名来自 `data/fabric_1.21.11` 本档语料：页面 `fabric-docs/1.21.11/processed/develop_entities_first-entity.md` 的「Adding Goals」一节（该节是本档语料里**唯一**成节讲实体 AI 的正文，全库 `grep -rliE "goals"` 在 processed 页面里只命中这一页）；页内转引 `@[code transcludeWith=:::goals](@/reference/1.21.11/src/main/java/com/example/docs/entity/MiniGolemEntity.java)` 与 `@[code transcludeWith=:::types](@/reference/1.21.11/src/main/java/com/example/docs/entity/ModEntityTypes.java)` 已去 `reference/` 读到真身。正文里标了 `javap @ yarn 1.21.11+build.6` 的条目来自本档真构件；页内没有的签名先按本档真构件 javap 核，核不到才留 `TODO(未核实)`，禁止用邻版（1.21.10 / 1.21.1 / 26.1）或 Forge 档的 AI 章节补全。

## Goal 是什么、优先级怎么算

页内原话：「Goals are the system that handle an entity's objective/aim, providing them with a defined set of behavior.」并且：**Goals 有优先级——priority 数值越低越优先**（页内：「goals with a lower value for the priority are prioritized over goals with a higher value for the priority」）。

页内同时规定做法：「To add goals to the entity, you need to create a `registerGoals` method in your entity's class that defines the goals for the entity.」（引文是 mojmap 名；Yarn 覆写点叫 `initGoals()`。）

## 挂 Goal：`initGoals` + `goalSelector.add(int, Goal)`

`reference/1.21.11/src/main/java/com/example/docs/entity/MiniGolemEntity.java` 的 `//:::goals` 区段真身（逐字照抄；**这是 mojmap 原文**，落到本档 Yarn 工程按下面 Yarn 版写）：

```java
@Override
protected void registerGoals() {
	this.goalSelector.addGoal(0, new TemptGoal(this, 1, Ingredient.of(Items.WHEAT), false));
	this.goalSelector.addGoal(1, new RandomStrollGoal(this, 1));
	this.goalSelector.addGoal(2, new LookAtPlayerGoal(this, Cow.class, 4));
	this.goalSelector.addGoal(3, new RandomLookAroundGoal(this));
}
```

同一区段的 **Yarn 写法**（覆写点与方法名都不同，按 1.21.11 合并 jar javap）：

```java
@Override
protected void initGoals() {
	this.goalSelector.add(0, new TemptGoal(this, 1, stack -> stack.isOf(Items.WHEAT), false));
	this.goalSelector.add(1, new WanderAroundGoal(this, 1));
	this.goalSelector.add(2, new LookAtEntityGoal(this, CowEntity.class, 4));
	this.goalSelector.add(3, new LookAroundGoal(this));
}
```

- 覆写点是 `protected void initGoals()`（无参、返回 `void`），挂在实体类自己身上；注册表进的是 `goalSelector`，方法名是 `add(int priority, Goal goal)`（javap 实测，**不是** `addGoal`）。
- 本例宿主类是 `MiniGolemEntity extends PathAwareEntity`（参考文件写 mojmap 的 `PathfinderMob`）。页内对它的定性：「the class used by most mobs with pathfinding, such as `Zombie` and `Villager`」。

## 页内用到的四个 Goal

页内的 info 列表逐条说明（下表第二列是页内原话，第三列是上面代码里实读的构造实参；页内没解释的参数语义本件不解释）：

| Goal 类（Yarn） | 页内说明 | 参考文件的 mojmap 调用 → 本档 Yarn 写法 |
| --- | --- | --- |
| `TemptGoal` | The entity is attracted towards a player holding an item. | `new TemptGoal(this, 1, Ingredient.of(Items.WHEAT), false)` → `new TemptGoal(this, 1, stack -> stack.isOf(Items.WHEAT), false)`（Yarn 构造器第 3 参是 `Predicate<ItemStack>`，不是 `Ingredient`） |
| `WanderAroundGoal` | Walks/wanders around the world. | `new RandomStrollGoal(this, 1)` → `new WanderAroundGoal(this, 1)` |
| `LookAtEntityGoal` | Despite the name, this accepts any entity. Used here to look at the `Cow` entity. | `new LookAtPlayerGoal(this, Cow.class, 4)` → `new LookAtEntityGoal(this, CowEntity.class, 4)` |
| `LookAroundGoal` | To look in random directions. | `new RandomLookAroundGoal(this)` → `new LookAroundGoal(this)` |

对应的 import（Yarn 名；参考文件 `MiniGolemEntity.java` 里逐字是 mojmap 名，对照见文末表）：

```java
import net.minecraft.entity.mob.PathAwareEntity;
import net.minecraft.entity.ai.goal.LookAtEntityGoal;
import net.minecraft.entity.ai.goal.LookAroundGoal;
import net.minecraft.entity.ai.goal.WanderAroundGoal;
import net.minecraft.entity.ai.goal.TemptGoal;
import net.minecraft.entity.passive.CowEntity;
import net.minecraft.item.Items;
```

> 参考文件的 mojmap 包路径（`net.minecraft.world.entity...` / `net.minecraft.world.item...`）不是本档 Yarn 工程的写法；上表右列给出 Yarn 对应名与调用形态。`TemptGoal` 的构造器参数类型两套映射也不同，照 Yarn 形式写。

## 与属性的联动

`TemptGoal` 依赖引诱距离：同页把属性描述为「Attributes decide various things including the maximum health, movement speed, and tempt range of the entity.」，实体类里同一参考文件有 `createCubeAttributes()`：

```java
public static DefaultAttributeContainer.Builder createCubeAttributes() {
	return PathAwareEntity.createMobAttributes()
			.add(EntityAttributes.MAX_HEALTH, 5)
			.add(EntityAttributes.TEMPT_RANGE, 10)
			.add(EntityAttributes.MOVEMENT_SPEED, 0.3);
}
```

属性由 `ModEntityTypes.registerAttributes()` 用 `FabricDefaultAttributeRegistry.register(MINI_GOLEM, MiniGolemEntity.createCubeAttributes())` 挂上（同页 `:::types` 转引的参考文件真身）。属性面本身请读同档 `develop_entities_attributes.md`（`mc-entity` / 该页），本件不展开。

## 本档未覆盖（禁止默写）

- **`targetSelector`**：本档语料（页面正文 + `reference/1.21.11` 全部 .java/.md）**零出现**。frontmatter 的触发词写了它，但本档没有对应正文 ⇒ 需要目标选择器/攻击型 Goal 时改走 `search_fabric_docs version=1.21.11`（`query=entity ai` / `targetSelector`）或 `get_minecraft_source`，零命中就停，禁止按 Forge 档或记忆补 `NearestAttackableTargetGoal` 一类名字。
- **`Brain` / Activity / Sensor / Memory 模块**：本档语料零出现（frontmatter 提到 Brain，但本档官方文档没有该章节）⇒ 不写。
- **自定义 `Goal` 子类**：语料没给，但本档构件已核实（javap @ yarn 1.21.11+build.6，`net.minecraft.entity.ai.goal.Goal`）——**只有 `canStart()` 是抽象方法**；`shouldContinue()` / `canStop()` / `start()` / `stop()` / `shouldRunEveryTick()` / `tick()` 都是可覆写的空实现，不强制实现；另有 `setControls(EnumSet<Goal.Control>)`；mojmap 侧同名（`net.minecraft.world.entity.ai.goal.Goal`）。`Goal.Control` 的常量集合本件未逐枚举，用前先看该枚举。
- **Goal 的移除、优先级冲突行为、`goalSelector` 的类型与获取方式以外的 API**：页内只演示 `add(int, Goal)` ⇒ 其余不猜。
- **实体注册与渲染**：走同页的 `:::registerclass` / `:::types` 与渲染章节，见 `mc-entity`，本件不复制。

### ⚠️ 映射口径：本文件引用的参考文件是 mojmap

本文件「页内引文」代码块（第 3 节）逐字抄自参考文件，是 **mojmap 原名**；第 4 节的 import / 构造表与属性块已按 Yarn 写。本档工程映射按 frontmatter 为 Yarn，**两套名不能混用**。

| mojmap 名 | Yarn 名 | 适用版本（13 档逐档 join 实测） | 依据 |
| --- | --- | --- | --- |
| `RandomStrollGoal` | `WanderAroundGoal` | 1.16.5–1.21.11 | join（`net.minecraft.entity.ai.goal.WanderAroundGoal`） |
| `LookAtPlayerGoal` | `LookAtEntityGoal` | 1.16.5–1.21.11 | join（`net.minecraft.entity.ai.goal.LookAtEntityGoal`） |
| `RandomLookAroundGoal` | `LookAroundGoal` | 1.16.5–1.21.11 | join（`net.minecraft.entity.ai.goal.LookAroundGoal`） |
| `Cow` | `CowEntity` | 1.16.5–1.21.11 | join（`net.minecraft.entity.passive.CowEntity`） |
| `PathfinderMob` | `PathAwareEntity` | 1.16.5–1.21.11 | join（`net.minecraft.entity.mob.PathAwareEntity`） |
| `AttributeSupplier` | `DefaultAttributeContainer` | 1.16.5–1.21.11 | join（`net.minecraft.entity.attribute.DefaultAttributeContainer`） |
| `Items` | `Items` | 1.16.5–1.21.11 | join（`net.minecraft.item.Items`，包路径不同） |
| `Ingredient` | `Ingredient` | 1.16.5–1.21.11 | join（`net.minecraft.recipe.Ingredient`，包路径不同） |
| `Attributes` | `EntityAttributes` | 1.16.5–1.21.11 | join（`net.minecraft.entity.attribute.EntityAttributes`） |

成员名也要换（本表只按 1.21.11 合并 jar javap 核过，未做 13 档 join；上表是类名级 join）：

| mojmap 成员 | Yarn 成员 | 依据 |
| --- | --- | --- |
| `MobEntity#registerGoals()` | `MobEntity#initGoals()` | javap：`protected void initGoals()` |
| `GoalSelector#addGoal(int, Goal)` | `GoalSelector#add(int, Goal)` | javap：`public void add(int, net.minecraft.entity.ai.goal.Goal)` |

- 上表只由本档 `mappings/yarn-mappings.sqlite`（与 mojmap `client.txt` 的 join）证实**类名存在与包路径**，不证实方法名/参数/返回值；逐签名以 Yarn 源码为准。
- 本件第 4 节的 `TemptGoal` / `WanderAroundGoal` / `LookAtEntityGoal` / `LookAroundGoal` 构造器与 `DefaultAttributeContainer.Builder.add(...)` 已按本档真构件 javap 核过；引用参考文件原文时保留 mojmap 名（考证价值），但落到用户工程必须换上表 Yarn 列。

## 相关

- 实体：`04-entity.mdc` / `mc-entity`（同页 `develop_entities_first-entity.md`）；属性：同档 `develop_entities_attributes.md`
- 注册：`01-registry.mdc` / `mc-registry`
- 全文核对：`get_fabric_doc_full(version="1.21.11", id="develop_entities_first-entity")`
