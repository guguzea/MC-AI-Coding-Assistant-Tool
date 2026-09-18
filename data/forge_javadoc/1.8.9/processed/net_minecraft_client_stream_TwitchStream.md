# TwitchStream

## Class signature

```java
public class TwitchStream extends java.lang.Object implements BroadcastController.BroadcastListener , ChatController.ChatListener , IngestServerTester.IngestTestListener , IStream
```

## Constructors

- `public TwitchStream( Minecraft mcIn, Property streamProperty)`

## Methods

- `public void shutdownStream()`
- `public void func_152935_j()`
- `protected void func_152942_I()`
- `public void func_152922_k()`
- `public boolean func_152936_l()`
- `public boolean isReadyToBroadcast()`
- `public boolean isBroadcasting()`
- `public void func_152911_a( Metadata p_152911_1_, long p_152911_2_)`
- `public void func_176026_a( Metadata p_176026_1_, long p_176026_2_, long p_176026_4_)`
- `public boolean isPaused()`
- `public void requestCommercial()`
- `public void pause()`
- `public void unpause()`
- `public void updateStreamVolume()`
- `public void func_152930_t()`
- `public void stopBroadcasting()`
- `public void func_152900_a(ErrorCode p_152900_1_, AuthToken p_152900_2_)`
- `public void func_152897_a(ErrorCode p_152897_1_)`
- `public void func_152898_a(ErrorCode p_152898_1_, GameInfo[] p_152898_2_)`
- `public void func_152891_a( BroadcastController.BroadcastState p_152891_1_)`
- `public void func_152895_a()`
- `public void func_152894_a(StreamInfo p_152894_1_)`
- `public void func_152896_a(IngestList p_152896_1_)`
- `public void func_152893_b(ErrorCode p_152893_1_)`
- `public void func_152899_b()`
- `public void func_152901_c()`
- `public void func_152892_c(ErrorCode p_152892_1_)`
- `public void func_152907_a( IngestServerTester p_152907_1_, IngestServerTester.IngestTestState p_152907_2_)`
- `public static int formatStreamFps(float p_152948_0_)`
- `public static int formatStreamKbps(float p_152946_0_)`
- `public static float formatStreamBps(float p_152947_0_)`
- `public IngestServer[] func_152925_v()`
- `public void func_152909_x()`
- `public IngestServerTester func_152932_y()`
- `public boolean func_152908_z()`
- `public int func_152920_A()`
- `public void func_176023_d(ErrorCode p_176023_1_)`
- `public void func_176022_e(ErrorCode p_176022_1_)`
- `public void func_176017_a( ChatController.ChatState p_176017_1_)`
- `public void func_180605_a(java.lang.String p_180605_1_, ChatRawMessage[] p_180605_2_)`
- `public void func_176025_a(java.lang.String p_176025_1_, ChatTokenizedMessage[] p_176025_2_)`
- `public void func_176018_a(java.lang.String p_176018_1_, ChatUserInfo[] p_176018_2_, ChatUserInfo[] p_176018_3_, ChatUserInfo[] p_176018_4_)`
- `public void func_180606_a(java.lang.String p_180606_1_)`
- `public void func_180607_b(java.lang.String p_180607_1_)`
- `public void func_176019_a(java.lang.String p_176019_1_, java.lang.String p_176019_2_)`
- `public void func_176021_d()`
- `public void func_176024_e()`
- `public void func_176016_c(java.lang.String p_176016_1_)`
- `public void func_176020_d(java.lang.String p_176020_1_)`
- `public boolean func_152927_B()`
- `public java.lang.String func_152921_C()`
- `public ChatUserInfo func_152926_a(java.lang.String p_152926_1_)`
- `public void func_152917_b(java.lang.String p_152917_1_)`
- `public boolean func_152928_D()`
- `public ErrorCode func_152912_E()`
- `public boolean func_152913_F()`
- `public void muteMicrophone(boolean p_152910_1_)`
- `public boolean func_152929_G()`
- `public IStream.AuthFailureReason func_152918_H()`

## Description

mutes or unmutes the microphone based on the boolean parameter passed into the method