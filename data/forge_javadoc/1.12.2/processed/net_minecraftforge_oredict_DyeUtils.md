# DyeUtils

**Inheritance:** java.lang.Object → net.minecraftforge.oredict.DyeUtils

## Class signature

```java
public class DyeUtils extends java.lang.Object
```

## Constructors

- `DyeUtils()`

## Methods

- `static java.util.Optional<EnumDyeColor> colorFromStack(ItemStack stack)` — Get a dye's color.
- `static java.util.OptionalInt dyeDamageFromStack(ItemStack stack)` — Get the dye damage from the stack, which can be passed into EnumDyeColor.byDyeDamage(int) .
- `static boolean isDye(ItemStack stack)` — Check if an item stack is a dye.
- `static java.util.OptionalInt metaFromStack(ItemStack stack)` — Get the dye metadata from the stack, which can be passed into EnumDyeColor.byMetadata(int) .
- `static int rawDyeDamageFromStack(ItemStack stack)` — Similar to dyeDamageFromStack(ItemStack) , except that it returns the raw integer (with a -1 sentinel); this follows vanilla conventions.
- `static int rawMetaFromStack(ItemStack stack)` — Similar to metaFromStack(ItemStack) , except that it returns the raw integer (with a -1 sentinel); this follows vanilla conventions.