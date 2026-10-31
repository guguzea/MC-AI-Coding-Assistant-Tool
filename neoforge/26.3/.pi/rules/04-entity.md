---
description: 04 — 实体（NeoForge 26.3）
---

# 04 — 实体（NeoForge 26.3）

> 证据类型：NeoForge 26.3 sources jar + 26.3 merged jar 的 `javap`（不是 docs 正文）。

## 注册（`DeferredRegister.Entities`，sources 实读）

```java
public static final DeferredRegister.Entities ENTITIES = DeferredRegister.createEntities(MODID);

public <E extends Entity> DeferredHolder<EntityType<?>, EntityType<E>> registerEntityType(
    String name, EntityType.EntityFactory<E> factory, MobCategory category)
```

另有三个重载，第四参是 builder：`BiFunction<EntityType.EntityFactory<E>, MobCategory, EntityType.Builder<E>>` 或 `UnaryOperator<EntityType.Builder<E>>`。

## 工厂接口的真实形态（`javap` 实核，26.3）

```java
public interface EntityType$EntityFactory<T extends Entity> {
    T create(EntityType<T> type, Level level);
}
```

⇒ 你的实体构造器必须吃 `(EntityType<MyEntity>, Level)`，`MyEntity::new` 才匹配：

```java
public static final DeferredHolder<EntityType<?>, EntityType<MyEntity>> MY_ENTITY =
    ENTITIES.registerEntityType("my_entity", MyEntity::new, MobCategory.CREATURE);
```

## 属性（`event/entity/EntityAttributeCreationEvent.java` 实读）

```java
public class EntityAttributeCreationEvent extends Event implements IModBusEvent {
    public void put(EntityType<? extends LivingEntity> entity, AttributeSupplier map)
}
```

- **mod 总线**（`IModBusEvent`，类注释原文「Fired on the Mod bus」）
- 重复注册直接抛：`IllegalStateException("Duplicate DefaultAttributes entry: " + entity)`（`DefaultAttributes.hasSupplier` 前置检查）

```java
modEventBus.addListener((EntityAttributeCreationEvent event) ->
    event.put(MY_ENTITY.get(), Monster.createMonsterAttributes().add(Attributes.MAX_HEALTH, 20.0).build()));
```

构建链（`javap` 实核）：

- `AttributeSupplier$Builder`：`add(Holder<Attribute>)` / `add(Holder<Attribute>, double)` / `build()`
- `Monster.createMonsterAttributes()` → `AttributeSupplier.Builder`（怪物线）
- ⚠ **`Mob` 上没有 `createAttributes` / `createMobAttributes`**（`javap -cp` 实测无匹配）—— 不要按 1.21 记忆写 `Mob.createMobAttributes()`；非怪物实体自己 `new AttributeSupplier.Builder().add(...)`

## 实体类包路径（26.x 重组，`jar tf` 实核）

```
net.minecraft.world.entity.animal.pig.Pig
net.minecraft.world.entity.animal.cow.Cow
net.minecraft.world.entity.animal.sheep.Sheep
net.minecraft.world.entity.monster.zombie.Zombie
```

—— **不是** 1.21 时代的 `animal.Pig` / `monster.Zombie`。按旧路径写会「找不到符号」（本档探针实测踩到）。
`monster.Monster` 仍在 `net.minecraft.world.entity.monster.Monster`（没动）。

## 渲染

实体渲染器归 vanilla（`EntityRenderers.register`）。本档**没有** 26.3 的实体渲染示例（MDK 不含、docs 无 26.3 正文），写之前用 `javap` 核 `EntityRendererProvider` 与具体渲染器签名。

## 禁止

- 用 `DeferredRegister.create(Registries.ENTITY_TYPE, MODID)` 却不挂 mod 总线（`EntityAttributeCreationEvent` 在 mod 总线上，挂游戏总线收不到）
- 属性注册重复（`put` 会抛，不是覆盖）
- 按 1.21 记忆写 `Mob.createMobAttributes()`
