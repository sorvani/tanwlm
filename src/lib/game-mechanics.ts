import { Skill } from "./types";

export const GROWTH_CURVES = {
    STANDARD: "standard", // The +5, +5, +10... pattern
    FLAT: "flat",         // Cost is always Base Cost * Level
} as const;

export type GrowthType = typeof GROWTH_CURVES[keyof typeof GROWTH_CURVES];

/**
 * Calculates the total point cost for a skill at a specific level.
 * 
 * @param skill The base skill object containing base cost and growth type.
 * @param targetLevel The level to calculate the cost for.
 * @returns The total accumulated cost.
 */
export function calculateSkillCost(skill: Skill, targetLevel: number): number {
    // If skill doesn't have levels, it acts like Level 1 (Base Cost).
    if (!skill.has_levels || targetLevel <= 1) return skill.cost;

    let total = skill.cost; // Start with Base Cost (Level 1)

    const growthType = skill.growth_type || GROWTH_CURVES.STANDARD;

    if (growthType === GROWTH_CURVES.FLAT) {
        // Simple linear multiplication (rare, but possible for some types)
        return skill.cost * targetLevel;
    }

    // Default: STANDARD Land Mines Curve
    // Level 2-3: +5 per level
    // Level 4-5: +10 per level
    // Level 6-7: +15 per level
    // Level 8-9: +20 per level
    // Level 10+: +25 per level (Assumed cap or continuation)

    for (let l = 2; l <= targetLevel; l++) {
        if (l <= 3) total += 5;
        else if (l <= 5) total += 10;
        else if (l <= 7) total += 15;
        else if (l <= 9) total += 20;
        else if (l === 10) total += 25;
        else total += 25; // Continued scaling for 11+
    }

    return total;
}
