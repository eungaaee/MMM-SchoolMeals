/* Magic Mirror
 * Module: Launch
 *
 * By Avella http://github.com/Av3lla
 * MIT Licensed.
 */
 
// define global variables
let date = new Date().toISOString().replace(/. /g, '-').slice(0, 10);
let fullSchoolName;
let mealType;
let launchMenu = '';
let kcal;
let nutritions;
let origins;


Module.register("Launch", {
    defaults: {
			key: "null",
			schoolName: "동양고등학교",
			updateInterval: 1000 * 60 * 60
    },
	
    start: function() {
			var self = this;
			Log.info("Starting module: " + this.name);
			// load data
			this.load()
			// schedule refresh
			setInterval(function() {
				self.updateDom();
			}, this.config.updateInterval)
    },

    load: function() {
			this.getSchoolInfo();
    },
    
    getStyles: function() {
			return ["Launch.css"];
		},
    
		getHeader: function() {
      return `${fullSchoolName} ${mealType}`;
    },

    getSchoolInfo: async function() {
			// request
			const url = "https://open.neis.go.kr/hub/schoolInfo";
			const requestUrl = `${url}?Key=${this.config.key}&Type=${'json'}&pIndex=${1}&pSize=${100}&SCHUL_NM=${this.config.schoolName}`;
			// fetch
			let schoolInfo = await fetch(requestUrl)
				.then(rawResponse => {
					return rawResponse.json();
				})
				.catch(error => {
					console.log(error);
				});
			// get school code from schoolInfo
			const result = schoolInfo.schoolInfo[1].row[0];
			const eduCode = result.ATPT_OFCDC_SC_CODE;
			const schoolCode = result.SD_SCHUL_CODE;
			fullSchoolName = result.SCHUL_NM;
			//get launch menu
			this.getLaunchMenu(eduCode, schoolCode);
		},

    getLaunchMenu: async function(eduCode, schoolCode) {
			//const formattedDate = date.replace(/-/g, '').slice(1, 8);
			const formattedDate = "20220302";
			// request
			const url = "https://open.neis.go.kr/hub/mealServiceDietInfo";
			const requestUrl = `${url}?Key=${this.config.key}&Type=${'json'}&pIndex=${1}&pSize=${100}&ATPT_OFCDC_SC_CODE=${eduCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${formattedDate}`;
			console.log(requestUrl);
			// fetch
			let launchInfo = await fetch(requestUrl)
				.then(rawResponse => {
					return rawResponse.json();
				})
				.catch(error => {
					console.log(error);
				});
			// get launch menu
			try {
				mealType = launchInfo.mealServiceDietInfo[1].row[0].MMEAL_SC_NM
				let rawLaunchMenu = launchInfo.mealServiceDietInfo[1].row[0].DDISH_NM;
				for (i of rawLaunchMenu.split('<br/>')) {
					launchMenu += i.replace(/[^ㄱ-ㅎ가-힣]/g, '') + "<br/>";
				}
				kcal = launchInfo.mealServiceDietInfo[1].row[0].CAL_INFO;
				origins = launchInfo.mealServiceDietInfo[1].row[0].ORPLC_INFO;
				nutritions = launchInfo.mealServiceDietInfo[1].row[0].NTR_INFO;
			} catch (error) {
				console.log(error);
				if (error.name === 'TypeError') {
					launchMenu = "오늘은 급식이 없는 것 같습니다. :<";
				}
			}
	},
	
    getDom: function() {
			var mainDiv = document.createElement("div");
			mainDiv.className = "main";
			var menuDiv = document.createElement("div");
			menuDiv.className = "menu";
			var menuInfoDiv = document.createElement("div");
			menuInfoDiv.className = "menuInfo";
			var kcalDiv = document.createElement("div");
			kcalDiv.className = "kcal";
			var originDiv = document.createElement("div");
			originDiv.className = "origin";
			var nutriDiv = document.createElement("div");
			nutriDiv.className = "nutri";
		
			if (launchMenu === '') {
				menuDiv.innerHTML = "Error> Launch menu not loaded. :<";
				return menuDiv;
			} else {		
				menuDiv.innerHTML = launchMenu;
				kcalDiv.innerHTML = kcal;
				originDiv.innerHTML = origins;
				nutriDiv.innerHTML = nutritions;
			
				menuInfoDiv.append(kcalDiv, originDiv);
		}

			mainDiv.append(menuDiv, menuInfoDiv);
			return mainDiv;
    }
});