const show = ref(false);
const component = ref();

export function useModal() {
  return {
    show,
    component,
    toggleModal: () => (show.value = !show.value),
  };
}
