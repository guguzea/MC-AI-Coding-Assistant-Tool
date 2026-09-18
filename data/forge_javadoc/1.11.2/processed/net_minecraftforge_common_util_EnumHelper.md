# EnumHelper

## Class signature

```java
public class EnumHelper extends java.lang.Object
```

## Constructors

- `public EnumHelper()`

## Methods

- `@Nullable public static EnumAction addAction(java.lang.String name)`
- `@Nullable public static ItemArmor.ArmorMaterial addArmorMaterial(java.lang.String name, java.lang.String textureName, int durability, int[] reductionAmounts, int enchantability, SoundEvent soundOnEquip, float toughness)`
- `@Nullable public static EntityPainting.EnumArt addArt(java.lang.String name, java.lang.String tile, int sizeX, int sizeY, int offsetX, int offsetY)`
- `@Nullable public static EnumCreatureAttribute addCreatureAttribute(java.lang.String name)`
- `@Nullable public static EnumCreatureType addCreatureType(java.lang.String name, java.lang.Class<?> typeClass, int maxNumber, Material material, boolean peaceful, boolean animal)`
- `@Nullable public static StructureStrongholdPieces.Stronghold.Door addDoor(java.lang.String name)`
- `@Nullable public static EnumEnchantmentType addEnchantmentType(java.lang.String name, com.google.common.base.Predicate< Item > delegate)`
- `@Nullable public static BlockPressurePlate.Sensitivity addSensitivity(java.lang.String name)`
- `@Nullable public static RayTraceResult.Type addMovingObjectType(java.lang.String name)`
- `@Nullable public static EnumSkyBlock addSkyBlock(java.lang.String name, int lightValue)`
- `@Nullable public static EntityPlayer.SleepResult addStatus(java.lang.String name)`
- `@Nullable public static Item.ToolMaterial addToolMaterial(java.lang.String name, int harvestLevel, int maxUses, float efficiency, float damage, int enchantability)`
- `@Nullable public static EnumRarity addRarity(java.lang.String name, TextFormatting color, java.lang.String displayName)`
- `public static void setFailsafeFieldValue(java.lang.reflect.Field field, @Nullable java.lang.Object target, @Nullable java.lang.Object value) throws java.lang.Exception`
- `@Nullable protected static <T extends java.lang.Enum<?>> T addEnum(java.lang.Class<?>[][] map, java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Object... paramValues)`
- `public static void testEnum(java.lang.Class<? extends java.lang.Enum<?>> enumType, java.lang.Class<?>[] paramTypes)`
- `@Nullable public static <T extends java.lang.Enum<?>> T addEnum(java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Class<?>[] paramTypes, java.lang.Object... paramValues)`