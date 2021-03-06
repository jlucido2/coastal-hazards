var CCH = CCH || {};
CCH.Objects.Cards = function(args) {
	var me = (this === window) ? {} : this;
	me.currentApplicationSize;
	me.pinnedCount;
	return $.extend(me, {
		init: function() {
			$(window).on({
				'cch.ui.resized': function(evt, size) {
					me.currentApplicationSize = size;
				},
				'cch.navbar.pinmenu.item.clear.click': function(evt) {
					me.unpinAllCards();
				},
				'cch.ui.initialized': function(evt) {
					me.updatePinnedCount();
				}
			});

			return me;
		},
		buildCard: function(args) {
			var item = CCH.items.getById({
				'id': args.itemId
			});

			var card = new CCH.Objects.Card({
				item: item,
				size: me.currentApplicationSize
			});

			$(card).on({
				'card-button-pin-clicked': function(evt) {
					var card = evt.currentTarget;
					var toggledOn = CCH.session.toggleItem(card.item);
					if (toggledOn) {
						card.pin();
					} else {
						card.unpin();
					}
					me.updatePinnedCount();
				}
			});

			return card.create();
		},
		unpinAllCards: function() {
			var pinnedCards = me.getPinnedCards();
			pinnedCards.each(function(card) {
				$(card).trigger('card-button-pin-clicked');
			});
		},
		getPinnedCards: function() {
			var pinnedCards = [];
			var cardContainers = $('.description-container');
			for (var ccIdx = 0; ccIdx < cardContainers.length; ccIdx++) {
				var cardContainer = cardContainers[ccIdx];
				var card = $(cardContainer).data('card');
				if (card.pinned) {
					pinnedCards.push(card);
				}
			}
			return pinnedCards;
		},
		getPinnedCount: function() {
			return me.pinnedCount;
		},
		updatePinnedCount: function() {
			me.pinnedCount = CCH.session.getPinnedCount();
			$('#app-navbar-pin-control-pincount').html(me.pinnedCount);
			if (me.pinnedCount > 0) {
				$('#app-navbar-pin-control-button').removeClass('disabled');
				$('#app-navbar-pin-control-dropdown-button').removeClass('disabled');
			} else {
				$('#app-navbar-pin-control-button').addClass('disabled');
				$('#app-navbar-pin-control-dropdown-button').addClass('disabled');
			}
			return me.pinnedCount;
		}
	});
};