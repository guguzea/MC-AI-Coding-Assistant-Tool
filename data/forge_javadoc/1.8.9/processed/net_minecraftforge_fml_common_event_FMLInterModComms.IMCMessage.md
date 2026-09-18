# FMLInterModComms.IMCMessage

## Methods

- `public java.lang.String toString()`
- `public java.lang.String getSender()`
- `public java.lang.String getStringValue()`
- `public NBTTagCompound getNBTValue()`
- `public ItemStack getItemStackValue()`
- `public <T,V> <any> getFunctionValue(java.lang.Class<T> functionFrom, java.lang.Class<V> functionTo)`
- `public java.lang.Class<?> getMessageType()`
- `public boolean isStringMessage()`
- `public boolean isItemStackMessage()`
- `public boolean isNBTMessage()`
- `public boolean isFunctionMessage()`

## Description

You will receive an instance of this for each message sent