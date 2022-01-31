function createStorage(key) {
    let storage = JSON.parse(localStorage.getItem(key)) || [];
    return {
        get() {
            return storage || [];
        },
        update(data) {
            localStorage.setItem(key, JSON.stringify(data));
        },
    };
}
export default createStorage;
