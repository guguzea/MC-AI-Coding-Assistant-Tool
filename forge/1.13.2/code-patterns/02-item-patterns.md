# 物品相关模式（Forge 1.13.2）

## 模式: Basic Item

```yaml
模式: Basic Item
版本: Forge 1.13.2
平台: Forge
分类: item
依赖: []
扩展点: [方块物品]
---
public static final Item MY_ITEM = new Item(
    new Item.Properties()
        .group(ItemGroup.TAB_MISC)
        .maxStackSize(64)
);

@SubscribeEvent
public void onItemsRegistry(RegistryEvent.Register<Item> event) {
    event.getRegistry().register(
        MY_ITEM.setRegistryName(new ResourceLocation(MOD_ID, "my_item"))
    );
}
```

## 模式: Tool Item

```yaml
模式: Tool Item
版本: Forge 1.13.2
平台: Forge
分类: item
依赖: [ToolMaterial]
扩展点: [实体属性]
---
# 定义工具材料
public enum MyTier implements IItemTier {
    MY_MATERIAL(3, 1561, 8.0f, 3.0f, 15, () -> Ingredient.fromItems(Items.DIAMOND));

    private final int harvestLevel;
    private final int maxUses;
    private final float efficiency;
    private final float attackDamage;
    private final int enchantability;
    private final Ingredient repairMaterial;

    MyTier(int harvestLevel, int maxUses, float efficiency, float attackDamage,
           int enchantability, Supplier<Ingredient> repairMaterial) {
        this.harvestLevel = harvestLevel;
        this.maxUses = maxUses;
        this.efficiency = efficiency;
        this.attackDamage = attackDamage;
        this.enchantability = enchantability;
        this.repairMaterial = repairMaterial;
    }

    @Override public int getHarvestLevel() { return harvestLevel; }
    @Override public float getEfficiency() { return efficiency; }
    @Override public float getAttackDamage() { return attackDamage; }
    @Override public int getEnchantability() { return enchantability; }
    @Override public Ingredient getRepairMaterial() { return repairMaterial.get(); }
}

# 定义工具
public static final Item MY_SWORD = new SwordItem(MyTier.MY_MATERIAL, 3, 1.6f,
    new Item.Properties().group(ItemGroup.TAB_COMBAT));
```
