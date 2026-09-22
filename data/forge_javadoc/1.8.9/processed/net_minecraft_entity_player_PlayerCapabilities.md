# PlayerCapabilities

**Inheritance:** java.lang.Object → net.minecraft.entity.player.PlayerCapabilities

## Class signature

```java
public class PlayerCapabilities extends java.lang.Object
```

## Constructors

- `PlayerCapabilities()`

## Methods

- `float getFlySpeed()`
- `float getWalkSpeed()`
- `void readCapabilitiesFromNBT(NBTTagCompound tagCompound)`
- `void setFlySpeed(float speed)`
- `void setPlayerWalkSpeed(float speed)`
- `void writeCapabilitiesToNBT(NBTTagCompound tagCompound)`

## Fields

- `boolean allowEdit` — Indicates whether the player is allowed to modify the surroundings
- `boolean allowFlying` — whether or not to allow the player to fly when they double jump.
- `boolean disableDamage` — Disables player damage.
- `boolean isCreativeMode` — Used to determine if creative mode is enabled, and therefore if items should be depleted on usage
- `boolean isFlying` — Sets/indicates whether the player is flying.