export const state = () => ({
  elements: []
})

export const mutations = {
  saveElement(state, newElement) {
    const previousIndex = state.elements.findIndex((element) => {
      return element._type === newElement._type && element._id === newElement._id;
    });
    if (previousIndex !== -1) {
      state.elements.splice(previousIndex, 1);
    }
    state.elements.push(newElement);
  },

  clearElements(state) {
    state.elements.splice(0, state.elements.length);
  }
}
