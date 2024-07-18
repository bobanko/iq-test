export const animations = {
  disabled: [
    [{}, { backgroundColor: "var(--gray)", fontSize: "0.9em" }, {}],
    {
      duration: 200,
      iterations: 1,
    },
  ],
  wrong: [
    [{}, { backgroundColor: "var(--red)", fontSize: "0.9em" }, {}],
    {
      duration: 200,
      iterations: 2,
    },
  ],
  proper: [
    [{}, { backgroundColor: "var(--green)", fontSize: "0.9em" }, {}],
    {
      duration: 300,
      iterations: 1,
    },
  ],
};
