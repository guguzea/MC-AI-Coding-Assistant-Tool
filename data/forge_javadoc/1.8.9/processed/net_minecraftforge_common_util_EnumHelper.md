# EnumHelper

## Class signature

```java
public class EnumHelper extends java.lang.Object
```

## Constructors

- `public EnumHelper()`

## Methods

- `public static EnumAction addAction(java.lang.String name)`
- `public static ItemArmor.ArmorMaterial addArmorMaterial(java.lang.String name, java.lang.String textureName, int durability, int[] reductionAmounts, int enchantability)`
- `public static EntityPainting.EnumArt addArt(java.lang.String name, java.lang.String tile, int sizeX, int sizeY, int offsetX, int offsetY)`
- `public static EnumCreatureAttribute addCreatureAttribute(java.lang.String name)`
- `public static EnumCreatureType addCreatureType(java.lang.String name, java.lang.Class typeClass, int maxNumber, Material material, boolean peaceful, boolean animal)`
- `public static StructureStrongholdPieces.Stronghold.Door addDoor(java.lang.String name)`
- `public static EnumEnchantmentType addEnchantmentType(java.lang.String name)`
- `public static BlockPressurePlate.Sensitivity addSensitivity(java.lang.String name)`
- `public static MovingObjectPosition.MovingObjectType addMovingObjectType(java.lang.String name)`
- `public static EnumSkyBlock addSkyBlock(java.lang.String name, int lightValue)`
- `public static EntityPlayer.EnumStatus addStatus(java.lang.String name)`
- `public static Item.ToolMaterial addToolMaterial(java.lang.String name, int harvestLevel, int maxUses, float efficiency, float damage, int enchantability)`
- `public static EnumRarity addRarity(java.lang.String name, EnumChatFormatting color, java.lang.String displayName)`
- `public static void setFailsafeFieldValue(java.lang.reflect.Field field, java.lang.Object target, java.lang.Object value) throws java.lang.Exception`
- `public static <T extends java.lang.Enum<?>> T addEnum(java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Object... paramValues)`
- `public static <T extends java.lang.Enum<?>> T addEnum(java.lang.Class[][] map, java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Object... paramValues)`
- `public static <T extends java.lang.Enum<?>> T addEnum(java.lang.Class<T> enumType, java.lang.String enumName, java.lang.Class<?>[] paramTypes, java.lang.Object[] paramValues)`