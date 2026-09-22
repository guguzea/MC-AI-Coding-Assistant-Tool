> 来源：https://learn.microsoft.com/en-us/minecraft/creator/documents/createtradetable?view=minecraft-bedrock-stable
> 抓取时间：2026-09-21T11:50:06.000Z
> 警告：此文档可能滞后于当前正式版

# Creating a Trade Table

If you're making your own villagers (or tweaking existing ones), you're going to want to create trade tables for them, detailing what they can give players and what they want in exchange. Trade tables can make your Minecraft villages more engaging and alive.

You should be familiar with these concepts before starting this tutorial:

- Introduction to Loot and Trade Tables

- Loot and Trade Table Functions

- Introduction to Behavior Packs

## The basics of trade tables

Since trading happens with entities—villagers, specifically—a trade table must be referenced from an entity. In the `component_groups` section of the `villager_v2` Vanilla entity, for instance, this section controls the butchers' trading:

```json
"butcher": {
 "minecraft:behavior.trade_interest": {
 "priority": 5,
 "within_radius": 6.0,
 "interest_time": 45.0,
 "remove_item_time": 1.0,
 "carried_item_switch_time": 2.0,
 "cooldown": 2.0
 },
 "minecraft:economy_trade_table": {
 "display_name": "entity.villager.butcher",
 "table": "trading/economy_trades/butcher_trades.json",
 "new_screen": true,
 "persist_trades": true,
 "cured_discount": [-25, -20],
 "max_cured_discount": [-25, -20]
 }
}
```

The `trade_interest` block sets values such as how close the butcher has to be to be interested by a player holding an item they want (`within_radius`), how long the butcher has to wait between trades before trying to make a new one (`cooldown`), and other properties relating to initiating and ending trade attempts. The `economy_trade_table` block points to the trade table, along with setting a few other values relating to trading, such as whether trading with it opens the new trading screen.

What's the difference between `trade_table` and `economy_trade_table` ? They're mostly the same, but the `economy_trade_table` is the current version, and the one you should use. In the Vanilla samples , these trade tables are in the trading/economy_trades/ folder; the tables in the parent trading/ folder aren't used.

Here's a simple trade table for a butcher:

```json
{
 "tiers": [
 {
 "trades": [
 {
 "wants": [
 { "item": "minecraft:porkchop",
 "quantity": { "min": 14, "max": 18 }
 }
 ],
 "gives": [
 { "item": "minecraft:emerald" }
 ]
 },
 {
 "wants": [
 { "item": "minecraft:emerald" }
 ],
 "gives": [
 { "item": "minecraft:cooked_porkchop",
 "quantity": { "min": 5, "max": 7 }
 }
 ]
 }
 ]
 }
 ]
}
```

Instead of the pools of loot tables, the top level of trade tables are tiers . Tiers group possible trades by experience: the higher the tier, the more experience the trader needs to be able to access it. By default, every trade gives a trader one experience point ("XP"), and every successive tier in a trade table requires one more experience point total for the trader to access it. Trades in the first tier require 0 or 1 XP, the second tier requires 2 XP, the third requires 3 XP, and so on.

Tiers are unlocked by the trading experience of the villager, not the player. The first tier in a list of trade tiers is always available, regardless of the trader's XP.

This trade table has only one tier, and that tier consists of two possible trades. In the first, the butcher wants porkchops—at least 14, and as many as 18—and will give an emerald in exchange. In the second, you can give the butcher an emerald in exchange for about a half-dozen cooked porkchops. (The value in the `quantity` range is chosen randomly for purposes of the trade; a `quantity` can also just be an integer, so `quantity: 6` would always give you exactly a half-dozen cooked porkchops for one emerald.)

## Trade groups

Suppose we wanted to have different butchers have different items available for trading; for instance, one butcher might want a chicken, another one might want a rabbit, a third might have those delicious cooked porkchops. We can do this in a trade table by using trade groups .

```json
{
 "tiers": [
 {
 "groups": [
 {
 "num_to_select": 1,
 "trades": [
 {
 "wants": [
 {
 "item": "minecraft:chicken",
 "quantity": 14
 }
 ],
 "gives": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ]
 },
 {
 "wants": [
 {
 "item": "minecraft:rabbit",
 "quantity": 4
 }
 ],
 "gives": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ]
 },
 {
 "wants": [
 {
 "item": "minecraft:porkchop",
 "quantity": 7
 }
 ],
 "gives": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ]
 }
 ]
 },
 {
 "num_to_select": 1,
 "trades": [
 {
 "wants": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ],
 "gives": [
 {
 "item": "minecraft:rabbit_stew",
 "quantity": 1
 }
 ]
 }
 ]
 }
 ]
 }
 ]
}
```

Now, we have two items in a `groups` array. Each item is an object that contains a `trades` array, which we've seen before, but also contains a `num_to_select` property. This is the number of trades from the `trades` array to make available when you trade with a given villager. In the first trade group, only one of the three trades will be available; the second group only has one trade in it, so `num_to_select: 1` will always select it.

## Add complexity

Now that you have the basics down, let's show off (nearly) everything you can do with a trade table. This is taken right from `butcher_trades.json` in the bedrock-samples repository, as of version 1.26.0.2, shortened to just two tiers.

```json
{
 "tiers": [
 {
 "total_exp_required": 0,
 "groups": [
 {
 "num_to_select": 1,
 "trades": [
 {
 "wants": [
 {
 "item": "minecraft:chicken",
 "quantity": 14,
 "price_multiplier": 0.05
 }
 ],
 "gives": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ],
 "trader_exp": 2,
 "max_uses": 16,
 "reward_exp": true
 },
 {
 "wants": [
 {
 "item": "minecraft:rabbit",
 "quantity": 4,
 "price_multiplier": 0.05
 }
 ],
 "gives": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ],
 "trader_exp": 2,
 "max_uses": 16,
 "reward_exp": true
 }
 ]
 },
 {
 "num_to_select": 1,
 "trades": [
 {
 "wants": [
 {
 "item": "minecraft:emerald",
 "quantity": 1,
 "price_multiplier": 0.05
 }
 ],
 "gives": [
 {
 "item": "minecraft:rabbit_stew",
 "quantity": 1
 }
 ],
 "trader_exp": 1,
 "max_uses": 12,
 "reward_exp": true
 }
 ]
 }
 ]
 },
 {
 "total_exp_required": 10,
 "groups": [
 {
 "num_to_select": 1,
 "trades": [
 {
 "wants": [
 {
 "item": "minecraft:coal:0",
 "quantity": 15,
 "price_multiplier": 0.05
 }
 ],
 "gives": [
 {
 "item": "minecraft:emerald",
 "quantity": 1
 }
 ],
 "trader_exp": 10,
 "max_uses": 16,
 "reward_exp": true
 }
 ]
 }
 ]
 }
 ]
}
```

It's a big chunk of JSON, but we'll walk through the new parts.

- Each tier begins with total_exp_required . This specifies how many experience points the trader (not the player!) needs to unlock the tier.

- A price_multiplier on an item sets how much the item's price can increase due to supply and demand changes. 0.05 (the default) allows the price to go up by 5%.

- A max_uses property on a trade sets how many times the trade can be made before the trader needs to restock. (The default is 12 .)

- The trader_exp property sets how many experience points the trader gains when making the trade successfully. If you're using total_exp_required , using this lets you make higher-tier trades worth more than lower-tier ones.

- The reward_exp property is a boolean, determining whether the player gets experience for completing the trade. (The default is true .)

Even with `total_exp_required`, the first tier is always unlocked. Tiers should be listed in order of ascending XP requirements: once the trading system hits a tier that requires more experience points than the trader has, subsequent tiers won't be checked!

## Overriding Vanilla assets

You can override an existing Vanilla trade table simply by placing a new trading table with the same name and path in your behavior pack. The existing tables, with their full paths, are:

- trading/economy_trades/armorer_trades.json

- trading/economy_trades/butcher_trades.json

- trading/economy_trades/cartographer_trades.json

- trading/economy_trades/cleric_trades.json

- trading/economy_trades/farmer_trades.json

- trading/economy_trades/fisherman_trades.json

- trading/economy_trades/fletcher_trades.json

- trading/economy_trades/leather_worker_trades.json

- trading/economy_trades/librarian_trades.json

- trading/economy_trades/shepherd_trades.json

- trading/economy_trades/tool_smith_trades.json

- trading/economy_trades/wandering_trader_trades.json

- trading/economy_trades/weapon_smith_trades.json

You can also update a trader's entity definition to point to an entirely new trade table location.

## Next steps

For a comprehensive look at trade tables and all their properties, read the Trade Table Reference .

## Feedback

 Was this page helpful?

 Yes

 No

 No

 Need help with this topic?

 Want to try using Ask Learn to clarify or guide you through this topic?

 Suggest a fix?
