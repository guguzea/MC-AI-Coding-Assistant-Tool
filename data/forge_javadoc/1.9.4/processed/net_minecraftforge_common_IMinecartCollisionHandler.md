# IMinecartCollisionHandler

## Class signature

```java
public interface IMinecartCollisionHandler
```

## Methods

- `AxisAlignedBB getBoundingBox(EntityMinecart cart)` — This function replaces the function of the same name in EntityMinecart.
- `AxisAlignedBB getCollisionBox(EntityMinecart cart, Entity other)` — This function replaced the function of the same name in EntityMinecart.
- `AxisAlignedBB getMinecartCollisionBox(EntityMinecart cart)` — This function is used to define the box used for detecting minecart collisions.
- `void onEntityCollision(EntityMinecart cart, Entity other)` — This basically replaces the function of the same name in EntityMinecart.