import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe((initEvent) => {
  initEvent.itemComponentRegistry.registerCustomComponent("duckmod:food_effects", {
    onConsume({ source }) {
      if (Math.random() < 0.3) {
        source.addEffect("hunger", 600, { amplifier: 0 });
      }
    },
  });
});
