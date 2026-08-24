---
id: authored/global-loot-modifiers
title: 全局战利品修改器（Global Loot Modifiers）
tags: [loot, glm, global-loot-modifier, LootModifier, codec, datagen, neoforge]
summary: GLM 用途与两层结构：serializer 注册（MapCodec<? extends IGlobalLootModifier>）+ JSON 条目；继承 LootModifier（codecStart + conditions）；order 文件 global_loot_modifiers.json 的 entries/replace；典型场景（怪物掉落追加、结构箱注入、掉落替换）。
mcHint: NeoForge（26.X 分支 35-global-loot-modifiers 核对）；Forge 1.18+ 同构
sourceKind: authored
---

# 全局战利品修改器（GLM）

自写短文。代码依据 Kaupenjoe NeoForge 26.X 课程分支 `35-global-loot-modifiers`（MIT）核对。GLM 是**不覆盖原版 loot table JSON** 就能改全局掉落的机制——兼容性远好于直接改原版表。

## 两层结构

1. **Serializer 注册**（代码）：你的修改器类怎么从 JSON 反序列化。
2. **JSON 条目**（数据）：具体实例——什么条件、改什么。外加一个**排序文件**。

```java
public static final DeferredRegister<MapCodec<? extends IGlobalLootModifier>> LOOT_MODIFIERS =
    DeferredRegister.create(NeoForgeRegistries.Keys.GLOBAL_LOOT_MODIFIER_SERIALIZERS, MOD_ID);

public static final Supplier<MapCodec<AddItemStackModifier>> ADD_ITEMSTACK =
    LOOT_MODIFIERS.register("add_itemstack", () -> AddItemStackModifier.CODEC);
```

## 修改器类：继承 LootModifier

```java
public class AddItemStackModifier extends LootModifier {
    public static final MapCodec<AddItemStackModifier> CODEC = RecordCodecBuilder.mapCodec(inst ->
        LootModifier.codecStart(inst).and(                       // 自动带出 conditions 数组
            ItemStackTemplate.CODEC.fieldOf("stack").forGetter(m -> m.itemStack))
        .apply(inst, (conditions, stack) -> new AddItemStackModifier(conditions, stack)));

    private final ItemStackTemplate itemStack;

    public AddItemStackModifier(LootItemCondition[] conditions, ItemStackTemplate stack) {
        super(conditions, 1000);   // 1000 = 排序权重（教程示例值）
        this.itemStack = stack;
    }

    @Override
    protected ObjectArrayList<ItemStack> doApply(ObjectArrayList<ItemStack> generatedLoot, LootContext ctx) {
        for (LootItemCondition c : this.conditions) {
            if (!c.test(ctx)) return generatedLoot;              // 条件不过 → 原样返回
        }
        generatedLoot.add(itemStack.create());
        return generatedLoot;
    }

    @Override public MapCodec<? extends IGlobalLootModifier> codec() { return CODEC; }
}
```

- `LootModifier` 基类已处理条件数组与 codecStart 样板；你只需写 `doApply`。
- 条件用原版 loot condition JSON（如 `minecraft:random_chance`、`minecraft:match_tool`），复用原版生态。

## JSON 条目与排序文件

单个修改器 `data/<modid>/loot_modifiers/<name>.json`：

```json
{ "type": "mccourse:add_itemstack",
  "conditions": [ { "condition": "minecraft:random_chance", "chance": 0.25 } ],
  "stack": { "count": 1, "id": "mccourse:radish" } }
```

排序文件 `data/neoforge/loot_modifiers/global_loot_modifiers.json`（Forge 是 `forge/loot_modifiers/`）：

```json
{ "entries": ["mccourse:radish_to_short_grass", "mccourse:chisel_from_jungle_temple"],
  "replace": false }
```

- **entries 是执行顺序**；`replace:false` 表示与其他 mod 的条目合并（永远用 false，true 会吞掉别家）。
- 教程用 datagen（`ModGlobalLootModifierProvider`）生成这些 JSON，避免手写。

## 典型场景

| 场景 | 做法 |
|------|------|
| 怪物额外掉落 | 条件 `entity_properties`（实体类型）+ doApply 追加 stack |
| 结构箱注入 | 条件 `location`（loot_table id 前缀匹配）+ 追加 |
| 掉落替换/转化 | doApply 里 remove + add |
| 工具相关掉落 | 条件 `match_tool` + 自定义逻辑 |

## 反模式

- ❌ 直接改原版 loot table JSON（覆盖式，任何 mod 碰同一张表就打架）——GLM 就是为避免这个。
- ❌ `replace: true`。
- ❌ 在 doApply 里做重逻辑（每张表每次滚动都跑）；条件前置过滤。
- ❌ 忘了 serializer 注册或 order 文件漏条目 → 静默不生效（无报错），排查先看这两处。

## 不清楚时

- 教程源码（分支 `35-global-loot-modifiers`，MIT）：https://github.com/Tutorials-By-Kaupenjoe/NeoForge-Course-26.X
- API：`search_neoforge_docs` / `search_forge_docs`（关键词 loot modifier）
