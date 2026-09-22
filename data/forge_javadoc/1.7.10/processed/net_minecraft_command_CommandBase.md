# CommandBase

**Inheritance:** java.lang.Object → net.minecraft.command.CommandBase

## Class signature

```java
public abstract class CommandBase extends java.lang.Object implements ICommand
```

## Constructors

- `CommandBase()`

## Methods

- `java.util.List addTabCompletionOptions(ICommandSender p_71516_1_, java.lang.String[] p_71516_2_)`
- `boolean canCommandSenderUseCommand(ICommandSender p_71519_1_)`
- `int compareTo(ICommand p_compareTo_1_)`
- `int compareTo(java.lang.Object p_compareTo_1_)`
- `static boolean doesStringStartWith(java.lang.String p_71523_0_, java.lang.String p_71523_1_)`
- `static double func_110665_a(ICommandSender p_110665_0_, double p_110665_1_, java.lang.String p_110665_3_, int p_110665_4_, int p_110665_5_)`
- `static double func_110666_a(ICommandSender p_110666_0_, double p_110666_1_, java.lang.String p_110666_3_)`
- `static IChatComponent func_147176_a(ICommandSender p_147176_0_, java.lang.String[] p_147176_1_, int p_147176_2_, boolean p_147176_3_)`
- `static IChatComponent func_147178_a(ICommandSender p_147178_0_, java.lang.String[] p_147178_1_, int p_147178_2_)`
- `static void func_152373_a(ICommandSender p_152373_0_, ICommand p_152373_1_, java.lang.String p_152373_2_, java.lang.Object... p_152373_3_)`
- `static void func_152374_a(ICommandSender p_152374_0_, ICommand p_152374_1_, int p_152374_2_, java.lang.String p_152374_3_, java.lang.Object... p_152374_4_)`
- `static java.lang.String func_82360_a(ICommandSender p_82360_0_, java.lang.String[] p_82360_1_, int p_82360_2_)`
- `static java.lang.String func_96332_d(ICommandSender p_96332_0_, java.lang.String p_96332_1_)`
- `static Block getBlockByText(ICommandSender p_147180_0_, java.lang.String p_147180_1_)`
- `java.util.List getCommandAliases()`
- `static EntityPlayerMP getCommandSenderAsPlayer(ICommandSender p_71521_0_)`
- `static Item getItemByText(ICommandSender p_147179_0_, java.lang.String p_147179_1_)`
- `static java.util.List getListOfStringsFromIterableMatchingLastWord(java.lang.String[] p_71531_0_, java.lang.Iterable p_71531_1_)`
- `static java.util.List getListOfStringsMatchingLastWord(java.lang.String[] p_71530_0_, java.lang.String... p_71530_1_)`
- `static EntityPlayerMP getPlayer(ICommandSender p_82359_0_, java.lang.String p_82359_1_)`
- `int getRequiredPermissionLevel()`
- `boolean isUsernameIndex(java.lang.String[] p_82358_1_, int p_82358_2_)`
- `static IChatComponent joinNiceString(IChatComponent [] p_147177_0_)`
- `static java.lang.String joinNiceString(java.lang.Object[] p_71527_0_)`
- `static java.lang.String joinNiceStringFromCollection(java.util.Collection p_96333_0_)`
- `static boolean parseBoolean(ICommandSender p_110662_0_, java.lang.String p_110662_1_)`
- `static double parseDouble(ICommandSender p_82363_0_, java.lang.String p_82363_1_)`
- `static double parseDoubleBounded(ICommandSender p_110661_0_, java.lang.String p_110661_1_, double p_110661_2_, double p_110661_4_)`
- `static double parseDoubleWithMin(ICommandSender p_110664_0_, java.lang.String p_110664_1_, double p_110664_2_)`
- `static int parseInt(ICommandSender p_71526_0_, java.lang.String p_71526_1_)`
- `static int parseIntBounded(ICommandSender p_71532_0_, java.lang.String p_71532_1_, int p_71532_2_, int p_71532_3_)`
- `static int parseIntWithMin(ICommandSender p_71528_0_, java.lang.String p_71528_1_, int p_71528_2_)`
- `static void setAdminCommander(IAdminCommand p_71529_0_)`