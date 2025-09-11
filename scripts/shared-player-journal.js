class SharedPlayerJournal {
	static updateOwnership(journalEntry, html, data){
		// Get the folder name from settings
		const folderName = game.settings.get("shared-player-journal", "folderName");

		// Check if the journal entry is in a folder and if that folder matches our setting
        if (journalEntry.folder?.name === folderName) {
            SharedPlayerJournal.setDefaultPermissionToOwner(journalEntry);
        }

	};
	
	static setDefaultPermissionToOwner(doc){
		doc.update({
			permission: {
				default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
			}
		});
	}	
}

let socket; 
Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerModule("shared-player-journal");
	socket.register("setDefaultPermissionToOwner", SharedPlayerJournal.setDefaultPermissionToOwner);
});
Hooks.once('init', () => {
    game.settings.register("shared-player-journal", "folderName", {
        name: 'Shared folder name',
        hint: 'Name of the folder that will be automatically assign owner permission to all players to all entries',
        scope: 'world',
        config: true,
        type: String,
        default: "Shared"
    });
});

Hooks.on("createJournalEntry", SharedPlayerJournal.updateOwnership);