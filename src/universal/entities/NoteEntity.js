import { CreateNoteEntityEvent, UpdateNoteEntityEvent } from "./NoteEntityEvents";
import typeOf from "type-of-data";

export class NoteEntity {
    static entityName() {
        return "Note";
    };

    constructor(id, title, content, lastModified, isImportant) {
        typeOf([
            { id, is: String },
            { title, is: String },
            { content, is: String },
            { lastModified, is: Number },
            { isImportant, is: Boolean }
        ]);
        this.id = id;
        this.title = title;
        this.content = content;
        this.lastModified = lastModified;
        this.isImportant = isImportant;
        Object.seal(this);
    }

    static createFromEntityEvents(entityEvents) {

        const compareTimestamps = (a, b) => {
            if (a.timestamp < b.timestamp)
                return -1;
            if (a.timestamp > b.timestamp)
                return 1;
            return 0;
        };

        const createNoteFromObject = (obj) => {
            if (obj.content == null) {
                obj.content = "";
            }
            if (obj.isImportant == null) {
                obj.isImportant = false;
            }

            if (!(typeof obj.id === "string")) {
                throw new Error("id must be a string")
            }

            if (!(typeof obj.title === "string")) {
                throw new Error("title must be a string in " + JSON.stringify(obj))
            }

            if (!(typeof obj.content === "string")) {
                throw new Error("content must be a string in " + JSON.stringify(obj))
            }

            if (!(typeof obj.lastModified === "number")) {
                throw new Error("lastModified must be a number")
            }

            if (!(typeof obj.isImportant === "boolean")) {
                throw new Error("isImportant must be a boolean")
            }

            return new NoteEntity(obj.id, obj.title, obj.content, obj.lastModified, obj.isImportant);
        };

        const sortedNoteEntityEvents =
            (entityEvents.slice(0))
                .filter(_ => _ instanceof CreateNoteEntityEvent || _ instanceof UpdateNoteEntityEvent)
                .sort(compareTimestamps);

        console.debug(`Handling ${JSON.stringify(sortedNoteEntityEvents, null, 4)}...`);

        const noteEntities = [];

        sortedNoteEntityEvents.forEach((entityEvent) => {
            console.debug(`Handling ${JSON.stringify(entityEvent, null, 4)}...`);

            if (entityEvent instanceof CreateNoteEntityEvent) {
                console.debug(`Using ${JSON.stringify(entityEvent, null, 4)} to create Note entity...`);
                if (noteEntities.find(_ => _.id === entityEvent.entityId)) {
                    console.error(`Found more than one 'create' event for note ${entityEvent.entityId} in event list, unexpected event is ${JSON.stringify(entityEvent, null, 4)}`);
                } else {
                    const noteEntity = createNoteFromObject({
                        id: entityEvent.entityId,
                        title: entityEvent.payload.title,
                        content: entityEvent.payload.content,
                        isImportant: entityEvent.isImportant,
                        lastModified: entityEvent.timestamp
                    });
                    console.debug(`Creating new note ${JSON.stringify(noteEntity)} from event ${JSON.stringify(entityEvent, null, 4)}`);
                    noteEntities.push(noteEntity);
                }
            } else if (entityEvent instanceof UpdateNoteEntityEvent) {
                console.debug(`Using ${JSON.stringify(entityEvent, null, 4)} to update Note entity...`);
                const noteEntity = noteEntities.find(_ => _.id === entityEvent.entityId);
                if (noteEntity == null) {
                    throw `Got an 'update' event for a note that is not yet created, unexpected event is ${JSON.stringify(entityEvent, null, 4)}`;
                } else {
                    console.debug(`Updating note ${JSON.stringify(noteEntity, null, 4)} from event ${JSON.stringify(entityEvent, null, 4)}`);
                    noteEntity.lastModified = entityEvent.timestamp;
                    noteEntity.title = entityEvent.payload.title;
                    noteEntity.content = entityEvent.payload.content;
                    console.debug(`Updated note ${JSON.stringify(noteEntity, null, 4)} from event ${JSON.stringify(entityEvent, null, 4)}`);
                }
            } else {
                console.debug(`Cannot handle ${JSON.stringify(entityEvent, null, 4)} because it is an instance of ${entityEvent.constructor.name}`);
            }
        });

        return noteEntities;
    };
}
