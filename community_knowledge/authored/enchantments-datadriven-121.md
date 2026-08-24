---
id: authored/enchantments-datadriven-121
title: 1.21+ 数据驱动附魔（Enchantment 效果组件 + 自定义 Effect）
tags: [enchantment, data-driven, datagen, EnchantmentEffectComponents, POST_ATTACK, codec, neoforge, 1.21]
summary: 1.21 起附魔没有 Java 类：ResourceKey+BootstrapContext datagen 定义；definition（支持物品/权重/费用/槽位）；withEffect 挂效果组件；自定义效果=实现 EnchantmentEntityEffect 的 record 注册 MapCodec；生成 JSON 结构解读。
mcHint: 1.21+/26.x（26.X 分支 59-enchantments 核对）
sourceKind: authored
---

# 1.21+ 数据驱动附魔

自写短文。代码依据 Kaupenjoe NeoForge 26.X 课程分支 `59-enchantments`（MIT）核对，JSON 取自其 generated 目录。**1.20.x 及以前的 `Enchantment` 子类写法已废**——老教程全部过时。

## 心智模型变化

- 附魔本体 = **纯数据**（注册表条目），不再有 `class MyEnchantment extends Enchantment`。
- 行为 = 挂在 **效果组件**（`EnchantmentEffectComponents.*`）上的效果对象列表，按触发时机分类：`POST_ATTACK`、`TICK`、`HIT`、`LOCATION_CHANGED`、`AMMO_USE` 等。
- 自定义行为 = 自己写一个 record 实现 effect 接口 + 注册它的 **MapCodec**（数据怎么反序列化回来）。

## 定义附魔（datagen bootstrap）

```java
public static void bootstrap(BootstrapContext<Enchantment> context) {
    var enchantments = context.lookup(Registries.ENCHANTMENT);
    var items = context.lookup(Registries.ITEM);

    register(context, LIGHTNING_STRIKER,
        Enchantment.enchantment(Enchantment.definition(
                items.getOrThrow(ItemTags.WEAPON_ENCHANTABLE),   // supported_items
                items.getOrThrow(ItemTags.WEAPON_ENCHANTABLE),   // primary_items（附影台出）
                5,                                               // weight 附台权重
                2,                                               // maxLevel
                Enchantment.dynamicCost(5, 8),                   // minCost
                Enchantment.dynamicCost(25, 8),                  // maxCost
                3,                                               // anvilCost
                EquipmentSlotGroup.MAINHAND))
            .exclusiveWith(enchantments.getOrThrow(EnchantmentTags.DAMAGE_EXCLUSIVE)) // 互斥集
            .withEffect(EnchantmentEffectComponents.POST_ATTACK,
                EnchantmentTarget.ATTACKER,      // 谁带着附魔
                EnchantmentTarget.VICTIM,        // 效果作用在谁身上
                new LightningStrikerEnchantmentEffect(1)));
}
```

- 与旧系统对照：weight≈稀有度、min/maxCost≈旧 minCost/maxCost 曲线、anvilCost≈铁砧倍率。
- 互斥用**标签**（`#minecraft:exclusive_set/damage`），不是代码枚举。

## 自定义效果：record + MapCodec 注册

```java
// 效果本体
public record LightningStrikerEnchantmentEffect(int level) implements EnchantmentEntityEffect {
    public static final MapCodec<LightningStrikerEnchantmentEffect> CODEC =
        RecordCodecBuilder.mapCodec(i -> i.group(
            Codec.INT.fieldOf("level").forGetter(LightningStrikerEnchantmentEffect::level))
            .apply(i, LightningStrikerEnchantmentEffect::new));

    @Override
    public void apply(ServerLevel level, int enchantmentLevel, EnchantedItemInUse item,
                      Entity entity, Vec3 pos) {
        // 这里放行为：召唤闪电等（entity=受击者，pos=位置）
    }
}

// 注册到效果类型注册表（DeferredRegister）
public static final DeferredRegister<MapCodec<? extends EnchantmentEntityEffect>> EFFECTS =
    DeferredRegister.create(Registries.ENCHANTMENT_ENTITY_EFFECT_TYPE, MOD_ID);
```

- 接口选型：作用在实体上用 `EnchantmentEntityEffect`；改掉落物用 `EnchantmentValueEffect` / loot 相关组件。
- 原版自带一批可复用效果（伤害、击退、属性修改类），先查原版再自己写。

## 生成的 JSON 长什么样

```json
{ "supported_items": "#minecraft:enchantable/weapon",
  "primary_items": "#minecraft:enchantable/weapon",
  "weight": 5, "max_level": 2,
  "min_cost": {"base":5,"per_level_above_first":8},
  "description": {"translate":"enchantment.mccourse.lightning_striker"},
  "effects": { "minecraft:post_attack": [
      { "enchanted": "attacker", "affected": "victim",
        "effect": { "type": "mccourse:lightning_striker", "level": 1 } } ] },
  "exclusive_set": "#minecraft:exclusive_set/damage",
  "slots": ["mainhand"], "anvil_cost": 3 }
```

- 手写这份 JSON 也合法（放 `data/<modid>/enchantment/*.json`），但 datagen 能保证字段名不拼错。**自定义 effect 的 type 必须有对应的 MapCodec 注册**，否则加载报错。
- 进附影台的资格：给 `data/minecraft/tags/enchantment/in_enchanting_table.json` 追加（datagen tag provider）。

## 反模式

- ❌ 写 `extends Enchantment` 子类并尝试注册实例（1.21 编译都过不了）。
- ❌ 把行为写在 JSON 里——JSON 只能引用已注册的效果类型。
- ❌ 忘了 in_enchanting_table 标签 → 玩家永远附不出来（只能铁砧/指令）。

## 不清楚时

- 教程源码（分支 `59-enchantments`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- API：`search_neoforge_docs`（关键词 enchantment）；本仓库规则 `03-item`/`07-datagen`
