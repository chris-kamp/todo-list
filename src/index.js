import PubSub from "pubsub-js";
import EventHub from "/src/eventHub.js";
import DisplayController from "/src/displayController.js"
import ProjectManager from "./project";

//For development purposes
PubSub.immediateExceptions = true;

DisplayController.initialise();
ProjectManager.initialise();

