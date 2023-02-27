/* Magic Mirror
 * Module: Launch
 *
 * By Avella https://github.com/Av3lla
 * MIT Licensed.
 */
Module.register("Launch", {
    defaults: {
      key: null,
      schoolName: null,
      updateInterval: 1000 * 60 * 60
    },
  
    start: function() {
      // define global variables
      this.fullSchoolName;
      this.isThereLaunch;
      this.mealType;
      this.launchMenu = '';
      this.kcal;
      this.nutritions;
      this.origins;

      var self = this;
      Log.info("Starting module: " + this.name);
      // load data
      this.load();
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
      const schoolInfo = await fetch(requestUrl)
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
      this.fullSchoolName = result.SCHUL_NM;
      //get launch menu
      this.getLaunchMenu(eduCode, schoolCode);
    },

    getLaunchMenu: async function(eduCode, schoolCode) {
      const formattedDate = date.replace(/-/g, '').slice(1, 8);
      // request
      const url = "https://open.neis.go.kr/hub/mealServiceDietInfo";
      const requestUrl = `${url}?Key=${this.config.key}&Type=${'json'}&pIndex=${1}&pSize=${100}&ATPT_OFCDC_SC_CODE=${eduCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${formattedDate}`;
      // fetch
      const launchInfo = await fetch(requestUrl)
        .then(rawResponse => {
          return rawResponse.json();
        })
        .catch(error => {
          console.log(error);
        });
      // get launch menu
      try {
        this.mealType = launchInfo.mealServiceDietInfo[1].row[0].MMEAL_SC_NM
        const rawLaunchMenu = launchInfo.mealServiceDietInfo[1].row[0].DDISH_NM;
        for (i of rawLaunchMenu.split('<br/>')) {
          this.launchMenu += i.replace(/[^ㄱ-ㅎ가-힣]/g, '') + "<br/>";
        }
        this.kcal = launchInfo.mealServiceDietInfo[1].row[0].CAL_INFO;
        this.origins = launchInfo.mealServiceDietInfo[1].row[0].ORPLC_INFO;
        this.nutritions = launchInfo.mealServiceDietInfo[1].row[0].NTR_INFO;
        this.isThereLaunch = true;
      } catch (error) {
        console.log(error);
        if (error.name === 'TypeError') {
          this.isThereLaunch = false;
        }
      }
      this.updateDom();
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
      var exceptionDiv = document.createElement("div");

      if (this.launchMenu === '') {
        exceptionDiv.innerHTML = "Error> Launch menu not loaded. :<";
        return exceptionDiv;
      } else {		
        if (this.isThereLaunch === false) {
          exceptionDiv.innerHTML = "오늘은 급식이 없는 것 같습니다. :<";
          return exceptionDiv;
        } else {
          menuDiv.innerHTML = this.launchMenu;
          kcalDiv.innerHTML = this.kcal;
          originDiv.innerHTML = this.origins;
          nutriDiv.innerHTML = this.nutritions;
  
          menuInfoDiv.append(kcalDiv, originDiv);
        }
      }

      mainDiv.append(menuDiv, menuInfoDiv);
      return mainDiv;
    }
});