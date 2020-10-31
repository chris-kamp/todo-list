function Project(msg, {title, category, todos}) {
    title = title || "Untitled";
    category = category || "";
    todos = todos || [];

    function getTitle() {
        return title;
    }
    function setTitle(arg) {
        title = arg;
    }
    function getCategory() {
        return category;
    }
    function setCategory(arg) {
        category = arg;
    }
    function getTodos() {
        return todos;
    }
    function addTodo(todo) {
        todos.push(todo);
        return todos;
    }
    console.log("Made a Project");
    return {getTitle, setTitle, getCategory, setCategory, getTodos, addTodo};
}

export default Project;