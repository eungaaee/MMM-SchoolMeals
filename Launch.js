/* Magic Mirror
 * Module: Launch
 *
 * By Avella http://github.com/Av3lla
 * MIT Licensed.
 */
 
// define global variables
let date = new Date().toISOString().replace(/. /g, '-').slice(0, 10);
let launchMenu;

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
		console.log('this.load()');
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
		//get launch menu
		this.getLaunchMenu(eduCode, schoolCode);
	},

    getLaunchMenu: async function(eduCode, schoolCode) {
		console.log(date)
;		const formattedDate = date.replace(/-/g, '').slice(1, 8);
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
			launchMenu = launchInfo.mealServiceDietInfo[1].row[0].DDISH_NM;
		} catch (error) {
			console.log(error.name);
			if (error.name === 'TypeError') {
				launchMenu = "오늘은 급식이 없는 것 같습니다. :<";
			}
		}
	},
	
    getDom: function() {
		var wrapper = document.createElement("div");
		var textWrapper = document.createElement("div");
		
		if (launchMenu === '') {
			textWrapper.innerHTML = "Error> Launch menu not loaded. :<";
		}
		
		textWrapper.className = "align-left week dimmed medium";
		textWrapper.innerHTML = launchMenu;
		
		wrapper.appendChild(textWrapper);
		
		return wrapper;
    }
});
