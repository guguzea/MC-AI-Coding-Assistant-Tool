# CPacketRecipeInfo

**Inheritance:** java.lang.Object → net.minecraft.network.play.client.CPacketRecipeInfo

## Class signature

```java
public class CPacketRecipeInfo extends java.lang.Object implements Packet<INetHandlerPlayServer>
```

## Constructors

- `CPacketRecipeInfo()`
- `CPacketRecipeInfo(boolean p_i47424_1_, boolean p_i47424_2_)`
- `CPacketRecipeInfo(IRecipe p_i47518_1_)`

## Methods

- `CPacketRecipeInfo.Purpose getPurpose()`
- `IRecipe getRecipe()`
- `boolean isFilteringCraftable()`
- `boolean isGuiOpen()`
- `void processPacket(INetHandlerPlayServer handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`