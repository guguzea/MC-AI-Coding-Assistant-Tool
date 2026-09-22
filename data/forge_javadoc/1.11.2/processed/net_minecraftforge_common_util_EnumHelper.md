# EnumHelper

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.EnumHelper

## Class signature

```java
public class EnumHelper extends java.lang.Object
```

## Constructors

- `EnumHelper()`

## Methods

- `static EnumAction addAction(java.lang.String name)`
- `static ItemArmor.ArmorMaterial addArmorMaterial(java.lang.String name, java.lang.String textureName, int durability, int[] reductionAmounts, int enchantability, SoundEvent soundOnEquip, float toughness)`
- `static EntityPainting.EnumArt addArt(java.lang.String name, java.lang.String tile, int sizeX, int sizeY, int offsetX, int offsetY)`
- `static EnumCreatureAttribute addCreatureAttribute(java.lang.String name)`
- `static EnumCreatureType addCreatureType(java.lang.String name, java.lang.Class<?> typeClass, int maxNumber, Material material, boolean peaceful, boolean animal)`
- `static StructureStrongholdPieces.Stronghold.Door addDoor(java.lang.String name)`
- `static EnumEnchantmentType addEnchantmentType(java.lang.String name, com.google.common.base.Predicate<Item> delegate)`
- `protected static<T extends java.lang.Enum<?>> T addEnum(java.lang.Class<?>[][] map, java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Object... paramValues)`
- `static<T extends java.lang.Enum<?>> T addEnum(java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Class<?>[] paramTypes, java.lang.Object... paramValues)`
- `static RayTraceResult.Type addMovingObjectType(java.lang.String name)`
- `static EnumRarity addRarity(java.lang.String name, TextFormatting color, java.lang.String displayName)`
- `static BlockPressurePlate.Sensitivity addSensitivity(java.lang.String name)`
- `static EnumSkyBlock addSkyBlock(java.lang.String name, int lightValue)`
- `static EntityPlayer.SleepResult addStatus(java.lang.String name)`
- `static Item.ToolMaterial addToolMaterial(java.lang.String name, int harvestLevel, int maxUses, float efficiency, float damage, int enchantability)`
- `static void setFailsafeFieldValue(java.lang.reflect.Field field, java.lang.Object target, java.lang.Object value)`
- `static void testEnum(java.lang.Class<? extends java.lang.Enum<?>> enumType, java.lang.Class<?>[] paramTypes)`