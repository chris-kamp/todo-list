import $ from "jquery";
import EventHub from "/src/eventHub.js";

function displaySidebar() {
    const sidebar = $("#sidebar");

    const projectsHeading = $(`<p id="projectsHeading">PROJECTS</p>`);
    projectsHeading.appendTo(sidebar);

    const projectContainer = $(`<div id="projectContainer"></div>`);
    projectContainer.appendTo(sidebar);

    const projectTitleInput = $(`<input id="projectTitleInput" placeholder="New project" maxlength="30">`);
    projectTitleInput.appendTo(sidebar);

    const addProject = $(`<button id="addProject" class="small">+</button>`);
    addProject.appendTo(sidebar);

    const errorContainer = $(`<div></div>`);
    errorContainer.appendTo(sidebar);
    errorContainer.hide();

    const errorText = $(`<span class="projectErrorText">Error</span>`);
    errorText.appendTo(errorContainer);

    //Display error text when project creation fails
    function displayProjectCreationError(msg, data) {
        errorText.text(data);
        errorContainer.show();
    }
    EventHub.tokens.displayTodoCreationError = PubSub.subscribe(EventHub.topics.PROJECT_CREATION_ERROR, displayProjectCreationError);

    //Get the properties of a project to be created from inputs on the page
    const getProjectProperties = () => {
        return {
            title: projectTitleInput.val()
        }
    };

    addProject.on("click", () => {
        errorContainer.hide();
        PubSub.publish(EventHub.topics.PROJECT_CREATION_REQUESTED, getProjectProperties());
        projectTitleInput.val("");
    });
}

export default displaySidebar;