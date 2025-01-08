import { computed, readonly, ref } from "vue";

const list = ref([]);
const items = readonly(list);
const editedItemIndex = ref();

function add(title) {
    list.value.push(title);
}

function remove(index) {
    list.value.splice(index, 1);
}

function beginEdit(index) {
    editedItemIndex.value = index;
}

function confirmEdit(title) {
    if (editedItemIndex.value === undefined) {
        return console.error('No item is being edited');
    }
    list.value[editedItemIndex.value] = title;
    editedItemIndex.value = undefined;
}

function cancelEdit() {
    editedItemIndex.value = undefined;
}

const isEditing = computed(() => editedItemIndex.value !== undefined);

const editedTitle = computed(() => list.value[editedItemIndex.value]);

export function useTodoList() {
    return {
        items,
        add,
        remove,
        beginEdit,
        cancelEdit,
        confirmEdit,
        isEditing,
        editedTitle
    }
}