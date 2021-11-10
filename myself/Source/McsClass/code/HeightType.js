import { default as HeightReference } from '../../Scene/HeightReference.js';
/**
 * @NONE  绝对高度
 * @ON_GROUND 在地形上
 * @ABOVE_GROUND 在地形高度的上方
 */
export default {
    NONE: HeightReference.NONE,
    ON_GROUND: HeightReference.CLAMP_TO_GROUND,
    ABOVE_GROUND: HeightReference.RELATIVE_TO_GROUND
};
