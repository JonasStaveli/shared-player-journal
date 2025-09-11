class SharedPlayerJournal {
	static updateJournalEntryOwnership(journalEntry, html, data){
		// Get the folder name from settings
		const folderName = game.settings.get("shared-player-journal", "folderName");

		// Check if the journal entry is in the target folder or any of its subfolders
        if (SharedPlayerJournal.isInTargetFolder(journalEntry.folder, folderName)) {
            SharedPlayerJournal.setDefaultPermissionToOwner(journalEntry);
        }

	};

	static updatePageOwnership(page, html, data) {
        // Get the parent journal's folder
        const parentJournal = page.parent;
        if (!parentJournal) return;

        // Get the folder name from settings
        const folderName = game.settings.get("shared-player-journal", "folderName");

        // Check if the parent journal is in the target folder or any of its subfolders
        if (SharedPlayerJournal.isInTargetFolder(parentJournal.folder, folderName)) {
            SharedPlayerJournal.setDefaultPermissionToOwner(page);
        }
    }
	
	static isInTargetFolder(folder, targetFolderName) {
        if (!folder) return false;
        
        // Check if current folder matches
        if (folder.name === targetFolderName) return true;
        
        // Recursively check parent folders
        return SharedPlayerJournal.isInTargetFolder(folder.folder, targetFolderName);
    }

	static async setDefaultPermissionToOwner(doc) {
    try {
        await doc.update({
            permission: {
                default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER,
            }
        });
    } catch (error) {
        console.error("Shared Player Journal | Error setting permissions:", error);
        ui.notifications.error("Failed to set journal permissions");
    }
}	
}

let socket; 
Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerModule("shared-player-journal");
	socket.register("setDefaultPermissionToOwner", SharedPlayerJournal.setDefaultPermissionToOwner);
});
Hooks.once('init', () => {
    game.settings.register("shared-player-journal", "folderName", {
        name: game.i18n.localize("shared-player-journal.settings.folderName.name"),
        hint: game.i18n.localize("shared-player-journal.settings.folderName.hint"),
        scope: 'world',
        config: true,
        type: String,
        default: "Shared"
    });
});

Hooks.on("createJournalEntry", SharedPlayerJournal.updateJournalEntryOwnership);
Hooks.on("createJournalEntryPage", SharedPlayerJournal.updatePageOwnership);