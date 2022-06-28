/* global browser */

//const temporary = browser.runtime.id.endsWith('@temporary-addon'); // debugging?
const manifest = browser.runtime.getManifest();
const extname = manifest.name;

async function removeChildren(bookmarkId){
	const children = await browser.bookmarks.getChildren(bookmarkId);
	for(const child of children) {
		if(child.url){
			browser.bookmarks.remove(child.id);
		}
		else if(child.children) {
			browser.removeTree(child.id);
		}
	}
}

browser.menus.create({
	id: extname,
	title: "Remove Children",
	contexts: ["bookmark"],
	visible: false,
	onclick: function(info/*, tab*/) {
		if(info.bookmarkId){
			removeChildren(info.bookmarkId);
		}
	}
});


browser.menus.onShown.addListener(async function(info/*, tab*/) {
	if(info.bookmarkId ) {
		const children = (await browser.bookmarks.getChildren(info.bookmarkId)).filter( child => child.url).map( child => child.url);
		if(Array.isArray(children) && children.length > 0) {
			browser.menus.update(extname, {visible: true});
		}else{
			browser.menus.update(extname, {visible: false});
		}
	}
	browser.menus.refresh();
});
