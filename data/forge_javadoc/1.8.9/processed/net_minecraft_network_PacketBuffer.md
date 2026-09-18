# PacketBuffer

## Class signature

```java
public class PacketBuffer extends ByteBuf
```

## Constructors

- `public PacketBuffer(ByteBuf wrapped)`

## Methods

- `public static int getVarIntSize(int input)`
- `public void writeByteArray(byte[] array)`
- `public byte[] readByteArray()`
- `public BlockPos readBlockPos()`
- `public void writeBlockPos( BlockPos pos)`
- `public IChatComponent readChatComponent() throws java.io.IOException`
- `public void writeChatComponent( IChatComponent component) throws java.io.IOException`
- `public <T extends java.lang.Enum<T>> T readEnumValue(java.lang.Class<T> enumClass)`
- `public void writeEnumValue(java.lang.Enum<?> value)`
- `public int readVarIntFromBuffer()`
- `public long readVarLong()`
- `public void writeUuid(java.util.UUID uuid)`
- `public java.util.UUID readUuid()`
- `public void writeVarIntToBuffer(int input)`
- `public void writeVarLong(long value)`
- `public void writeNBTTagCompoundToBuffer( NBTTagCompound nbt)`
- `public NBTTagCompound readNBTTagCompoundFromBuffer() throws java.io.IOException`
- `public void writeItemStackToBuffer( ItemStack stack)`
- `public ItemStack readItemStackFromBuffer() throws java.io.IOException`
- `public java.lang.String readStringFromBuffer(int maxLength)`
- `public PacketBuffer writeString(java.lang.String string)`
- `public int capacity()`
- `public ByteBuf capacity(int p_capacity_1_)`
- `public int maxCapacity()`
- `public ByteBufAllocator alloc()`
- `public java.nio.ByteOrder order()`
- `public ByteBuf order(java.nio.ByteOrder p_order_1_)`
- `public ByteBuf unwrap()`
- `public boolean isDirect()`
- `public int readerIndex()`
- `public ByteBuf readerIndex(int p_readerIndex_1_)`
- `public int writerIndex()`
- `public ByteBuf writerIndex(int p_writerIndex_1_)`
- `public ByteBuf setIndex(int p_setIndex_1_, int p_setIndex_2_)`
- `public int readableBytes()`
- `public int writableBytes()`
- `public int maxWritableBytes()`
- `public boolean isReadable()`
- `public boolean isReadable(int p_isReadable_1_)`
- `public boolean isWritable()`
- `public boolean isWritable(int p_isWritable_1_)`
- `public ByteBuf clear()`
- `public ByteBuf markReaderIndex()`
- `public ByteBuf resetReaderIndex()`
- `public ByteBuf markWriterIndex()`
- `public ByteBuf resetWriterIndex()`
- `public ByteBuf discardReadBytes()`
- `public ByteBuf discardSomeReadBytes()`
- `public ByteBuf ensureWritable(int p_ensureWritable_1_)`
- `public int ensureWritable(int p_ensureWritable_1_, boolean p_ensureWritable_2_)`
- `public boolean getBoolean(int p_getBoolean_1_)`
- `public byte getByte(int p_getByte_1_)`
- `public short getUnsignedByte(int p_getUnsignedByte_1_)`
- `public short getShort(int p_getShort_1_)`
- `public int getUnsignedShort(int p_getUnsignedShort_1_)`
- `public int getMedium(int p_getMedium_1_)`
- `public int getUnsignedMedium(int p_getUnsignedMedium_1_)`
- `public int getInt(int p_getInt_1_)`
- `public long getUnsignedInt(int p_getUnsignedInt_1_)`
- `public long getLong(int p_getLong_1_)`
- `public char getChar(int p_getChar_1_)`
- `public float getFloat(int p_getFloat_1_)`
- `public double getDouble(int p_getDouble_1_)`
- `public ByteBuf getBytes(int p_getBytes_1_, ByteBuf p_getBytes_2_)`
- `public ByteBuf getBytes(int p_getBytes_1_, ByteBuf p_getBytes_2_, int p_getBytes_3_)`
- `public ByteBuf getBytes(int p_getBytes_1_, ByteBuf p_getBytes_2_, int p_getBytes_3_, int p_getBytes_4_)`
- `public ByteBuf getBytes(int p_getBytes_1_, byte[] p_getBytes_2_)`
- `public ByteBuf getBytes(int p_getBytes_1_, byte[] p_getBytes_2_, int p_getBytes_3_, int p_getBytes_4_)`
- `public ByteBuf getBytes(int p_getBytes_1_, java.nio.ByteBuffer p_getBytes_2_)`
- `public ByteBuf getBytes(int p_getBytes_1_, java.io.OutputStream p_getBytes_2_, int p_getBytes_3_) throws java.io.IOException`
- `public ByteBuf setBoolean(int p_setBoolean_1_, boolean p_setBoolean_2_)`
- `public ByteBuf setByte(int p_setByte_1_, int p_setByte_2_)`
- `public ByteBuf setShort(int p_setShort_1_, int p_setShort_2_)`
- `public ByteBuf setMedium(int p_setMedium_1_, int p_setMedium_2_)`
- `public ByteBuf setInt(int p_setInt_1_, int p_setInt_2_)`
- `public ByteBuf setLong(int p_setLong_1_, long p_setLong_2_)`
- `public ByteBuf setChar(int p_setChar_1_, int p_setChar_2_)`
- `public ByteBuf setFloat(int p_setFloat_1_, float p_setFloat_2_)`
- `public ByteBuf setDouble(int p_setDouble_1_, double p_setDouble_2_)`
- `public ByteBuf setBytes(int p_setBytes_1_, ByteBuf p_setBytes_2_)`
- `public ByteBuf setBytes(int p_setBytes_1_, ByteBuf p_setBytes_2_, int p_setBytes_3_)`
- `public ByteBuf setBytes(int p_setBytes_1_, ByteBuf p_setBytes_2_, int p_setBytes_3_, int p_setBytes_4_)`
- `public ByteBuf setBytes(int p_setBytes_1_, byte[] p_setBytes_2_)`
- `public ByteBuf setBytes(int p_setBytes_1_, byte[] p_setBytes_2_, int p_setBytes_3_, int p_setBytes_4_)`
- `public ByteBuf setBytes(int p_setBytes_1_, java.nio.ByteBuffer p_setBytes_2_)`
- `public ByteBuf setZero(int p_setZero_1_, int p_setZero_2_)`
- `public boolean readBoolean()`
- `public byte readByte()`
- `public short readUnsignedByte()`
- `public short readShort()`
- `public int readUnsignedShort()`
- `public int readMedium()`
- `public int readUnsignedMedium()`
- `public int readInt()`
- `public long readUnsignedInt()`
- `public long readLong()`
- `public char readChar()`
- `public float readFloat()`
- `public double readDouble()`
- `public ByteBuf readBytes(int p_readBytes_1_)`
- `public ByteBuf readSlice(int p_readSlice_1_)`
- `public ByteBuf readBytes(ByteBuf p_readBytes_1_)`
- `public ByteBuf readBytes(ByteBuf p_readBytes_1_, int p_readBytes_2_)`
- `public ByteBuf readBytes(ByteBuf p_readBytes_1_, int p_readBytes_2_, int p_readBytes_3_)`
- `public ByteBuf readBytes(byte[] p_readBytes_1_)`
- `public ByteBuf readBytes(byte[] p_readBytes_1_, int p_readBytes_2_, int p_readBytes_3_)`
- `public ByteBuf readBytes(java.nio.ByteBuffer p_readBytes_1_)`
- `public ByteBuf readBytes(java.io.OutputStream p_readBytes_1_, int p_readBytes_2_) throws java.io.IOException`
- `public ByteBuf skipBytes(int p_skipBytes_1_)`
- `public ByteBuf writeBoolean(boolean p_writeBoolean_1_)`
- `public ByteBuf writeByte(int p_writeByte_1_)`
- `public ByteBuf writeShort(int p_writeShort_1_)`
- `public ByteBuf writeMedium(int p_writeMedium_1_)`
- `public ByteBuf writeInt(int p_writeInt_1_)`
- `public ByteBuf writeLong(long p_writeLong_1_)`
- `public ByteBuf writeChar(int p_writeChar_1_)`
- `public ByteBuf writeFloat(float p_writeFloat_1_)`
- `public ByteBuf writeDouble(double p_writeDouble_1_)`
- `public ByteBuf writeBytes(ByteBuf p_writeBytes_1_)`
- `public ByteBuf writeBytes(ByteBuf p_writeBytes_1_, int p_writeBytes_2_)`

## Description

Calculates the number of bytes required to fit the supplied int (0-5) if it were to be read/written using readVarIntFromBuffer or writeVarIntToBuffer