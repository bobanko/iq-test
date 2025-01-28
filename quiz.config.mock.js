// figure config mock

const _current = {
  figureParts: [
    {
      figures: [
        shuffleTypes.unique123({ items: ["battery", "drop", "signal"] }),
      ],
      color: shuffleTypes.unique123({ items: [...rgbColors] }),
      // todo(vmyshko): or ignore for defaults
      rotation: shuffleTypes.unique123({ items: [0, 90, 180] }),
      // todo(vmyshko): impl or not?
      // scale: shuffleTypes.single({ items: [0.7] }),
    },
  ],
};

const _new_mock_for_renderer = {
  figureParts: [
    //atomic
    {
      figure: "cirlce",
      color: "red", // optional
      rotation: 180, // optional
    },
    //many figures can have same props, so
    {
      figures: ["a", "b", "c"],
      color: "red",
      rotation: 90,
    },
    // randomness/rules
    {
      // figure can be random, according to some rule
      figure: [shuffleTypes.unique123, ["a", "b", "c"]],
      // color as well
      color: [shuffleTypes.randomInCol, ["red", "green", "blue"]],
      // other props too...
      rotation: [shuffleTypes.single, [90]],
      //should have simplified shorthand
      rotation: 90,
    },
    // any prop value is just a value numeric|string
    // generators should have ability to sync between each other
    // to do so we can add seed or hashid
    {
      figure: "circle",
      color: [shuffleTypes.randomInCol, ["red", "green", "blue"], "hash-1"],
    },
    {
      figure: "square",
      color: [shuffleTypes.randomInCol, ["red", "green", "blue"], "hash-1"],
    },
  ],
};

const _new_mock_from_config = {
  figureParts: [
    // 1-or-many
    {
      //variants to configure randomness
      //current
      figures: [
        shuffleTypes.unique123({ items: ["battery", "drop", "signal"] }),
      ],
      // new ones
      svgFigureIds: [shuffleTypes.single, ["a"]],
      svgFigureIds: [shuffleTypes.unique123, ["a", "b", "c"]], //tuples

      color: "red",
      rotation: 90,
      scale: 0.5,
    },
  ],
};
