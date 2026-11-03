import { world, system } from "@minecraft/server";

const TAG = "[QA]";
const POS = { x: 0, y: 100, z: 0 };
const CMD_POS = { x: 0, y: 101, z: 0 };
const CUSTOM_POS = { x: 0, y: 102, z: 0 };
let fired = false;

function log(message) {
  console.log(`${TAG} ${message}`);
}

function tick(ticks) {
  return new Promise((resolve) => system.runTimeout(resolve, ticks));
}

world.afterEvents.worldLoad.subscribe(async () => {
  if (fired) return;
  fired = true;
  log("worldLoad fired");

  try {
    const dim = world.getDimension("overworld");

    try {
      const area = dim.runCommand("tickingarea add 0 100 0 0 100 0 qa_area");
      log(`tickingarea successCount=${area.successCount}`);
    } catch (error) {
      log(`tickingarea error=${error}`);
    }

    await tick(40);

    try {
      dim.setBlockType(POS, "minecraft:stone");
      const block = dim.getBlock(POS);
      log(`block_readback=${block ? block.typeId : "undefined"}`);
      if (block && block.typeId === "minecraft:stone") {
        log("PASS block roundtrip");
      } else {
        log("FAIL block roundtrip readback mismatch");
      }
    } catch (error) {
      log(`FAIL block roundtrip exception=${error}`);
    }

    try {
      const set = dim.runCommand("setblock 0 101 0 minecraft:stone");
      const test = dim.runCommand("testforblock 0 101 0 minecraft:stone");
      log(`cmd_setblock=${set.successCount} cmd_testforblock=${test.successCount}`);
      if (test.successCount >= 1) {
        log("PASS command block check");
      } else {
        log("FAIL command block check");
      }
      dim.runCommand("setblock 0 101 0 minecraft:air");
    } catch (error) {
      log(`FAIL command block check exception=${error}`);
    }

    try {
      dim.setBlockType(CUSTOM_POS, "mcskill:qa_block");
      const block = dim.getBlock(CUSTOM_POS);
      log(`custom_block_readback=${block ? block.typeId : "undefined"}`);
      if (block && block.typeId === "mcskill:qa_block") {
        log("PASS custom block roundtrip");
      } else {
        log("FAIL custom block roundtrip readback mismatch");
      }
      const test = dim.runCommand("testforblock 0 102 0 mcskill:qa_block");
      log(`cmd_testforblock_custom=${test.successCount}`);
      if (test.successCount >= 1) {
        log("PASS custom block command check");
      } else {
        log("FAIL custom block command check");
      }
    } catch (error) {
      log(`FAIL custom block exception=${error}`);
    }

    try {
      world.setDynamicProperty("mcskill:qa", "v1");
      const value = world.getDynamicProperty("mcskill:qa");
      log(`dynamic_property=${value}`);
      if (value === "v1") {
        log("PASS dynamic property");
      } else {
        log("FAIL dynamic property");
      }
    } catch (error) {
      log(`FAIL dynamic property exception=${error}`);
    }

    try {
      dim.setBlockType(POS, "minecraft:air");
      dim.setBlockType(CUSTOM_POS, "minecraft:air");
      dim.runCommand("tickingarea remove qa_area");
    } catch (error) {
      log(`cleanup error=${error}`);
    }

    log("DONE");
  } catch (error) {
    log(`FAIL exception=${error}`);
  }
});
