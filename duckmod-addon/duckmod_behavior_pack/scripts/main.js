import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.itemComponentRegistry.registerCustomComponent("duckmod:egg_variant", {
    onUse(use) {
      const player = use.source;
      const item = use.itemStack;

      system.run(() => {
        const projectiles = player.dimension.getEntities({
          type: "duckmod:duck_egg",
          location: player.location,
          maxDistance: 3,
        });

        if (projectiles.length > 0) {
          const eggEntity = projectiles[0];

          if (item.typeId === "duckmod:green_egg") {
            eggEntity.setProperty("minecraft:climate_variant", "warm");
          } else if (item.typeId === "duckmod:cream_egg") {
            eggEntity.setProperty("minecraft:climate_variant", "cold");
          } else {
            eggEntity.setProperty("minecraft:climate_variant", "temperate");
          }
        }
      });
    },
  });

  initEvent.itemComponentRegistry.registerCustomComponent("duckmod:food_effects", {
    onConsume({ source }) {
      if (Math.random() < 0.3) {
        source.addEffect("hunger", 600, { amplifier: 0 });
      }
    },
  });
});
