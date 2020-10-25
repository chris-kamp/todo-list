function Todo ({title, description, dueDate, category, project}) {
    
    title = title || "Untitled";
    description = description || "";
    dueDate = dueDate || false;
    category = category || false;
    project = project || "Other"; //Replace with a generic "Other" project

    function getTitle() {
        return title;
    }
    function setTitle(arg) {
        title = arg;
    }
    function getDescription() {
        return description;
    }
    function setDescription(arg) {
        description = arg;
    }
    function getDueDate() {
        return dueDate;
    }
    function setDueDate(arg) {
        dueDate = arg;
    }
    function getCategory() {
        return category;
    }
    function setCategory(arg) {
        category = arg;
    }
    function getProject() {
        return project;
    }
    function setProject(arg) {
        project = arg;
    }


    return {getTitle, setTitle, getDescription, setDescription, getDueDate, setDueDate, getCategory, setCategory, getProject, setProject};
}