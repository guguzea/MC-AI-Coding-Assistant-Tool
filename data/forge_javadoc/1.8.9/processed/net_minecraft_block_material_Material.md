# Material

**Inheritance:** java.lang.Object → net.minecraft.block.material.Material

## Class signature

```java
public class Material extends java.lang.Object
```

## Constructors

- `Material(MapColor color)`

## Methods

- `boolean blocksLight()` — Will prevent grass from growing on dirt underneath and kill any grass below it if it returns true
- `boolean blocksMovement()` — Returns if this material is considered solid or not
- `boolean getCanBurn()` — Returns if the block can burn or not.
- `MapColor getMaterialMapColor()` — Retrieves the color index of the block.
- `int getMaterialMobility()` — Returns the mobility information of the material, 0 = free, 1 = can't push but can move over, 2 = total immobility and stop pistons.
- `boolean isLiquid()` — Returns if blocks of these materials are liquids.
- `boolean isOpaque()` — Indicate if the material is opaque
- `boolean isReplaceable()` — Returns whether the material can be replaced by other blocks when placed - eg snow, vines and tall grass.
- `boolean isSolid()` — Returns true if the block is a considered solid.
- `boolean isToolNotRequired()` — Returns true if the material can be harvested without a tool (or with the wrong tool)
- `protected Material setAdventureModeExempt()`
- `protected Material setBurning()` — Set the canBurn bool to True and return the current object.
- `protected Material setImmovableMobility()` — This type of material can't be pushed, and pistons are blocked to move.
- `protected Material setNoPushMobility()` — This type of material can't be pushed, but pistons can move over it.
- `Material setReplaceable()` — Sets replaceable to true.
- `protected Material setRequiresTool()` — Makes blocks with this material require the correct tool to be harvested.

## Fields

- `static Material air`
- `static Material anvil`
- `static Material barrier`
- `static Material cactus`
- `static Material cake`
- `static Material carpet`
- `static Material circuits`
- `static Material clay`
- `static Material cloth`
- `static Material coral`
- `static Material craftedSnow` — The material for crafted snow.
- `static Material dragonEgg`
- `static Material fire`
- `static Material glass`
- `static Material gourd`
- `static Material grass`
- `static Material ground`
- `static Material ice`
- `static Material iron`
- `static Material lava`
- `static Material leaves`
- `static Material packedIce`
- `static Material piston` — Pistons' material.
- `static Material plants`
- `static Material portal`
- `static Material redstoneLight`
- `static Material rock`
- `static Material sand`
- `static Material snow`
- `static Material sponge`
- `static Material tnt`
- `static Material vine`
- `static Material water`
- `static Material web`
- `static Material wood`