import * as mc from "@minecraft/server";

const { world, system } = mc;
const GameMode = mc.GameMode;
const CommandPermissionLevel = mc.CommandPermissionLevel ?? { Any: 0 };
const CustomCommandParamType = mc.CustomCommandParamType ?? { String: "String", Float: "Float", Integer: "Integer" };
const CustomCommandStatus = mc.CustomCommandStatus ?? { Success: 0, Failure: 1 };

const TAG = "[CLIENT]";
const COMMAND_DEFS = [
  { name: "qa:ping", description: "QA ping", params: [] },
  { name: "qa:pos", description: "Report position, rotation, game mode", params: [] },
  {
    name: "qa:look",
    description: "Set rotation in place",
    params: [
      { name: "pitch", type: CustomCommandParamType.Float },
      { name: "yaw", type: CustomCommandParamType.Float },
    ],
  },
  {
    name: "qa:tp",
    description: "Teleport",
    params: [
      { name: "x", type: CustomCommandParamType.Float },
      { name: "y", type: CustomCommandParamType.Float },
      { name: "z", type: CustomCommandParamType.Float },
    ],
  },
  {
    name: "qa:give",
    description: "Give an item",
    params: [
      { name: "item", type: CustomCommandParamType.String },
      { name: "count", type: CustomCommandParamType.Integer },
    ],
  },
  {
    name: "qa:spawn",
    description: "Spawn an entity in front of the player",
    params: [
      { name: "type", type: CustomCommandParamType.String },
      { name: "distance", type: CustomCommandParamType.Integer },
    ],
  },
  { name: "qa:clear", description: "Remove nearby non-player entities", params: [] },
  { name: "qa:time", description: "Set world time", params: [{ name: "ticks", type: CustomCommandParamType.Integer }] },
  { name: "qa:gm", description: "Set game mode", params: [{ name: "mode", type: CustomCommandParamType.String }] },
  { name: "qa:wall", description: "Place a 3x3 wall in front", params: [{ name: "block", type: CustomCommandParamType.String }] },
];

let beat = 0;
let commandChannel = "none";

function log(message) {
  console.log(`${TAG} ${message}`);
}

function round2(value) {
  return Number(value).toFixed(2);
}

function posOf(player) {
  const p = player.location;
  return `${round2(p.x)},${round2(p.y)},${round2(p.z)}`;
}

function rotOf(player) {
  const r = player.getRotation();
  return `${round2(r.x)},${round2(r.y)}`;
}

function safe(label, fn) {
  try {
    fn();
    return true;
  } catch (error) {
    log(`${label} error=${error}`);
    return false;
  }
}

log("boot script loaded");

safe("probe.beforeEvents", () => {
  log(`beforeEvents keys=${Object.keys(world.beforeEvents).join(",")}`);
});

safe("probe.afterEvents", () => {
  log(`afterEvents keys=${Object.keys(world.afterEvents).join(",")}`);
});

function buildShowcase(player) {
  const dim = world.getDimension("overworld");
  const px = Math.floor(player.location.x);
  const py = Math.floor(player.location.y);
  const pz = Math.floor(player.location.z);

  for (let dx = -5; dx <= 5; dx += 1) {
    for (let dz = -6; dz <= 4; dz += 1) {
      dim.setBlockType({ x: px + dx, y: py - 1, z: pz + dz }, "minecraft:stone");
      for (let dy = 0; dy <= 3; dy += 1) {
        dim.setBlockType({ x: px + dx, y: py + dy, z: pz + dz }, "minecraft:air");
      }
    }
  }

  for (let dx = -1; dx <= 1; dx += 1) {
    for (let dy = 0; dy <= 2; dy += 1) {
      dim.setBlockType({ x: px + dx, y: py + dy, z: pz - 3 }, "mcskill:client_block");
    }
  }
  dim.setBlockType({ x: px - 4, y: py, z: pz - 3 }, "minecraft:gold_block");
  dim.setBlockType({ x: px + 4, y: py, z: pz - 3 }, "minecraft:diamond_block");

  player.teleport(
    { x: px + 0.5, y: py + 1, z: pz + 1.5 },
    { dimension: dim, rotation: { x: 0, y: 180 } }
  );
  log(`showcase ready anchor=${px},${py},${pz} wall=3x3 at z=${pz - 3} player=${px + 0.5},${py + 1},${pz + 1.5}`);
}

function handleCommand(player, raw) {
  const parts = raw.split(/\s+/).filter((part) => part.length > 0);
  const cmd = (parts[0] ?? "").toLowerCase();
  const dim = player.dimension;
  const loc = player.location;

  if (cmd === "ping") {
    player.sendMessage(`pong pos=${posOf(player)}`);
    log("cmd ping ok");
    return;
  }
  if (cmd === "pos") {
    let gm = "unknown";
    try {
      gm = player.getGameMode();
    } catch (error) {
      log(`cmd pos getGameMode error=${error}`);
    }
    player.sendMessage(`pos=${posOf(player)} rot=${rotOf(player)} gm=${gm}`);
    log(`cmd pos ok gm=${gm}`);
    return;
  }
  if (cmd === "look") {
    const pitch = Number(parts[1] ?? 0);
    const yaw = Number(parts[2] ?? 0);
    player.teleport(loc, { dimension: dim, rotation: { x: pitch, y: yaw }, keepVelocity: false });
    log(`cmd look pitch=${pitch} yaw=${yaw} now=${rotOf(player)}`);
    return;
  }
  if (cmd === "tp") {
    const x = Number(parts[1]);
    const y = Number(parts[2]);
    const z = Number(parts[3]);
    player.teleport({ x, y, z }, { dimension: dim });
    log(`cmd tp to=${x},${y},${z} now=${posOf(player)}`);
    return;
  }
  if (cmd === "give") {
    const item = parts[1] ?? "minecraft:diamond_sword";
    const count = Number(parts[2] ?? 1);
    const container = player.getComponent("minecraft:inventory")?.container;
    if (!container) {
      log("cmd give error=no-inventory");
      return;
    }
    container.addItem({ typeId: item, amount: count });
    log(`cmd give item=${item} count=${count}`);
    return;
  }
  if (cmd === "spawn") {
    const type = parts[1] ?? "minecraft:zombie";
    const dist = Number(parts[2] ?? 3);
    const yaw = (player.getRotation().y * Math.PI) / 180;
    const spot = { x: loc.x - Math.sin(yaw) * dist, y: loc.y, z: loc.z + Math.cos(yaw) * dist };
    const entity = dim.spawnEntity(type, spot);
    log(`cmd spawn type=${type} at=${round2(spot.x)},${round2(spot.y)},${round2(spot.z)} id=${entity.id}`);
    return;
  }
  if (cmd === "clear" || cmd === "clearmobs") {
    let removed = 0;
    for (const entity of dim.getEntities({ location: loc, maxDistance: 40 })) {
      if (entity.typeId === "minecraft:player") continue;
      entity.remove();
      removed += 1;
    }
    log(`cmd clear removed=${removed}`);
    return;
  }
  if (cmd === "time") {
    const ticks = Number(parts[1] ?? 1000);
    dim.runCommand(`time set ${ticks}`);
    log(`cmd time ticks=${ticks}`);
    return;
  }
  if (cmd === "gm") {
    const mode = (parts[1] ?? "creative").toLowerCase();
    const map = {
      creative: GameMode.Creative,
      survival: GameMode.Survival,
      adventure: GameMode.Adventure,
      spectator: GameMode.Spectator,
    };
    player.setGameMode(map[mode] ?? GameMode.Creative);
    log(`cmd gm mode=${mode}`);
    return;
  }
  if (cmd === "wall") {
    const mat = parts[1] ?? "mcskill:client_block";
    for (let dx = -1; dx <= 1; dx += 1) {
      for (let dy = 0; dy <= 2; dy += 1) {
        dim.setBlockType({ x: Math.floor(loc.x) + dx, y: Math.floor(loc.y) + dy, z: Math.floor(loc.z) - 3 }, mat);
      }
    }
    log(`cmd wall mat=${mat}`);
    return;
  }
  log(`cmd unknown raw=${raw}`);
}

function dispatch(player, raw, channel) {
  try {
    log(`cmd channel=${channel} raw=${raw}`);
    handleCommand(player, raw);
  } catch (error) {
    log(`cmd handler error=${error}`);
  }
}

function registerCustomCommands() {
  const startup = system.beforeEvents?.startup;
  if (!startup || typeof startup.subscribe !== "function") {
    log("command channel=startup-unavailable");
    return false;
  }
  startup.subscribe((event) => {
    const registry = event.customCommandRegistry;
    if (!registry || typeof registry.registerCommand !== "function") {
      log("command channel=registry-unavailable");
      return;
    }
    let registered = 0;
    for (const def of COMMAND_DEFS) {
      try {
        registry.registerCommand(
          {
            name: def.name,
            description: def.description,
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
            mandatoryParameters: def.params,
          },
          (origin, ...args) => {
            const source = origin.sourceEntity;
            log(`cmd invoked name=${def.name} sourceType=${origin.sourceType} entity=${source ? source.typeId : "none"}`);
            const player = source;
            if (!player || player.typeId !== "minecraft:player") {
              return { status: CustomCommandStatus.Failure, message: "player only" };
            }
            const raw = def.name.slice(3) + (args.length > 0 ? " " + args.join(" ") : "");
            system.run(() => dispatch(player, raw, "custom"));
            return { status: CustomCommandStatus.Success };
          }
        );
        registered += 1;
      } catch (error) {
        log(`register ${def.name} error=${error}`);
      }
    }
    commandChannel = `custom(${registered}/${COMMAND_DEFS.length})`;
    log(`command channel=${commandChannel}`);
  });
  return true;
}

function registerChatFallback() {
  const beforeSignal = world.beforeEvents?.chatSend;
  if (beforeSignal && typeof beforeSignal.subscribe === "function") {
    beforeSignal.subscribe((event) => {
      const message = (event.message ?? "").trim();
      if (!message.toLowerCase().startsWith("qa ")) return;
      event.cancel = true;
      const sender = event.sender;
      system.run(() => dispatch(sender, message.slice(3), "chat-before"));
    });
    commandChannel = "chat-before";
    log("command channel=chat-before");
    return true;
  }

  const afterSignal = world.afterEvents?.chatSend;
  if (afterSignal && typeof afterSignal.subscribe === "function") {
    afterSignal.subscribe((event) => {
      const message = (event.message ?? "").trim();
      if (!message.toLowerCase().startsWith("qa ")) return;
      const sender = event.sender;
      system.run(() => dispatch(sender, message.slice(3), "chat-after"));
    });
    commandChannel = "chat-after";
    log("command channel=chat-after");
    return true;
  }

  log("command channel=unavailable");
  return false;
}

if (!safe("registerCustomCommands", registerCustomCommands)) {
  safe("registerChatFallback", registerChatFallback);
}

safe("subscribe.playerSpawn", () => {
  world.afterEvents.playerSpawn.subscribe((event) => {
    if (!event.initialSpawn) return;
    const player = event.player;
    log(`playerSpawn player=${player.name} at=${posOf(player)}`);
    system.runTimeout(() => {
      safe("showcase", () => buildShowcase(player));
    }, 20);
  });
});

safe("subscribe.playerBreakBlock", () => {
  world.afterEvents.playerBreakBlock.subscribe((event) => {
    const loc = event.block.location;
    log(`blockBreak type=${event.brokenBlockPermutation.type.id} at=${loc.x},${loc.y},${loc.z} by=${event.player.name}`);
  });
});

safe("subscribe.playerPlaceBlock", () => {
  world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const loc = event.block.location;
    log(`blockPlace type=${event.block.typeId} at=${loc.x},${loc.y},${loc.z} by=${event.player.name}`);
  });
});

safe("schedule.selftest", () => {
  system.runTimeout(() => {
    for (const raw of ["qa:ping", "qa:look 0 90", "qa:time 1000"]) {
      try {
        const result = world.getDimension("overworld").runCommand(raw);
        log(`selftest command raw=${raw} successCount=${result.successCount}`);
      } catch (error) {
        log(`selftest command raw=${raw} error=${error}`);
      }
    }
  }, 200);
});

safe("start.heartbeat", () => {
  system.runInterval(() => {
    beat += 1;
    for (const player of world.getAllPlayers()) {
      log(`hb t=${beat} pos=${posOf(player)} rot=${rotOf(player)} dim=${player.dimension.id}`);
    }
  }, 40);
});

log("boot subscriptions registered");
