---
title: "CommandBase"
description: "public abstract class CommandBase extends java.lang.Object implements ICommand"
package: "net/minecraft/command"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/command/CommandBase.html"
sourceType: javadoc
---

# CommandBase

## Class signature

```java
public abstract class CommandBase extends java.lang.Object implements ICommand
```

## Constructors

- `public CommandBase()`

## Methods

- `public int getRequiredPermissionLevel()`
- `public java.util.List getCommandAliases()`
- `public boolean canCommandSenderUseCommand( ICommandSender p_71519_1_)`
- `public java.util.List addTabCompletionOptions( ICommandSender p_71516_1_, java.lang.String[] p_71516_2_)`
- `public static int parseInt( ICommandSender p_71526_0_, java.lang.String p_71526_1_)`
- `public static int parseIntWithMin( ICommandSender p_71528_0_, java.lang.String p_71528_1_, int p_71528_2_)`
- `public static int parseIntBounded( ICommandSender p_71532_0_, java.lang.String p_71532_1_, int p_71532_2_, int p_71532_3_)`
- `public static double parseDouble( ICommandSender p_82363_0_, java.lang.String p_82363_1_)`
- `public static double parseDoubleWithMin( ICommandSender p_110664_0_, java.lang.String p_110664_1_, double p_110664_2_)`
- `public static double parseDoubleBounded( ICommandSender p_110661_0_, java.lang.String p_110661_1_, double p_110661_2_, double p_110661_4_)`
- `public static boolean parseBoolean( ICommandSender p_110662_0_, java.lang.String p_110662_1_)`
- `public static EntityPlayerMP getCommandSenderAsPlayer( ICommandSender p_71521_0_)`
- `public static EntityPlayerMP getPlayer( ICommandSender p_82359_0_, java.lang.String p_82359_1_)`
- `public static java.lang.String func_96332_d( ICommandSender p_96332_0_, java.lang.String p_96332_1_)`
- `public static IChatComponent func_147178_a( ICommandSender p_147178_0_, java.lang.String[] p_147178_1_, int p_147178_2_)`
- `public static IChatComponent func_147176_a( ICommandSender p_147176_0_, java.lang.String[] p_147176_1_, int p_147176_2_, boolean p_147176_3_)`
- `public static java.lang.String func_82360_a( ICommandSender p_82360_0_, java.lang.String[] p_82360_1_, int p_82360_2_)`
- `public static double func_110666_a( ICommandSender p_110666_0_, double p_110666_1_, java.lang.String p_110666_3_)`
- `public static double func_110665_a( ICommandSender p_110665_0_, double p_110665_1_, java.lang.String p_110665_3_, int p_110665_4_, int p_110665_5_)`
- `public static Item getItemByText( ICommandSender p_147179_0_, java.lang.String p_147179_1_)`
- `public static Block getBlockByText( ICommandSender p_147180_0_, java.lang.String p_147180_1_)`
- `public static java.lang.String joinNiceString(java.lang.Object[] p_71527_0_)`
- `public static IChatComponent joinNiceString( IChatComponent [] p_147177_0_)`
- `public static java.lang.String joinNiceStringFromCollection(java.util.Collection p_96333_0_)`
- `public static boolean doesStringStartWith(java.lang.String p_71523_0_, java.lang.String p_71523_1_)`
- `public static java.util.List getListOfStringsMatchingLastWord(java.lang.String[] p_71530_0_, java.lang.String... p_71530_1_)`
- `public static java.util.List getListOfStringsFromIterableMatchingLastWord(java.lang.String[] p_71531_0_, java.lang.Iterable p_71531_1_)`
- `public boolean isUsernameIndex(java.lang.String[] p_82358_1_, int p_82358_2_)`
- `public static void func_152373_a( ICommandSender p_152373_0_, ICommand p_152373_1_, java.lang.String p_152373_2_, java.lang.Object... p_152373_3_)`
- `public static void func_152374_a( ICommandSender p_152374_0_, ICommand p_152374_1_, int p_152374_2_, java.lang.String p_152374_3_, java.lang.Object... p_152374_4_)`
- `public static void setAdminCommander( IAdminCommand p_71529_0_)`
- `public int compareTo( ICommand p_compareTo_1_)`
- `public int compareTo(java.lang.Object p_compareTo_1_)`
