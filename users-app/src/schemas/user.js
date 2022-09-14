
export const user = {
    _id: {
        name: "Db",
        sortable: true,
        exclude: true,
        excludeSort: true,
        excludeTable: true,
        excludeCreateEdit: true,
        ToString: (v) => v["$oid"]
    },
    name: {
        name: "Name",
        sortable: true
    },
    location: {
        name: "Location",
        sortable: true
    },
    title: {
        name: "Title",
        sortable: true
    },
};
