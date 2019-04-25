let ddoc =  { _id:'_design/cbs' };

ddoc.views = {
	getAllEvents: {
		map: function (doc) {
			if (doc.start) {
				emit(doc.id, true);
			}
		}
	}
};

module.exports = ddoc;