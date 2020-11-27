import $ from "jquery";
import EventHub from "/src/eventHub.js";
import ProjectManager from "/src/project.js";
import TodoManager from "/src/todo.js";

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        const x = "STORAGE_TEST";
        localStorage.setItem(x, x);
        localStorage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            e.code === 22 ||
            e.code === 1014 ||
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            (storage && storage.length !== 0);
    }
}

function storeProjects(msg, projects) {
    if(storageAvailable("localStorage")) {
        const projectsArray = [];
        projects.forEach(project => {
            const title = project.getTitle();
            const selected = project.isSelected();
            const jsonProject = {
                title: title,
                selected: selected
            };
            projectsArray.push(jsonProject);
        });
        const jsonArray = JSON.stringify(projectsArray);
        localStorage.setItem("projects", jsonArray);
        console.log(JSON.parse(localStorage.getItem("projects")));
    }
}

function retrieveProjects(msg, data) {
    if(storageAvailable("localStorage") && localStorage.getItem("projects") !== null) {
        const jsonArray = localStorage.getItem("projects");
        const projectsArray = JSON.parse(jsonArray);
        projectsArray.forEach(project => {
            PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, project);
        });
    } else {
        PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, {
            title: "Uncategorised",
            selected: true
        });
    }
}

function storeTodos(msg, todos) {
    if(storageAvailable("localStorage")) {

    }
}

function retrieveTodos(msg, data) {
    if(storageAvailable("localStorage")) {

    }
}



export {storeProjects, retrieveProjects, storeTodos, retrieveTodos};