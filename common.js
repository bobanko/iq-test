// todo(vmyshko): make it reusable, and more hashy
export const getUid = (() => {
  let _id = 0;

  return () => `${_id++}`;
})();
