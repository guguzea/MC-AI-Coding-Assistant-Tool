# PacketUtil

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.PacketUtil

## Class signature

```java
public class PacketUtil extends java.lang.Object
```

## Methods

- `static void writeItemStackFromClientToServer(PacketBuffer buffer, ItemStack stack)` — Most ItemStack serialization is Server to Client, and must go through PacketBuffer.writeItemStack which uses Item.getNBTShareTag.