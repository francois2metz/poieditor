export const state = () => ({
  elements: []
})

export const mutations = {
  saveElement(state, element) {
    state.elements.push(element);
  },

  clearElements(state) {
    state.elements.splice(0, state.elements.length);
  }
}
