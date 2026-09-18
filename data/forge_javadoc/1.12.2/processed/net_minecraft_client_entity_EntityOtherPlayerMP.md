# EntityOtherPlayerMP

## Class signature

```java
public class EntityOtherPlayerMP extends AbstractClientPlayer
```

## Constructors

- `public EntityOtherPlayerMP( World worldIn, GameProfile gameProfileIn)`

## Methods

- `public boolean isInRangeToRenderDist(double distance)`
- `public boolean attackEntityFrom( DamageSource source, float amount)`
- `public void setPositionAndRotationDirect(double x, double y, double z, float yaw, float pitch, int posRotationIncrements, boolean teleport)`
- `public void onUpdate()`
- `public void onLivingUpdate()`
- `public void sendMessage( ITextComponent component)`
- `public boolean canUseCommand(int permLevel, java.lang.String commandName)`
- `public BlockPos getPosition()`