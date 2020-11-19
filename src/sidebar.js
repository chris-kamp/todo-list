import $ from "jquery";
import EventHub from "/src/eventHub.js";

function displaySidebar() {
    const sidebar = $("#sidebar");

    const projectsHeading = $(`<p id="projectsHeading">PROJECTS</p>`);
    projectsHeading.appendTo(sidebar);

    const projectContainer = $(`<div id="projectContainer"></div>`);
    projectContainer.appendTo(sidebar);

    const projectTitleInput = $(`<input id="projectTitleInput" placeholder="New project">`);
    projectTitleInput.appendTo(sidebar);

    const addProject = $(`<button id="addProject">+</button>`);
    addProject.appendTo(sidebar);

    //Get the properties of a project to be created from inputs on the page
    const getProjectProperties = () => {
        return {
            title: projectTitleInput.val()
        }
    };

    addProject.on("click", () => {
        PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, getProjectProperties());
        projectTitleInput.val("");
    });
}

export default displaySidebar;