var script = registerScript({
    name: "Animations",
    version: "Final",
    authors: ["CzechHek-Fix"]
});
var ItemRenderer = Java.type("net.minecraft.client.renderer.ItemRenderer");
var Float = Java.type("java.lang.Float");
var prevEquippedProgressField = getField("field_78451_d");
var equippedProgressField = getField("field_78454_c");
var itemToRenderField = getField("field_78453_b");
var rotateArroundXAndYMethod = getMethod("func_178101_a");
var setLightMapFromPlayerMethod = getMethod("func_178109_a");
var rotateWithPlayerRotationsMethod = getMethod("func_178110_a");
var renderItemMapMethod = getMethod("func_178097_a");
var transformFirstPersonItemMethod = getMethod("func_178096_b");
var performDrinkingMethod = getMethod("func_178104_a");
var doBlockTransformationsMethod = getMethod("func_178103_d");
var doBowTransformationsMethod = getMethod("func_178098_a");
var doItemUsedTransformationsMethod = getMethod("func_178105_d");
var renderItemMethod = getMethod("func_178099_a");
var renderPlayerArmMethod = getMethod("func_178095_a");
var ItemCameraTransforms = Java.type("net.minecraft.client.renderer.block.model.ItemCameraTransforms");
var ItemMap = Java.type("net.minecraft.item.ItemMap");
var ItemSword = Java.type("net.minecraft.item.ItemSword");
var EnumAction = Java.type("net.minecraft.item.EnumAction");
var MathHelper = Java.type("net.minecraft.util.MathHelper");
var LiquidBounce = Java.type("net.ccbluex.liquidbounce.LiquidBounce");
var KillAura = Java.type("net.ccbluex.liquidbounce.features.module.modules.combat.KillAura");
var SwingAnimation = Java.type("net.ccbluex.liquidbounce.features.module.modules.render.SwingAnimation");
var MSTimer = Java.type("net.ccbluex.liquidbounce.utils.timer.MSTimer");
var GL11 = Java.type("org.lwjgl.opengl.GL11");
var GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
var RenderHelper = Java.type("net.minecraft.client.renderer.RenderHelper");

function getField(name) {
    var fields = ItemRenderer.class.getDeclaredFields();
    for (var i in fields)
        if (fields[i].getName() == name) {
            fields[i].setAccessible(true);
            return fields[i];
        }
}

function getMethod(name) {
    var methods = ItemRenderer.class.getDeclaredMethods();
    for (var i in methods)
        if (methods[i].getName() == name) {
            methods[i].setAccessible(true);
            return methods[i];
        }
}
var progress;
var timer;
script.registerModule({
    name: "Animations",
    category: "Render",
    description: "Change blocking animation.",
    settings: {
        mode: Setting.list({
            name: "Mode",
            default: "Custom",
            values: ["Nivia", "Remix", "Pushdown", "Custom2", "Custom"]
        }),
        posX: Setting.float({
            name: "PosX",
            default: 0,
            min: -2,
            max: 2
        }),
        posY: Setting.float({
            name: "PosY",
            default: 0.5,
            min: -2,
            max: 2
        }),
        posZ: Setting.float({
            name: "PosZ",
            default: 0.3,
            min: -2,
            max: 2
        }),
        rotX: Setting.float({
            name: "RotX",
            default: 30,
            min: -180,
            max: 180
        }),
        rotY: Setting.float({
            name: "RotY",
            default: -80,
            min: -180,
            max: 180
        }),
        rotZ: Setting.float({
            name: "RotZ",
            default: 60,
            min: -180,
            max: 180
        }),
        deviation: Setting.float({
            name: "Deviation",
            default: 75,
            min: -500,
            max: 500
        }),
        deviateXPos: Setting.boolean({
            name: "DeviateXPos",
            default: false
        }),
        deviateYPos: Setting.boolean({
            name: "DeviateYPos",
            default: false
        }),
        deviateZPos: Setting.boolean({
            name: "DeviateZPos",
            default: false
        }),
        deviateXRot: Setting.boolean({
            name: "DeviateXRot",
            default: false
        }),
        deviateYRot: Setting.boolean({
            name: "DeviateYRot",
            default: true
        }),
        deviateZRot: Setting.boolean({
            name: "DeviateZRot",
            default: false
        }),
        swingDuration: Setting.float({
            name: "SwingDuration",
            default: 500,
            min: 0,
            max: 2000
        }),
        custom2x: Setting.float({
            name: "custom2x",
            default: 1,
            min: -1,
            max: 1
        }),
        custom2y: Setting.float({
            name: "custom2y",
            default: 1,
            min: -1,
            max: 1
        }),
        custom2z: Setting.float({
            name: "custom2z",
            default: 1,
            min: -1,
            max: 1
        }),
    }
}, function(module) {
    module.on("enable", function() {
        timer = new MSTimer();
        mc.entityRenderer.itemRenderer = new(Java.extend(ItemRenderer))(mc) {
            func_78440_a: function(partialTicks) {
                var f = new Float(1.0 - (prevEquippedProgressField.get(mc.entityRenderer.itemRenderer) + (equippedProgressField.get(mc.entityRenderer.itemRenderer) - prevEquippedProgressField.get(mc.entityRenderer.itemRenderer)) * partialTicks));
                var abstractclientplayer = mc.thePlayer;
                var f1 = abstractclientplayer.getSwingProgress(partialTicks);
                partialTicks = new Float(partialTicks);
                var f2 = new Float(abstractclientplayer.prevRotationPitch + (abstractclientplayer.rotationPitch - abstractclientplayer.prevRotationPitch) * partialTicks);
                var f3 = new Float(abstractclientplayer.prevRotationYaw + (abstractclientplayer.rotationYaw - abstractclientplayer.prevRotationYaw) * partialTicks);
                rotateArroundXAndYMethod.invoke(mc.entityRenderer.itemRenderer, f2, f3);
                setLightMapFromPlayerMethod.invoke(mc.entityRenderer.itemRenderer, abstractclientplayer);
                rotateWithPlayerRotationsMethod.invoke(mc.entityRenderer.itemRenderer, abstractclientplayer, partialTicks);
                GlStateManager.enableRescaleNormal();
                GlStateManager.pushMatrix();
                if (itemToRenderField.get(mc.entityRenderer.itemRenderer) != null) {
                    var killAura = LiquidBounce.moduleManager.getModule(KillAura.class);
                    if (itemToRenderField.get(mc.entityRenderer.itemRenderer).getItem() instanceof ItemMap) {
                        renderItemMapMethod.invoke(mc.entityRenderer.itemRenderer, abstractclientplayer, f2, f, f1);
                    } else if (abstractclientplayer.getItemInUseCount() > 0 || (itemToRenderField.get(mc.entityRenderer.itemRenderer).getItem() instanceof ItemSword && killAura.getBlockingStatus())) {
                        var enumaction = killAura.getBlockingStatus() ? EnumAction.BLOCK : itemToRenderField.get(mc.entityRenderer.itemRenderer).getItemUseAction();
                        switch (enumaction) {
                            case EnumAction.NONE:
                                transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, new Float(0));
                                break;
                            case EnumAction.EAT:
                            case EnumAction.DRINK:
                                performDrinkingMethod.invoke(mc.entityRenderer.itemRenderer, abstractclientplayer, partialTicks);
                                transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, f1);
                                break;
                            case EnumAction.BLOCK:
                                switch (module.settings.mode.get()) {
                                    case "Nivia":
                                        GlStateManager.translate(0.56, -0.52, -0.5);
                                        GlStateManager.translate(0.0, f * -0.2  , 0.0);
                                        GlStateManager.rotate(45.0, 0.0, 1.0, 0.0);
                                        var var3 = MathHelper.sin(0);
                                        var var4 = MathHelper.sin(0);
                                        GlStateManager.rotate(var3 * -20.0, 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(var4 * -20.0, 0.0, 0.0, 1.0);
                                        GlStateManager.rotate(var4 * -80.0, 1.0, 0.0, 0.0);
                                        GlStateManager.scale(0.3, 0.3, 0.3);
                                        var var14 = MathHelper.sin(f1 * f1 * 3.1415927);
                                        var var15 = MathHelper.sin(MathHelper.sqrt_float(f1) * 3.1415927);
                                        GlStateManager.rotate(-var15 * 170 / 2.8, -5.0, -5.0, 8.0);
                                        GlStateManager.rotate(-var15 * 77, 2.8, var15 / 2, 0.175);
                                        GlStateManager.translate(-1.1, 0.65, 0.0);
                                        GlStateManager.rotate(30.0, 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(-80.0, 1.0, 0.0, 0.0);
                                        GlStateManager.rotate(60.0, 0.0, 1.0, 0.0);
                                        GL11.glTranslated(1.05, 0.35, 0.5);
                                        GL11.glTranslatef(-1, abstractclientplayer.isSneaking() ? 0 : 0, 0);
                                        break;
                                    case "Remix":
                                        transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, new Float(f1));
                                        GlStateManager.translate(-0.5, 0.2, 0.0);
                                        GlStateManager.rotate(30.0, 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(-80.0, 1.0, 0.0, 0.0);
                                        GlStateManager.rotate(60.0, 0.0, 1.0, 0.0);
                                        break;
                                    case "Custom2":
                                        transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, new Float(f1));
                                        GlStateManager.translate(module.settings.custom2x.get(), module.settings.custom2y.get(), module.settings.custom2z.get());
                                        GlStateManager.rotate(30.0, 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(-80.0, 1.0, 0.0, 0.0);
                                        GlStateManager.rotate(60.0, 0.0, 1.0, 0.0);
                                        break;
                                    case "Pushdown":
                                        GlStateManager.translate(0.56, -0.52, -0.5);
                                        GlStateManager.translate(0.0, f * -0.0  , 0.0);
                                        GlStateManager.rotate(45.5, 0.0, 1.0, 0.0);
                                        var var3 = MathHelper.sin(0);
                                        var var4 = MathHelper.sin(0);
                                        GlStateManager.rotate(var3 * -20.0, 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(var4 * -20.0, 0.0, 0.0, 1.0);
                                        GlStateManager.rotate(var4 * -80.0, 1.0, 0.0, 0.0);
                                        GlStateManager.scale(0.33, 0.33, 0.33);
                                        var var14 = MathHelper.sin(f1 * f1 * 3.1415927);
                                        var var15 = MathHelper.sin(MathHelper.sqrt_float(f1) * 3.1415927);
                                        GlStateManager.rotate(-var15 * 125 / 1.75, 3.95, 0.35, 8.0);
                                        GlStateManager.rotate(-var15 * 35, 0.0, var15 / 100.0, -10.0);
                                        GlStateManager.translate(-1.0, 0.6, -0.0);
                                        GlStateManager.rotate(30.0, 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(-80.0, 1.0, 0.0, 0.0);
                                        GlStateManager.rotate(60.0, 0.0, 1.0, 0.0);
                                        GL11.glTranslated(1.05, 0.35, 0.4);
                                        GL11.glTranslatef(-1, abstractclientplayer.isSneaking() ? 0 : 0, 0);
                                        break;
                                    case "Custom":
                                        transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, new Float(0));
                                        progress = Math.abs(1 - timer.hasTimeLeft(module.settings.swingDuration.get()) / module.settings.swingDuration.get());
                                        var offset = (-Math.pow(progress < 1 ? progress - 0.5 : 0.5, 2) + 0.25) * module.settings.deviation.get();
                                        var offset2 = offset / 100;
                                        GlStateManager.translate(module.settings.posX.get() + (module.settings.deviateXPos.get() ? offset2 : 0), module.settings.posY.get() + (module.settings.deviateYPos.get() ? offset2 : 0), module.settings.posZ.get() + (module.settings.deviateZPos.get() ? -offset2 : 0));
                                        GlStateManager.rotate(module.settings.rotX.get() + (module.settings.deviateXRot.get() ? offset : 0), 0.0, 1.0, 0.0);
                                        GlStateManager.rotate(module.settings.rotY.get() + (module.settings.deviateYRot.get() ? offset : 0), 1.0, 0.0, 0.0);
                                        GlStateManager.rotate(module.settings.rotZ.get() + (module.settings.deviateZRot.get() ? offset : 0), 0.0, 1.0, 0.0);
                                        break;
                                }
                                break;
                            case EnumAction.BOW:
                                transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, f1);
                                doBowTransformationsMethod.invoke(mc.entityRenderer.itemRenderer, partialTicks, abstractclientplayer);
                                break;
                        }
                    } else {
                        if (!LiquidBounce.moduleManager.getModule(SwingAnimation.class).getState())
                            doItemUsedTransformationsMethod.invoke(mc.entityRenderer.itemRenderer, f1);
                        transformFirstPersonItemMethod.invoke(mc.entityRenderer.itemRenderer, f, f1);
                    }
                    renderItemMethod.invoke(mc.entityRenderer.itemRenderer, abstractclientplayer, itemToRenderField.get(mc.entityRenderer.itemRenderer), ItemCameraTransforms.TransformType.FIRST_PERSON);
                } else if (!abstractclientplayer.isInvisible()) {
                    renderPlayerArmMethod.invoke(mc.entityRenderer.itemRenderer, abstractclientplayer, f, f1);
                }
                GlStateManager.popMatrix();
                GlStateManager.disableRescaleNormal();
                RenderHelper.disableStandardItemLighting();
            }
        };
    });
    module.on("update", function(event) {
        if (progress >= 1)
            timer.reset();
    });
    module.on("disable", function() {
        mc.entityRenderer.itemRenderer = new ItemRenderer(mc);
    });
});