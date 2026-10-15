/* Transitional host for the remaining stateful subsystem dependencies.
   Runs in a dedicated worker, never boots the legacy UI, and cannot persist.
   Delete this compatibility host only after all subsystem hooks are pure. */
const inertNode = () => ({
  innerHTML: "",
  textContent: "",
  hidden: false,
  open: false,
  style: { setProperty() {} },
  dataset: {},
  classList: { add() {}, remove() {}, toggle() {} },
  showModal() {
    this.open = true;
  },
  close() {
    this.open = false;
  },
  appendChild() {},
  setAttribute() {},
  before() {},
  remove() {},
  querySelectorAll() {
    return [];
  },
  querySelector() {
    return null;
  },
});
const nodes = new Map();
const document = {
  documentElement: inertNode(),
  body: inertNode(),
  visibilityState: "visible",
  getElementById(id) {
    if (!nodes.has(id)) nodes.set(id, inertNode());
    return nodes.get(id);
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  createElement: inertNode,
  addEventListener() {},
};
const window = { addEventListener() {}, scrollTo() {} };
const localStorage = {
  getItem() {
    return null;
  },
  setItem() {
    throw Error("Worker persistence is disabled");
  },
};
const setTimeout = () => 0,
  clearTimeout = () => {},
  setInterval = () => 0,
  clearInterval = () => {};
const fetch = () => {
  throw Error("Worker network access is disabled");
};
