class SharedPlayerJournal {
	static updateOwnership(obj, html, data){
		//check if agrs are correct
        //check if "CreateJournalEntry" is correct for hook
	};
	
	static setDefaultPermissionToOwner(doc){
		doc.update({
			permission: {
				default: CONST.ENTITY_PERMISSIONS.OWNER,
			}
		});
	}
}

Hooks.once("socketlib.ready", () => {
	socket = socketlib.registerModule("shared-player-journal");
	socket.register("setDefaultPermissionToOwner", SharedPlayerJournal.setDefaultPermissionToOwner);
});
Hooks.once('init', () => {
    game.settings.registerMenu("shared-player-journal", "folderName", {
        name: 'Shared folder name',
        hint: 'Name of the folder that will be automatically assign owner permission to all players to all entries',
        scope: 'world',
        type: String,
    });
});

Hooks.on("CreateJournalEntry",SharedPlayerJournal.updateOwnership);