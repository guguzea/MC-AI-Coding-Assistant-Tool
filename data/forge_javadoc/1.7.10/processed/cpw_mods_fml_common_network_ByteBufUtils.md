# ByteBufUtils

**Inheritance:** java.lang.Object → cpw.mods.fml.common.network.ByteBufUtils

## Class signature

```java
public class ByteBufUtils extends java.lang.Object
```

## Constructors

- `ByteBufUtils()`

## Methods

- `static java.lang.String getContentDump(ByteBuf buffer)`
- `static ItemStack readItemStack(ByteBuf from)` — Read an ItemStack from the byte buffer provided.
- `static NBTTagCompound readTag(ByteBuf from)` — Read an NBTTagCompound from the byte buffer.
- `static java.lang.String readUTF8String(ByteBuf from)` — Read a UTF8 string from the byte buffer.
- `static int readVarInt(ByteBuf buf, int maxSize)` — Read a varint from the supplied buffer.
- `static int readVarShort(ByteBuf buf)` — An extended length short.
- `static int varIntByteCount(int toCount)` — The number of bytes to write the supplied int using the 7 bit varint encoding.
- `static void writeItemStack(ByteBuf to, ItemStack stack)` — Write an ItemStack using minecraft compatible encoding.
- `static void writeTag(ByteBuf to, NBTTagCompound tag)` — Write an NBTTagCompound to the byte buffer.
- `static void writeUTF8String(ByteBuf to, java.lang.String string)` — Write a String with UTF8 byte encoding to the buffer.
- `static void writeVarInt(ByteBuf to, int toWrite, int maxSize)` — Write an integer to the buffer using variable length encoding.
- `static void writeVarShort(ByteBuf buf, int toWrite)`