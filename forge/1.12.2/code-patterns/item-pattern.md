# 物品模式

## 基础物品

```java
public class MyItem extends Item {

    public MyItem() {
        super();
        setRegistryName(ExampleMod.MOD_ID, "my_item");
        setCreativeTab(CreativeTabs.MISC);
    }
}
```

## 工具类

```java
public static final Item.ToolMaterial COPPER = EnumHelper.addToolMaterial(
    "COPPER", 2, 200, 5.0F, 1.5F, 10
);

public class MySword extends ItemSword {
    public MySword(Item.ToolMaterial material) {
        super(material);
        setRegistryName(ExampleMod.MOD_ID, "my_sword");
    }
}

public class MyPickaxe extends ItemPickaxe {
    public MyPickaxe(Item.ToolMaterial material) {
        super(material);
        setRegistryName(ExampleMod.MOD_ID, "my_pickaxe");
    }
}
```

## 盔甲类

```java
public static final ItemArmor.ArmorMaterial COPPER_ARMOR = EnumHelper.addArmorMaterial(
    "COPPER",
    "examplemod:copper",
    15,
    new int[]{2, 5, 6, 2},
    9,
    SoundEvents.ITEM_ARMOR_EQUIP_IRON,
    0.0F
);

public class MyHelmet extends ItemArmor {
    public MyHelmet() {
        super(COPPER_ARMOR, 0, EntityEquipmentSlot.HEAD);
        setRegistryName(ExampleMod.MOD_ID, "my_helmet");
    }
}
```

## 食物类

```java
public class MyFood extends ItemFood {

    public MyFood() {
        super(6, 0.5F, false);
        setRegistryName(ExampleMod.MOD_ID, "my_food");
        setCreativeTab(CreativeTabs.FOOD);
        setContainerItem(Items.BOWL);
    }
}
```
