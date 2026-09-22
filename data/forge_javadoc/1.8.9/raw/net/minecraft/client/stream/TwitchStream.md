---
title: "TwitchStream"
description: "public class TwitchStream extends java.lang.Object implements BroadcastController.BroadcastListener, ChatController.ChatListener, IngestServerTester.IngestTestListener, IStream"
package: "net/minecraft/client/stream"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/stream/TwitchStream.html"
sourceType: javadoc
---

# TwitchStream

**Inheritance:** java.lang.Object → net.minecraft.client.stream.TwitchStream

## Class signature

```java
public class TwitchStream extends java.lang.Object implements BroadcastController.BroadcastListener, ChatController.ChatListener, IngestServerTester.IngestTestListener, IStream
```

## Constructors

- `TwitchStream(Minecraft mcIn, Property streamProperty)`

## Methods

- `static float formatStreamBps(float p_152947_0_)`
- `static int formatStreamFps(float p_152948_0_)`
- `static int formatStreamKbps(float p_152946_0_)`
- `void func_152891_a(BroadcastController.BroadcastState p_152891_1_)`
- `void func_152892_c(ErrorCode p_152892_1_)`
- `void func_152893_b(ErrorCode p_152893_1_)`
- `void func_152894_a(StreamInfo p_152894_1_)`
- `void func_152895_a()`
- `void func_152896_a(IngestList p_152896_1_)`
- `void func_152897_a(ErrorCode p_152897_1_)`
- `void func_152898_a(ErrorCode p_152898_1_, GameInfo[] p_152898_2_)`
- `void func_152899_b()`
- `void func_152900_a(ErrorCode p_152900_1_, AuthToken p_152900_2_)`
- `void func_152901_c()`
- `void func_152907_a(IngestServerTester p_152907_1_, IngestServerTester.IngestTestState p_152907_2_)`
- `boolean func_152908_z()`
- `void func_152909_x()`
- `void func_152911_a(Metadata p_152911_1_, long p_152911_2_)`
- `ErrorCode func_152912_E()`
- `boolean func_152913_F()`
- `void func_152917_b(java.lang.String p_152917_1_)`
- `IStream.AuthFailureReason func_152918_H()`
- `int func_152920_A()`
- `java.lang.String func_152921_C()`
- `void func_152922_k()`
- `IngestServer[] func_152925_v()`
- `ChatUserInfo func_152926_a(java.lang.String p_152926_1_)`
- `boolean func_152927_B()`
- `boolean func_152928_D()`
- `boolean func_152929_G()`
- `void func_152930_t()`
- `IngestServerTester func_152932_y()`
- `void func_152935_j()`
- `boolean func_152936_l()`
- `protected void func_152942_I()`
- `void func_176016_c(java.lang.String p_176016_1_)`
- `void func_176017_a(ChatController.ChatState p_176017_1_)`
- `void func_176018_a(java.lang.String p_176018_1_, ChatUserInfo[] p_176018_2_, ChatUserInfo[] p_176018_3_, ChatUserInfo[] p_176018_4_)`
- `void func_176019_a(java.lang.String p_176019_1_, java.lang.String p_176019_2_)`
- `void func_176020_d(java.lang.String p_176020_1_)`
- `void func_176021_d()`
- `void func_176022_e(ErrorCode p_176022_1_)`
- `void func_176023_d(ErrorCode p_176023_1_)`
- `void func_176024_e()`
- `void func_176025_a(java.lang.String p_176025_1_, ChatTokenizedMessage[] p_176025_2_)`
- `void func_176026_a(Metadata p_176026_1_, long p_176026_2_, long p_176026_4_)`
- `void func_180605_a(java.lang.String p_180605_1_, ChatRawMessage[] p_180605_2_)`
- `void func_180606_a(java.lang.String p_180606_1_)`
- `void func_180607_b(java.lang.String p_180607_1_)`
- `boolean isBroadcasting()`
- `boolean isPaused()`
- `boolean isReadyToBroadcast()`
- `void muteMicrophone(boolean p_152910_1_)` — mutes or unmutes the microphone based on the boolean parameter passed into the method
- `void pause()` — pauses a stream
- `void requestCommercial()`
- `void shutdownStream()` — Shuts down a steam
- `void stopBroadcasting()`
- `void unpause()` — unpauses a stream
- `void updateStreamVolume()`

## Fields

- `static Marker STREAM_MARKER`
