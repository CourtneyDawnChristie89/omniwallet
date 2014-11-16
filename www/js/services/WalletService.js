angular.module("omniServices")
	.service("Wallet",["Address", "Asset",
		function WalletService(Address, Asset ){
			var self = this;

			self.initialize =function(wallet){
	            self.addresses = [];
	            self.assets = [];
	            wallet.addresses.forEach(function(raw){
	                self._addAddress(raw);
	            });
	        };

	        self._addAddress = function(raw){
	        	var address = new Address(raw.address,raw.privkey,raw.pubkey);

                address.socket.on("address:"+address.address, function(data){
                    data.forEach(function(balanceItem) {
                        var tradable = ((address.privkey && address.privkey.length == 58) || address.pubkey) && balanceItem.value > 0;
                        var asset = null;
                        for (var j = 0; j < self.assets.length; j++) {
                          var currencyItem = self.assets[j];
                          if (currencyItem.symbol == balanceItem.symbol) {
                            asset = currencyItem;
                            if (asset.addresses().indexOf(address) == -1){
                             tradable ? asset.tradableAddresses.push(address) : asset.watchAddresses.push(address) ;
                             asset.tradable = asset.tradable || tradable;
                            }
                            break;
                          }
                        }
                        if (asset === null) {
                            asset = new Asset(balanceItem.symbol, balanceItem.divisible, tradable, address)
                            
                            self.assets.push(asset);
                        }
                    });
                });

                self.addresses.push(address)
	        }

	        self._updateAddress = function(address,privKey,pubKey){
	        	for (var i in self.addresses) {
		            if (self.addresses[i].address == address) {
		                if(privKey)
		                  self.addresses[i].privkey = privKey;
		                if(pubKey)
		                  self.addresses[i].pubkey = pubKey;
		            }
	            }
	        }

			// self.initialize = function(){				  
			//     self.selectedCoin = self.currencyList[0];
			//     self.currencyList.forEach(function(e, i) {
			//       if (e.symbol == "MSC")
			//         self.selectedCoin = e;
			//     });
					  
			// 	self.addressListByCoin = self.selectedCoin ? userService.getTradableAddresses(self.selectedCoin.tradableAddresses,true) : [];
			// 	self.addressList = userService.getTradableAddresses(null,true);
			// 	self.selectedAddress = self.addressListByCoin[0] || null;


			// 	// [ Retrieve Balances ]
				
			// 	self.calculateTotal(self.minerFees);
			// 	self.setBitcoinValue(self.getBitcoinValue());  				
			// }

			// self.getBitcoinValue = function(){
			//     var appraiser = $injector.get('appraiser');
			//     return appraiser.getValue(100000000,"BTC");
			// }
			// self.setBitcoinValue = function(value){
			//     self.bitcoinValue = value;
			// } 

			// self.calculateTotal=function(minerFees) {
			//     self.mProtocolCost = MSC_PROTOCOL_COST
			//     if (self.selectedCoin && self.selectedCoin.symbol == 'BTC')
			//     	self.mProtocolCost = 0.0;
			//     self.totalCost = (+new Big(minerFees).plus(self.mProtocolCost).valueOf()).toFixed(8);
			// }

			// self.initialize();
			
			// $rootScope.$watch(function(){return self.selectedCoin;}, function() {
			//     self.addressListByCoin = self.selectedCoin ? userService.getTradableAddresses(self.selectedCoin.tradableAddresses) : [];
			//     self.selectedAddress = self.addressListByCoin[0] || null;
			//     self.setBalance();
			//     self.minerFees = +MIN_MINER_FEE.valueOf(); // reset miner fees
			//     self.calculateTotal(self.minerFees);
			// });

			// $rootScope.$watch(function(){return self.selectedAddress;}, function() {
			// 	self.setBalance();
			//     var pubkey = userService.getAddress(self.selectedAddress).pubkey;
			//     self.offline = pubkey != undefined && pubkey != "";
			// });
		}
	]);