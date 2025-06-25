const state = {
  cart: [],
  products: [],
  currentPage: "home",
  user: null,
};

const listeners = [];

export function getState() {
  return { ...state };
}

export function setState(partial) {
  Object.assign(state, partial);
  listeners.forEach((cb) => cb(getState()));
}

export function subscribe(cb) {
  listeners.push(cb);
  // Return unsubscribe function
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx > -1) listeners.splice(idx, 1);
  };
}