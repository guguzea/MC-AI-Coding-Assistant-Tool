# BlockFlower.EnumFlowerType

**Inheritance:** java.lang.Object → java.lang.Enum<BlockFlower.EnumFlowerType> → net.minecraft.block.BlockFlower.EnumFlowerType

## Class signature

```java
public static enum BlockFlower.EnumFlowerType extends java.lang.Enum<BlockFlower.EnumFlowerType> implements IStringSerializable
```

## Methods

- `BlockFlower.EnumFlowerColor getBlockType()`
- `int getMeta()`
- `java.lang.String getName()`
- `static BlockFlower.EnumFlowerType getType(BlockFlower.EnumFlowerColor blockType, int meta)` — Get the given FlowerType from BlockType & metadata
- `static BlockFlower.EnumFlowerType [] getTypes(BlockFlower.EnumFlowerColor flowerColor)` — Get all FlowerTypes that are applicable for the given Flower block ("yellow", "red")
- `java.lang.String getUnlocalizedName()`
- `java.lang.String toString()`
- `static BlockFlower.EnumFlowerType valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static BlockFlower.EnumFlowerType [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.