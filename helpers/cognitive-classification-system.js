// prettier-ignore
const iqGroups = [
    { range: { min: 0, max: 54 }, name: "Vegetative Cognitive State", sd: "μ-6.670σ to μ-3.070σ", percentile: "< 10⁻⁷", frequency: "1:28M" },
    { range: { min: 55, max: 69 }, name: "Severe Cognitive Deficit", sd: "μ-3σ to μ-2.070σ", percentile: "0.1ᵗʰ-2ᵗʰ", frequency: "1:50" },
    { range: { min: 70, max: 84 }, name: "Borderline Functioning", sd: "μ-2σ to μ-1.070σ", percentile: "2ᵗʰ-16ᵗʰ", frequency: "1:6" },
    { range: { min: 85, max: 114 }, name: "Normative Functioning", sd: "μ-1σ to μ+1σ", percentile: "16ᵗʰ-84ᵗʰ", frequency: "1:1.5" },
    { range: { min: 115, max: 129 }, name: "Superior Intel.", sd: "μ+1σ to μ+1.938σ", percentile: "84ᵗʰ-97.7ᵗʰ", frequency: "1:6" },
    { range: { min: 130, max: 159 }, name: "Exceptionally Gifted", sd: "μ+2σ to μ+3.938σ", percentile: "97.7ᵗʰ-99.9997ᵗʰ", frequency: "1:1,000" },
    { range: { min: 160, max: 179 }, name: "Profoundly Gifted", sd: "μ+4σ to μ+5.27σ", percentile: "99.9997ᵗʰ-99.999999ᵗʰ", frequency: "1:1M" },
    { range: { min: 180, max: 199 }, name: "Transcendent Intellect", sd: "μ+5.33σ to μ+6.6σ", percentile: "> 99.999999ᵗʰ", frequency: "1:10B" },
    { range: { min: 200, max: 245 }, name: "Hypercognitive Capacity", sd: "μ+6.67σ to μ+7.938σ", percentile: "> 99.9999999ᵗʰ", frequency: "1:100B" },
    { range: { min: 246, max: 265 }, name: "Trans-superl Cognitive", sd: "μ+9σ to μ+10σ", percentile: "> 99.9999999999ᵗʰ", frequency: "1:10T" },
    { range: { min: 266, max: 290 }, name: "Omnilegent Capacity", sd: "μ+10.33σ to μ+12.67σ", percentile: "> 99.99999999999999ᵗʰ", frequency: "1:100T" }
  ];

// prettier-ignore
const iqSubgroups = [
    { range: { min: 0, max: 19 },    name: "Total Cognitive Impact", sd: "μ-6.670σ to μ-5.330σ", percentile: "< 10⁻⁷", frequency: "1:1B" },
    { range: { min: 20, max: 34 },   name: "Total Support Needs", sd: "μ-5.330σ to μ-4.4σ", percentile: "10⁻⁹ - 10⁻⁷", frequency: "1:100M" },
    { range: { min: 35, max: 54 },   name: "Extensive Support Needs", sd: "μ-4.4σ to μ-3.070σ", percentile: "10⁻⁷ - 10⁻⁵", frequency: "1:10M" },
    { range: { min: 55, max: 61 },   name: "Concrete Operational Stage", sd: "μ-3σ to μ-2.6σ", percentile: "0.3ᵗʰ-1ᵗʰ", frequency: "1:200" },
    { range: { min: 62, max: 69 },   name: "Symbolic Reasoning Deficit", sd: "μ-2.53σ to μ-2.070σ", percentile: "1ᵗʰ-2ᵗʰ", frequency: "1:100" },
    { range: { min: 70, max: 77 },   name: "Low Average", sd: "μ-2σ to μ-1.53G", percentile: "2ᵗʰ-6ᵗʰ", frequency: "1:20" },
    { range: { min: 78, max: 84 },   name: "Transitional Abstract Reasoning", sd: "μ-1.47σ to μ-1.070σ", percentile: "6ᵗʰ-16ᵗʰ", frequency: "1:10" },
    { range: { min: 85, max: 92 },   name: "Low Average", sd: "μ-1σ to μ-0.53G", percentile: "16ᵗʰ-30ᵗʰ", frequency: "1:4" },
    { range: { min: 93, max: 107 },  name: "Core Average", sd: "μ-0.47σ to μ+0.47σ", percentile: "30ᵗʰ-70ᵗʰ", frequency: "1:2.5" },
    { range: { min: 108, max: 114 }, name: "High Average", sd: "μ+0.53σ to μ+1σ", percentile: "70ᵗʰ-84ᵗʰ", frequency: "1:4" },
    { range: { min: 115, max: 122 }, name: "Advanced Reasoning", sd: "μ+1σ to μ+1.47σ", percentile: "84ᵗʰ-93ᵗʰ", frequency: "1:10" },
    { range: { min: 123, max: 129 }, name: "Very Superior", sd: "μ+1.53σ to μ+1.938σ", percentile: "93ᵗʰ-97.7ᵗʰ", frequency: "1:20" },
    { range: { min: 130, max: 144 }, name: "Moderately Gifted", sd: "μ+2σ to μ+2.938σ", percentile: "97.7ᵗʰ-99.9ᵗʰ", frequency: "1:400" },
    { range: { min: 145, max: 159 }, name: "Highly Gifted", sd: "μ+3σ to μ+3.938σ", percentile: "99.9ᵗʰ-99.9997ᵗʰ", frequency: "1:30,000" },
    { range: { min: 160, max: 169 }, name: "Extraordinary Capacity", sd: "μ+4σ to μ+4.6σ", percentile: "99.9997ᵗʰ-99.9999ᵗʰ", frequency: "1:150K" },
    { range: { min: 170, max: 179 }, name: "Supragenius", sd: "μ+4.67σ to μ+5.27σ", percentile: "99.9999ᵗʰ-99.999999ᵗʰ", frequency: "1:1M" },
    { range: { min: 180, max: 189 }, name: "Class I Exceptional", sd: "μ+5.33σ to μ+5.938σ", percentile: "> 99.999999ᵗʰ", frequency: "1:1B" },
    { range: { min: 190, max: 199 }, name: "Class II Exceptional", sd: "μ+6σ to μ+6.6σ", percentile: "> 99.999999ᵗʰ", frequency: "1:10B" },
    { range: { min: 200, max: 219 }, name: "Meta-Intellectual", sd: "μ+6.67σ to μ+7.938σ", percentile: "> 99.99999999ᵗʰ", frequency: "1:100B" },
    { range: { min: 220, max: 245 }, name: "Transfinite Reasoning", sd: "μ+8σ", percentile: "> 99.999999999ᵗʰ", frequency: "1:1T" },
    { range: { min: 246, max: 255 }, name: "Panoptic Intellect", sd: "μ+9σ to μ+9.67σ", percentile: "> 99.99999999999ᵗʰ", frequency: "1:1T" },
    { range: { min: 256, max: 265 }, name: "Omniscopic Capacity", sd: "μ+9.73σ to μ+10σ", percentile: "> 99.999999999999ᵗʰ", frequency: "1:10T" },
    { range: { min: 266, max: 275 }, name: "Metacognitive Singularity", sd: "μ+10.33σ", percentile: "> 99.999999999999999ᵗʰ", frequency: "1:100T" },
    { range: { min: 276, max: 290 }, name: "Post-Singularity Cognition", sd: "μ+11.67σ", percentile: "> 99.9999999999999999ᵗʰ", frequency: "1:100T" }
  ];

export function findCognitiveGroup(iq) {
  const group = iqGroups.find(
    (item) => iq >= item.range.min && iq <= item.range.max
  );

  return group;
}

export function findCognitiveSubgroup(iq) {
  const subgroup = iqSubgroups.find(
    (item) => iq >= item.range.min && iq <= item.range.max
  );

  return subgroup;
}
