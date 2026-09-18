---
title: "FMLIndexedMessageToMessageCodec"
description: "Make this accessible to subclasses"
package: "net/minecraftforge/fml/common/network"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/network/FMLIndexedMessageToMessageCodec.html"
sourceType: javadoc
---

# FMLIndexedMessageToMessageCodec

## Constructors

- `public FMLIndexedMessageToMessageCodec()`

## Methods

- `public void handlerAdded(io.netty.channel.ChannelHandlerContext ctx) throws java.lang.Exception`
- `public FMLIndexedMessageToMessageCodec < A > addDiscriminator(int discriminator, java.lang.Class<? extends A > type)`
- `public abstract void encodeInto(io.netty.channel.ChannelHandlerContext ctx, A msg, io.netty.buffer.ByteBuf target) throws java.lang.Exception`
- `protected final void encode(io.netty.channel.ChannelHandlerContext ctx, A msg, java.util.List<java.lang.Object> out) throws java.lang.Exception`
- `public abstract void decodeInto(io.netty.channel.ChannelHandlerContext ctx, io.netty.buffer.ByteBuf source, A msg)`
- `protected final void decode(io.netty.channel.ChannelHandlerContext ctx, FMLProxyPacket msg, java.util.List<java.lang.Object> out) throws java.lang.Exception`
- `protected void testMessageValidity( FMLProxyPacket msg)`
- `public void exceptionCaught(io.netty.channel.ChannelHandlerContext ctx, java.lang.Throwable cause) throws java.lang.Exception`

## Description

Make this accessible to subclasses
